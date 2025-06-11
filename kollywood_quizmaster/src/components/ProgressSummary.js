import React from "react";

// PUBLIC_INTERFACE
function ProgressSummary({ results, onBack, themeColors }) {
  const quizzes = [
    "BlurredPosterQuiz",
    "CharacterMovieMatch",
    "MovieBingo",
    "MovieTimeline",
    "SpinTheWheel",
    "CastCombo",
  ];
  return (
    <div style={{ padding: "48px 0 56px 0" }}>
      <div
        className="title"
        style={{
          color: themeColors.primary,
          fontWeight: 700,
          fontSize: "2.5rem",
        }}
      >
        🎉 Quiz Summary
      </div>
      <div className="subtitle" style={{ color: themeColors.secondary }}>
        Here's how you did!
      </div>
      <div style={{ margin: "34px 0", maxWidth: 510, marginLeft: "auto", marginRight: "auto" }}>
        <table
          style={{
            fontSize: "1.1rem",
            width: "100%",
            textAlign: "center",
            background: "#fff",
            borderCollapse: "collapse",
            boxShadow: "0 2px 6px #f5ce9340",
          }}
        >
          <thead>
            <tr style={{ color: themeColors.primary }}>
              <th style={{ borderBottom: "2px solid #E67E22", padding: 10 }}>Quiz</th>
              <th style={{ borderBottom: "2px solid #E67E22", padding: 10 }}>Score</th>
              <th style={{ borderBottom: "2px solid #E67E22", padding: 10 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q}>
                <td style={{ borderBottom: "1px solid #eee", padding: 10 }}>{q.replace(/([A-Z])/g, " $1").trim()}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: 10 }}>
                  {results[q] ? `${results[q].score}/10` : "-"}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 7 }}>
                  {results[q] ? (results[q].details ? results[q].details : "✓") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn"
        style={{ background: themeColors.secondary, color: "#fff", fontWeight: 600, fontSize: "1rem" }}
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default ProgressSummary;
