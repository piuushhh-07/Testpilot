import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import Results from "./components/Results";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const API_URL = "https://testpilot-ruby.vercel.app";
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [featureName, setFeatureName] = useState("");

  const handleGenerate = async ({ feature, testType, count }) => {
    setLoading(true);
    setError("");
    setTestCases([]);
    setFeatureName(feature.slice(0, 40));

    try {
     const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, testType, count }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setTestCases(data.testCases);

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/export/csv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCases, featureName }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `testpilot_${featureName.replace(/\s+/g, "_") || "export"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Generator onGenerate={handleGenerate} loading={loading} error={error} />
      {testCases.length > 0 && (
        <Results testCases={testCases} onExport={handleExport} featureName={featureName} />
      )}
      <Footer />
    </div>
  );
}
