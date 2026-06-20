require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "TestPilot backend running" });
});

// Generate test cases
app.post("/api/generate", async (req, res) => {
  const { feature, testType, count = 8 } = req.body;

  if (!feature || feature.trim().length < 5) {
    return res.status(400).json({ error: "Please provide a valid feature description." });
  }

  const systemPrompt = `You are a senior QA engineer with 10+ years of experience. 
You generate precise, professional, structured test cases for software features.
Always return ONLY a valid JSON array. No markdown. No explanation. No preamble.`;

  const userPrompt = `Generate ${count} test cases for the following feature.
Test type focus: ${testType || "All Types"}
Feature description: ${feature}

Return ONLY a JSON array with this exact structure:
[
  {
    "id": "TC-001",
    "title": "Short test case title",
    "preconditions": "What needs to be set up before this test",
    "steps": "1. Step one\\n2. Step two\\n3. Step three",
    "expected": "What should happen after the steps",
    "type": "Functional|Edge Case|Negative|Integration",
    "priority": "High|Medium|Low",
    "category": "Short category label"
  }
]

Be specific, practical, and professional. Cover happy paths, edge cases, and failure scenarios based on the test type.`;

  try {
    const completion = await openai.chat.completions.create({
          model: "meta-llama/llama-3.1-8b-instruct",

      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 3000,
    });

    let raw = completion.choices[0].message.content.trim();
    raw = raw.replace(/```json|```/g, "").trim();

    const testCases = JSON.parse(raw);
    res.json({ success: true, count: testCases.length, testCases });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: "Failed to parse AI response. Please try again." });
    }
    if (err?.status === 401) {
      return res.status(401).json({ error: "Invalid OpenAI API key." });
    }
    if (err?.status === 429) {
      return res.status(429).json({ error: "OpenAI rate limit reached. Please try again in a moment." });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Export as CSV (server-side generation)
app.post("/api/export/csv", (req, res) => {
  const { testCases, featureName } = req.body;
  if (!testCases?.length) return res.status(400).json({ error: "No test cases to export." });

  const headers = ["ID", "Title", "Preconditions", "Steps", "Expected Result", "Type", "Priority", "Category"];
  const rows = testCases.map((tc) =>
    [tc.id, tc.title, tc.preconditions, tc.steps, tc.expected, tc.type, tc.priority, tc.category]
      .map((v) => `"${String(v || "").replace(/"/g, '""').replace(/\n/g, " ")}"`)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const filename = `testpilot_${(featureName || "export").replace(/\s+/g, "_").toLowerCase()}.csv`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
});

// Convert test cases into automation code (Playwright or Cypress)
app.post("/api/export/code", async (req, res) => {
  const { testCases, framework = "playwright", featureName } = req.body;

  if (!testCases?.length) {
    return res.status(400).json({ error: "No test cases to convert." });
  }
  if (!["playwright", "cypress"].includes(framework)) {
    return res.status(400).json({ error: "Framework must be 'playwright' or 'cypress'." });
  }

  const testCasesSummary = testCases
    .map(
      (tc) =>
        `${tc.id} | ${tc.title}\nSteps: ${tc.steps}\nExpected: ${tc.expected}\nType: ${tc.type}`
    )
    .join("\n\n");

  const frameworkInstructions =
    framework === "playwright"
      ? `Use Playwright Test syntax (@playwright/test). Use test.describe and test() blocks. Use page.goto, page.fill, page.click, expect(page.locator(...)).toBeVisible() etc. Use realistic but generic CSS selectors / data-testid placeholders since the actual DOM is unknown.`
      : `Use Cypress syntax. Use describe() and it() blocks. Use cy.visit, cy.get, cy.type, cy.click, cy.should etc. Use realistic but generic CSS selectors / data-testid placeholders since the actual DOM is unknown.`;

  const systemPrompt = `You are a senior automation QA engineer. You convert manual test cases into clean, runnable automation test code.
${frameworkInstructions}
Add a short comment above each test linking back to its test case ID (e.g. // TC-001).
Where selectors are unknown, use sensible data-testid placeholders (e.g. [data-testid="email-input"]) and add a one-line comment noting it should be replaced with the real selector.
Return ONLY the code. No markdown fences, no explanation, no preamble — just the raw code file content.`;

  const userPrompt = `Feature: ${featureName || "Untitled feature"}

Convert these test cases into ${framework === "playwright" ? "Playwright" : "Cypress"} automation code:

${testCasesSummary}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 3500,
    });

    let code = completion.choices[0].message.content.trim();
    code = code.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();

    const extension = framework === "playwright" ? "spec.ts" : "cy.js";
    const filename = `testpilot_${(featureName || "tests").replace(/\s+/g, "_").toLowerCase()}.${extension}`;

    res.json({ success: true, framework, code, filename });
  } catch (err) {
    if (err?.status === 401) {
      return res.status(401).json({ error: "Invalid API key." });
    }
    if (err?.status === 429) {
      return res.status(429).json({ error: "Rate limit reached. Please try again in a moment." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to generate automation code. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 TestPilot backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
