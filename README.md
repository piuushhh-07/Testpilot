# TestPilot — AI-Powered Test Case Generator

Built by TestaraQA. Describe a feature in plain English, get a structured test suite back, instantly — powered by GPT-4o.

---

## 📁 Project Structure

```
testpilot/
├── backend/          → Node.js + Express server (talks to OpenAI)
│   ├── src/index.js
│   ├── package.json
│   └── .env.example
└── frontend/         → React website (what users see)
    ├── src/
    │   ├── components/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🚀 How to Run This (Step by Step)

You need **Node.js** installed. Check by running:
```
node -v
```
If you don't have it, download from https://nodejs.org (get the LTS version).

---

### Step 1 — Set up the Backend

```bash
cd backend
npm install
```

Then create your real `.env` file:
```bash
cp .env.example .env
```

Open `.env` and paste your real OpenAI API key:
```
OPENAI_API_KEY=sk-your-real-key-here
PORT=5000
```

Start the backend:
```bash
npm start
```

You should see:
```
🚀 TestPilot backend running on http://localhost:5000
```

**Leave this terminal running.**

---

### Step 2 — Set up the Frontend

Open a **new terminal window/tab** (keep the backend one running):

```bash
cd frontend
npm install
npm start
```

This will automatically open `http://localhost:3000` in your browser — that's your TestPilot app! 🎉

---

## 🔑 Where to Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy it and paste into `backend/.env`

At the hackathon, you'll get $100 in free OpenAI credits — use that key instead.

---

## 🖼️ Adding Your Logo

Open `frontend/src/components/Navbar.js` and find this block:

```jsx
{/* LOGO PLACEHOLDER — replace the div below with your <img> tag */}
<div className="logo-placeholder">
  <span className="logo-placeholder-text">LOGO</span>
</div>
```

Replace it with:
```jsx
<img src="/logo.png" alt="TestaraQA" className="navbar-logo" />
```

Then drop your logo file into `frontend/public/logo.png`.

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| "command not found: npm" | Install Node.js from nodejs.org |
| Backend shows "Invalid API key" | Double check `.env` has the correct key, no extra spaces |
| Frontend loads but Generate button fails | Make sure backend terminal is still running on port 5000 |
| Port already in use | Change `PORT=5000` to `PORT=5001` in `.env`, and update `"proxy"` in `frontend/package.json` to match |

---

## 📦 What This App Does

1. User describes a feature in plain English
2. Picks a test type (Functional / Edge Cases / Negative / Integration / All)
3. Backend sends this to GPT-4o with a QA-engineer prompt
4. GPT-4o returns structured test cases (steps, expected result, priority)
5. Frontend displays them in a clean table
6. User can copy all or export as CSV

---

Built for AIBoomi Startup Weekend (4th Edition) — Bengaluru, June 20–21.
