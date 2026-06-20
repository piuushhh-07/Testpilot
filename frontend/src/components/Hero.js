import React from "react";
import "./Hero.css";

const STAR_POSITIONS = [
  { top: "12%", left: "8%", size: 3, delay: "0s" },
  { top: "20%", left: "85%", size: 4, delay: "0.4s" },
  { top: "65%", left: "5%", size: 2, delay: "0.8s" },
  { top: "75%", left: "92%", size: 3, delay: "1.2s" },
  { top: "8%", left: "45%", size: 2, delay: "1.6s" },
  { top: "50%", left: "95%", size: 3, delay: "2s" },
  { top: "85%", left: "30%", size: 2, delay: "0.6s" },
  { top: "30%", left: "15%", size: 3, delay: "1s" },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-stars">
        {STAR_POSITIONS.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
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
