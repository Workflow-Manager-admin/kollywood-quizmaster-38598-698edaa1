import React, { useState, useEffect } from "react";
import "./App.css";
import {
  getKollywoodMovies,
  getMovieDetails,
  searchKollywoodPersonMovies,
} from "./api/tmdb";

import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import BlurredPosterQuiz from "./components/BlurredPosterQuiz";
import CharacterMovieMatch from "./components/CharacterMovieMatch";
import MovieBingo from "./components/MovieBingo";
import MovieTimeline from "./components/MovieTimeline";
import SpinTheWheel from "./components/SpinTheWheel";
import CastCombo from "./components/CastCombo";
import ProgressSummary from "./components/ProgressSummary";

// PUBLIC_INTERFACE
function App() {
  const [user, setUser] = useState(() =>
    localStorage.getItem("kq_user")
      ? JSON.parse(localStorage.getItem("kq_user"))
      : null
  );
  const [view, setView] = useState("dashboard"); // 'dashboard', or gameType
  const [quizResults, setQuizResults] = useState({});
  const [currentGame, setCurrentGame] = useState(null); // { type, ...data }
  const [themeColors] = useState({
    primary: "#2C3E50",
    secondary: "#E67E22",
    accent: "#27AE60",
  });

  // Allow theme color override via CSS vars upon mount
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--base-dark", themeColors.primary);
    root.style.setProperty("--base-light", themeColors.secondary);
    root.style.setProperty("--accent-color", themeColors.accent);
  }, [themeColors]);

  // Handles logout
  function handleLogout() {
    localStorage.removeItem("kq_user");
    setUser(null);
    setView("dashboard");
    setCurrentGame(null);
    setQuizResults({});
  }

  // Handles login and user state
  function handleLogin(userObj) {
    localStorage.setItem("kq_user", JSON.stringify(userObj));
    setUser(userObj);
    setView("dashboard");
  }

  // Handles start quiz
  function handleStartGame(gameType) {
    setCurrentGame({ type: gameType });
    setView(gameType);
  }

  // Handles quiz completion to dashboard/summary
  function handleGameFinished(gameType, result) {
    setQuizResults((prev) => ({ ...prev, [gameType]: result }));
    setCurrentGame(null);
    setView("summary");
  }

  // Returns true if current user is present
  const isLoggedIn = !!user;

  // Top navigation bar component
  const AppNav = () => (
    <nav className="navbar" style={{ background: themeColors.primary }}>
      <div className="container" style={{ width: "100%" }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}
        >
          <div className="logo">
            <span
              className="logo-symbol"
              style={{ color: themeColors.secondary, fontWeight: 900 }}
            >
              <span role="img" aria-label="cinema">
                🎬
              </span>
            </span>
            Kollywood QuizMaster
          </div>
          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  background: themeColors.secondary,
                  color: "#fff",
                  borderRadius: "100px",
                  padding: "6px 18px",
                  fontWeight: 500,
                  marginRight: "8px",
                }}
              >
                Hello, {user.displayName}
              </div>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );

  let content = null;

  if (!isLoggedIn) {
    content = <LoginScreen onLogin={handleLogin} />;
  } else if (view === "dashboard") {
    content = (
      <Dashboard
        onStartGame={handleStartGame}
        quizResults={quizResults}
        themeColors={themeColors}
      />
    );
  } else if (view === "BlurredPosterQuiz") {
    content = (
      <BlurredPosterQuiz
        onFinished={(result) => handleGameFinished("BlurredPosterQuiz", result)}
        onBack={() => setView("dashboard")}
        themeColors={themeColors}
        user={user}
      />
    );
  } else if (view === "CharacterMovieMatch") {
    content = (
      <CharacterMovieMatch
        onFinished={(result) =>
          handleGameFinished("CharacterMovieMatch", result)
        }
        onBack={() => setView("dashboard")}
        themeColors={themeColors}
        user={user}
      />
    );
  } else if (view === "MovieBingo") {
    content = (
      <MovieBingo
        onFinished={(result) => handleGameFinished("MovieBingo", result)}
        onBack={() => setView("dashboard")}
        themeColors={themeColors}
        user={user}
      />
    );
  } else if (view === "MovieTimeline") {
    content = (
      <MovieTimeline
        onFinished={(result) => handleGameFinished("MovieTimeline", result)}
        onBack={() => setView("dashboard")}
        themeColors={themeColors}
        user={user}
      />
    );
  } else if (view === "SpinTheWheel") {
    content = (
      <SpinTheWheel
        onFinished={(result) => handleGameFinished("SpinTheWheel", result)}
        onBack={() => setView("dashboard")}
        themeColors={themeColors}
        user={user}
      />
    );
  } else if (view === "CastCombo") {
    content = (
      <CastCombo
        onFinished={(result) => handleGameFinished("CastCombo", result)}
        onBack={() => setView("dashboard")}
        themeColors={themeColors}
        user={user}
      />
    );
  } else if (view === "summary") {
    content = (
      <ProgressSummary
        onBack={() => setView("dashboard")}
        results={quizResults}
        themeColors={themeColors}
      />
    );
  }

  return (
    <div className="app" style={{ background: "#fff", color: "#222" }}>
      <AppNav />
      <main style={{ paddingTop: 80, minHeight: "calc(100vh - 60px)" }}>
        <div className="container">{content}</div>
      </main>
    </div>
  );
}

export default App;
