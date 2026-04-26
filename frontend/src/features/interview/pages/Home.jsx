import React from "react";
import "../style/home.scss";

const Home = () => {
  return (
    <main className="home">
      <div className="container">

        {/* Header */}
        <header className="header">
          <h1>AI Interview Generator</h1>
          <p>Upload your resume, add job details, and get an AI-powered interview report.</p>
        </header>

        {/* Main Grid */}
        <section className="grid">

          {/* Left Panel */}
          <div className="card">
            <label>Job Description</label>
            <textarea
              placeholder="Paste job description..."
            />
          </div>

          {/* Right Panel */}
          <div className="card stack">

            <div className="upload-box">
              <label className="btn">
                Upload Resume
                <input type="file" accept=".pdf" hidden />
              </label>
              <p className="hint">PDF only • max 3MB</p>
            </div>

            <div className="card small">
              <label>Self Description</label>
              <textarea placeholder="Tell us about yourself..." />
            </div>

            <button className="primary-btn">
              Generate Interview Report
            </button>

          </div>
        </section>

      </div>
    </main>
  );
};

export default Home;