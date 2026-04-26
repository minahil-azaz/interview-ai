import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import useInterview from "../hooks/useInterview";
import { useParams } from "react-router-dom";

// helper function for color
const getScoreColor = (score) => {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

const Interview = () => {
  const {
    report,
    getReportById,
    loading,
    downloadResumePdf, // ✅ added
  } = useInterview();

  const { interviewId } = useParams();
  const [activeSection, setActiveSection] = useState("technical");

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading) {
    return (
      <main className="interview-loading">
        <div className="loading-spinner"></div>
        <h1>Loading your interview plan...</h1>
        <p>Preparing personalized questions for you</p>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="interview-loading">
        <h1>No report found</h1>
        <p>Please generate an interview report first.</p>
      </main>
    );
  }

  const data = report;

  const renderSection = () => {
    switch (activeSection) {
      case "technical":
        return (
          <div className="questions-section">
            <h2>Technical Questions</h2>

            {data.technicalQuestions?.map((q, idx) => (
              <div key={idx} className="question-card">
                <p>{q.question}</p>

                {q.score !== undefined && (
                  <div
                    className="score-badge"
                    style={{
                      backgroundColor: getScoreColor(q.score),
                    }}
                  >
                    {q.score}/100
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "behavioral":
        return (
          <div className="questions-section">
            <h2>Behavioral Questions</h2>

            {data.behaviouralQuestions?.map((q, idx) => (
              <div key={idx} className="question-card">
                <p>{q.question}</p>
              </div>
            ))}
          </div>
        );

      case "roadmap":
        return (
          <div className="questions-section">
            <h2>Preparation Roadmap</h2>

            {data.preparationTips?.map((tip, idx) => {
              // Handle different tip formats: {day, focus, tasks} or {title, description}
              const dayNum = tip.day || idx + 1;
              const focus = tip.focus || tip.title || "";
              const description = tip.description || "";
              const tasks = tip.tasks || [];
              
              return (
                <div key={idx} className="roadmap-card">
                  <div className="roadmap-day">Day {dayNum}</div>
                  <div className="roadmap-content">
                    <h4>{focus}</h4>
                    {description && <p>{description}</p>}
                    {tasks.length > 0 && (
                      <ul className="roadmap-tasks">
                        {tasks.map((task, taskIdx) => (
                          <li key={taskIdx}>{task}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="interview-page">
      {/* Header */}
      <header className="interview-header">
        <h1>AI Interview Preparation</h1>
      </header>

      <div className="interview-layout">
        {/* Left Sidebar */}
        <aside className="sidebar left">
          <nav className="nav-menu">
            <button
              className={`nav-btn ${
                activeSection === "technical" ? "active" : ""
              }`}
              onClick={() => setActiveSection("technical")}
            >
              💻 Technical Questions
            </button>

            <button
              className={`nav-btn ${
                activeSection === "behavioral" ? "active" : ""
              }`}
              onClick={() => setActiveSection("behavioral")}
            >
              💬 Behavioral Questions
            </button>

            <button
              className={`nav-btn ${
                activeSection === "roadmap" ? "active" : ""
              }`}
              onClick={() => setActiveSection("roadmap")}
            >
              🗺️ Roadmap
            </button>

            {/* ✅ NEW BUTTON */}
            <button
              className="nav-btn resume-btn"
              onClick={() => downloadResumePdf(interviewId)}
            >
              📄 Generate Resume PDF
            </button>
          </nav>

          {/* Job Summary */}
          <div className="job-summary">
            <h3>Job Summary</h3>
            <p>{data.title || "Interview Report"}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">{renderSection()}</main>

        {/* Right Sidebar */}
        <aside className="sidebar right">
          <h3>🎯 Skill Gaps</h3>

          {data.skillGap?.map((item, idx) => (
            <div key={idx} className="skill-tag-card">
              {item.skill}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Interview;