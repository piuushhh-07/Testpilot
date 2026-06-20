import React, { useState } from "react";
import "./Generator.css";

const TEST_TYPES = [
  { label: "All Types", value: "All Types" },
  { label: "Functional", value: "Functional" },
  { label: "Edge Cases", value: "Edge Cases" },
  { label: "Negative", value: "Negative" },
  { label: "Integration", value: "Integration" },
];

const COUNT_OPTIONS = [5, 8, 10, 15];

const EXAMPLES = [
  "Login page with email and password. Show error for wrong credentials. Lock account after 5 failed attempts. Forgot password sends reset email.",
  "Payment checkout flow: user enters card details, billing address, applies promo code, and completes purchase. Show error if card is declined.",
  "User profile page: edit name, email, profile photo, and bio. Changes should save instantly. Email change requires verification.",
  "Search feature: returns results by keyword. Filters by category, date, and price range. No results screen shows suggestions.",
];

export default function Generator({ onGenerate, loading, error }) {
  const [feature, setFeature] = useState("");
  const [testType, setTestType] = useState("All Types");
  const [count, setCount] = useState(8);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feature.trim()) return;
    onGenerate({ feature, testType, count });
  };

  const loadExample = () => {
    const random = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    setFeature(random);
  };

  const charCount = feature.length;

  return (
    <section className="generator">
      <div className="generator-inner">
        <div className="generator-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-label-row">
                <label className="form-label">Feature description</label>
                <button type="button" className="example-btn" onClick={loadExample}>
                  Load example
                </button>
              </div>
              <textarea
                className="feature-textarea"
                placeholder="Describe what the feature does, what inputs it accepts, what validations it performs, and what outputs it produces..."
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                rows={5}
                maxLength={2000}
              />
              <div className="textarea-footer">
                <span className="char-count">{charCount}/2000</span>
                {charCount > 0 && (
                  <button type="button" className="clear-btn" onClick={() => setFeature("")}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-section form-section-half">
                <label className="form-label">Test type</label>
                <div className="type-pills">
                  {TEST_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`pill ${testType === t.value ? "pill-active" : ""}`}
                      onClick={() => setTestType(t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section form-section-half">
                <label className="form-label">Number of test cases</label>
                <div className="count-pills">
                  {COUNT_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`pill pill-count ${count === n ? "pill-active" : ""}`}
                      onClick={() => setCount(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="error-banner">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="generate-btn"
              disabled={loading || !feature.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Generating test cases...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="9" cy="9" r="2.5" fill="currentColor" />
                  </svg>
                  Generate {count} test cases
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
