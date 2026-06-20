import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-name">TestPilot</span>
          <span className="footer-sep">·</span>
          <span className="footer-tagline">We Test. You Trust.</span>
        </div>
        <div className="footer-right">
          <span className="footer-copy">Built by</span>
          <a
            href="https://testaraqa.com"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            TestaraQA
          </a>
        </div>
      </div>
    </footer>
  );
}
