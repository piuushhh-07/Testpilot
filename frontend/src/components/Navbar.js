import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          {/* LOGO PLACEHOLDER — replace the div below with your <img> tag */}
         <img src="/logo.png" alt="TestaraQA" className="navbar-logo" />
          <div className="brand-text">
            <span className="brand-name">TestPilot</span>
            <span className="brand-by">by TestaraQA</span>
          </div>
        </div>
        <div className="navbar-right">
          <span className="nav-badge">
            <span className="nav-badge-dot" />
            GPT-4o powered
          </span>
          <a
            href="https://testaraqa.com"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            testaraqa.com
          </a>
        </div>
      </div>
    </nav>
  );
}
