import React, { useState } from "react";
import "./CodeExportModal.css";

const FRAMEWORK_LABELS = {
  playwright: "Playwright",
  cypress: "Cypress",
  selenium: "Selenium",
  jest: "Jest",
};

const FRAMEWORK_EXTENSIONS = {
  playwright: "spec.ts",
  cypress: "cy.js",
  selenium: "test.js",
  jest: "test.js",
};

export default function CodeExportModal({ testCases, featureName, onClose }) {
  const [framework, setFramework] = useState("playwright");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");
  const [copied, setCopied] = useState(false);

  const generateCode = async (fw) => {
    setFramework(fw);
    setLoading(true);
    setError("");
    setCode("");

    try {
      const res = await fetch("/api/export/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCases, framework: fw, featureName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate code.");
      setCode(data.code);
      setFilename(data.filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `testpilot_tests.${FRAMEWORK_EXTENSIONS[framework] || "spec.ts"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Export as automation code</h3>
            <p className="modal-subtitle">
              Turn these test cases into runnable test code instantly
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="framework-tabs">
          {Object.keys(FRAMEWORK_LABELS).map((fw) => (
            <button
              key={fw}
              className={`framework-tab ${framework === fw ? "framework-tab-active" : ""}`}
              onClick={() => generateCode(fw)}
              disabled={loading}
            >
              {FRAMEWORK_LABELS[fw]}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {!code && !loading && !error && (
            <div className="modal-empty">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M11 9L5 16l6 7M21 9l6 7-6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Pick a framework above to generate code from your {testCases.length} test cases.</p>
              <button className="modal-generate-btn" onClick={() => generateCode(framework)}>
                Generate {FRAMEWORK_LABELS[framework]} code
              </button>
            </div>
          )}

          {loading && (
            <div className="modal-loading">
              <span className="modal-spinner" />
              <p>Converting test cases into {FRAMEWORK_LABELS[framework]} code...</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <p>{error}</p>
              <button className="modal-retry-btn" onClick={() => generateCode(framework)}>
                Try again
              </button>
            </div>
          )}

          {code && !loading && (
            <>
              <div className="code-toolbar">
                <span className="code-filename">{filename}</span>
                <div className="code-actions">
                  <button className="code-action-btn" onClick={copyCode}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button className="code-action-btn code-action-primary" onClick={downloadCode}>
                    Download
                  </button>
                </div>
              </div>
              <pre className="code-block">
                <code>{code}</code>
              </pre>
            </>
          )}
        </div>

        <div className="modal-footer">
          <p className="modal-note">
            Selectors are placeholders — swap in your app's real <code>data-testid</code> attributes before running.
          </p>
        </div>
      </div>
    </div>
  );
}