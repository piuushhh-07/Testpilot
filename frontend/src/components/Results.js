import React, { useState } from "react";
import CodeExportModal from "./CodeExportModal";
import "./Results.css";

const PRIORITY_CONFIG = {
  High: { cls: "priority-high", label: "High" },
  Medium: { cls: "priority-med", label: "Med" },
  Low: { cls: "priority-low", label: "Low" },
};

export default function Results({ testCases, onExport, featureName }) {
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const toggleRow = (id) => setExpanded(expanded === id ? null : id);

  const copyAll = () => {
    const text = testCases
      .map(
        (tc) =>
          `${tc.id} — ${tc.title}\nSteps: ${tc.steps}\nExpected: ${tc.expected}\nPriority: ${tc.priority}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highCount = testCases.filter((t) => t.priority === "High").length;
  const medCount = testCases.filter((t) => t.priority === "Medium").length;
  const lowCount = testCases.filter((t) => t.priority === "Low").length;

  return (
    <section className="results" id="results-section">
      <div className="results-inner">
        <div className="results-header">
          <div className="results-meta">
            <h2 className="results-title">
              {testCases.length} test cases generated
            </h2>
            {featureName && (
              <p className="results-feature">for: {featureName}...</p>
            )}
          </div>
          <div className="results-actions">
            <button className="action-btn" onClick={copyAll}>
              {copied ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 8l4 4 7-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3 10V3a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Copy all
                </>
              )}
            </button>
            <button className="action-btn action-btn-code" onClick={() => setShowCodeModal(true)}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M5 4L2 7.5L5 11M10 4l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export as code
            </button>
            <button className="action-btn action-btn-primary" onClick={onExport}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1v8M4.5 6.5l3 3 3-3M2 10v3h11v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="priority-summary">
          <div className="priority-chip priority-high-chip">
            <span>{highCount}</span> High
          </div>
          <div className="priority-chip priority-med-chip">
            <span>{medCount}</span> Medium
          </div>
          <div className="priority-chip priority-low-chip">
            <span>{lowCount}</span> Low
          </div>
          <div className="priority-chip priority-total-chip">
            <span>{testCases.length}</span> Total
          </div>
        </div>

        <div className="table-card">
          <div className="table-scroll">
            <table className="test-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-title">Title</th>
                  <th className="col-type">Type</th>
                  <th className="col-priority">Priority</th>
                  <th className="col-expand"></th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((tc) => {
                  const pr = PRIORITY_CONFIG[tc.priority] || PRIORITY_CONFIG.Medium;
                  const isOpen = expanded === tc.id;
                  return (
                    <React.Fragment key={tc.id}>
                      <tr
                        className={`test-row ${isOpen ? "test-row-open" : ""}`}
                        onClick={() => toggleRow(tc.id)}
                      >
                        <td className="col-id">
                          <span className="tc-id">{tc.id}</span>
                        </td>
                        <td className="col-title">
                          <span className="tc-title">{tc.title}</span>
                        </td>
                        <td className="col-type">
                          <span className="tc-type">{tc.type}</span>
                        </td>
                        <td className="col-priority">
                          <span className={`priority-badge ${pr.cls}`}>
                            {pr.label}
                          </span>
                        </td>
                        <td className="col-expand">
                          <svg
                            className={`expand-icon ${isOpen ? "expand-icon-open" : ""}`}
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="detail-row">
                          <td colSpan={5}>
                            <div className="detail-panel">
                              {tc.preconditions && (
                                <div className="detail-block">
                                  <div className="detail-label">Preconditions</div>
                                  <div className="detail-value">{tc.preconditions}</div>
                                </div>
                              )}
                              <div className="detail-block">
                                <div className="detail-label">Steps</div>
                                <div className="detail-value detail-steps">{tc.steps}</div>
                              </div>
                              <div className="detail-block">
                                <div className="detail-label">Expected result</div>
                                <div className="detail-value detail-expected">{tc.expected}</div>
                              </div>
                              {tc.category && (
                                <div className="detail-tag">
                                  <span>{tc.category}</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="results-hint">
          Click any row to expand steps and expected results.
        </p>
      </div>

      {showCodeModal && (
        <CodeExportModal
          testCases={testCases}
          featureName={featureName}
          onClose={() => setShowCodeModal(false)}
        />
      )}
    </section>
  );
}
