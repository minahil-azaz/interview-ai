import React, { useState, useRef, useEffect } from "react";
import useInterview from "../hooks/useInterview";
import "../style/home.scss";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const resumeInputRef = useRef();

  const {
    generateReport,
    getAllReports,
    reports,
    loading,
  } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  // Load reports
  useEffect(() => {
    getAllReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      // Validate resume is selected
      if (!resume) {
        setError("Please upload a resume first");
        return;
      }

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resume,
      });

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const clearError = () => setError(null);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const removeFile = () => {
    setResume(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <main className="home">
        <h1>Loading your Interview...</h1>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="container">

        {/* Header */}
        <header className="header">
          <h1>AI Interview Generator</h1>
          <p>
            Upload your resume, add job details, and get AI-powered interview reports.
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={clearError} className="close-btn">
              ×
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid">

          {/* Left */}
          <div className="card">
            <label>Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description..."
            />
          </div>

          {/* Right */}
          <div className="card stack">

            {/* Upload */}
            <div className="upload-box">
              <label htmlFor="resume" className="btn">
                {resume ? resume.name : "Upload Resume"}
              </label>

              <input
                type="file"
                id="resume"
                accept=".pdf"
                hidden
                ref={resumeInputRef}
                onChange={handleResumeChange}
              />

              <p className="hint">PDF only • max 3MB</p>

              {resume && (
                <button
                  type="button"
                  className="remove-file"
                  onClick={removeFile}
                >
                  Remove File
                </button>
              )}
            </div>

            {/* Self Description */}
            <div className="card small">
              <label>Self Description</label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Submit */}
            <button
              className="primary-btn"
              onClick={handleGenerateReport}
            >
              Generate Interview Report
            </button>

          </div>
        </div>

        {/* Recent Reports */}
        <section className="recent-reports">
          <h2>Recent Reports</h2>

          {reports?.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <div className="report-list">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="report-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <h4>{report.jobTitle || "Interview Report"}</h4>

                  <p>
                    Created On:{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  <p>
                    Match Score:{" "}
                    <strong>
                      {report.matchScore?.overall ?? report.matchScore ?? report.score ?? "N/A"}%
                    </strong>
                  </p>

                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Home;