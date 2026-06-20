import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-tag">We Test. You Trust.</div>
        <h1 className="hero-title">
          Generate test cases
          <br />
          <span className="hero-accent">in seconds, not hours.</span>
        </h1>
        <p className="hero-subtitle">
          Describe any feature. TestPilot uses GPT-4o to instantly produce a
          complete, structured test suite — ready to export and execute.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10x</span>
            <span className="stat-label">faster than manual</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">GPT-4o</span>
            <span className="stat-label">AI engine</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">CSV</span>
            <span className="stat-label">export ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
