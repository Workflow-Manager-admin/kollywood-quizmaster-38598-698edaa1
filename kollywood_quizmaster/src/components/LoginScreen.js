import React, { useState } from "react";

// PUBLIC_INTERFACE
function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  function submit(e) {
    e.preventDefault();
    if (name.trim().length < 3) {
      setErr("Enter your name (at least 3 characters).");
      return;
    }
    setErr("");
    onLogin({ displayName: name.trim() });
  }

  return (
    <div className="hero" style={{ paddingTop: "140px" }}>
      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          marginBottom: 12,
          color: "#2C3E50",
        }}
      >
        Welcome to Kollywood QuizMaster!
      </div>
      <div className="subtitle" style={{ color: "#E67E22" }}>
        Log in to test your Kollywood movie knowledge.
      </div>
      <form
        onSubmit={submit}
        style={{
          margin: "32px 0",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "300px",
          maxWidth: "95vw",
        }}
      >
        <input
          style={{
            border: "1px solid #E67E22",
            borderRadius: 4,
            padding: "10px 16px",
            fontSize: "1rem",
            color: "#222",
          }}
          placeholder="Enter your name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={30}
        />
        <button className="btn" type="submit">
          Log In
        </button>
        {err && (
          <div
            style={{
              color: "#c0392b",
              background: "#fdecec",
              padding: "5px 8px",
              borderRadius: 3,
              marginTop: "-8px",
            }}
          >
            {err}
          </div>
        )}
      </form>
      <div
        style={{
          color: "#888",
          fontSize: "0.95rem",
          marginTop: 24,
          opacity: 0.7,
        }}
      >
        No registration required. Your progress is tracked for this session!
      </div>
    </div>
  );
}

export default LoginScreen;
