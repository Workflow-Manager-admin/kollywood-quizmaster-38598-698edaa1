import React, { useState, useEffect } from "react";
import { getKollywoodMovies, getMovieDetails } from "../api/tmdb";

// PUBLIC_INTERFACE
/**
 * BlurredPosterQuiz: Shows a blurred poster, lets user guess the Kollywood movie.
 */
function BlurredPosterQuiz({ onFinished, onBack, themeColors, user }) {
  const [movies, setMovies] = useState([]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [clues, setClues] = useState({});
  const [answerInput, setAnswerInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showClue, setShowClue] = useState(0);

  // Load 10 random Kollywood movies
  useEffect(() => {
    (async () => {
      setLoading(true);
      const resp = await getKollywoodMovies("popular", 1 + Math.floor(Math.random() * 2));
      let sample = [];
      // Shuffle and pick 10 with poster
      if (resp && resp.results && resp.results.length > 15) {
        let pool = resp.results.filter((m) => m.poster_path);
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        sample = pool.slice(0, 10);
      }
      setMovies(sample);
      setLoading(false);
    })();
    // Reset question state when game starts
    setQuestionIdx(0);
    setAnswerInput("");
    setRevealed(false);
    setScore(0);
    setCorrect(null);
    setShowClue(0);
    setClues({});
  }, []);

  // Get clues for current movie
  useEffect(() => {
    if (!movies[questionIdx]) return;
    (async () => {
      const details = await getMovieDetails(movies[questionIdx].id);
      setClues({
        overview: details.overview,
        year: details.release_date?.slice(0, 4),
        genre: details.genres?.[0]?.name,
      });
    })();
    setAnswerInput("");
    setCorrect(null);
    setShowClue(0);
    setRevealed(false);
  }, [questionIdx, movies]);

  if (loading)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Loading movies... 🎬
        </div>
      </div>
    );
  if (!movies.length)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Sorry, couldn’t load enough Kollywood movies. Try later!
        </div>
        <button className="btn" onClick={onBack}>
          Back
        </button>
      </div>
    );

  const curr = movies[questionIdx];

  function checkAnswer() {
    if (!answerInput) return;
    const matches = curr.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "")
      .startsWith(answerInput.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""));
    if (matches) {
      setScore((s) => s + 1);
      setCorrect(true);
    } else {
      setCorrect(false);
    }
    setTimeout(() => {
      setCorrect(null);
      setShowClue(0);
      setRevealed(false);
      if (questionIdx < 9) setQuestionIdx((idx) => idx + 1);
      else
        onFinished({
          score: score + (matches ? 1 : 0),
        });
    }, 1100);
  }

  function revealNow() {
    setRevealed(true);
    setTimeout(() => {
      setCorrect(null);
      setShowClue(0);
      setRevealed(false);
      if (questionIdx < 9) setQuestionIdx((idx) => idx + 1);
      else onFinished({ score });
    }, 1500);
  }

  const progressPct = Number(((questionIdx + 1) / 10) * 100).toFixed(0);

  return (
    <div style={{ padding: "28px 0 36px 0" }}>
      <div style={{ fontWeight: 700, fontSize: "1.44rem", color: themeColors.primary, marginBottom: 14 }}>
        Blurred Poster Quiz
      </div>
      <ProgressBar percent={progressPct} color={themeColors.secondary} />
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <span
          style={{
            background: themeColors.accent,
            color: "#fff",
            padding: "3.5px 16px",
            borderRadius: 7,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Question {questionIdx + 1} / 10
        </span>
      </div>
      <div style={{ display: "flex", minHeight: 240, alignItems: "center", gap: 38, justifyContent: "center", margin:"0 auto" }}>
        <img
          src={`https://image.tmdb.org/t/p/w342${curr.poster_path}`}
          style={{
            filter: !revealed && !correct ? "blur(12px) brightness(0.96)" : "none",
            borderRadius: 16,
            width: 160,
            height: 230,
            boxShadow: "0 2px 20px #ffe3d7a4",
            objectFit: "cover",
          }}
          alt="Movie Poster"
        />
        <div style={{ minWidth: 280, maxWidth: "44vw", display: "flex", flexDirection: "column", gap: 13 }}>
          <input
            style={{
              border: `2.5px solid ${themeColors.accent}`,
              borderRadius: 7,
              fontSize: "1.09rem",
              padding: "8px 15px",
              marginBottom: 8,
              background: "#fbf7f3",
              color:  "#232c3e",
            }}
            placeholder="Enter movie title..."
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && checkAnswer()}
            disabled={revealed || correct !== null}
            autoFocus
          />
          <div style={{ display: "flex", gap: 11 }}>
            <button
              className="btn"
              style={{ fontWeight: 500, background: themeColors.primary, color: "#fff" }}
              onClick={checkAnswer}
              disabled={revealed || correct !== null}
            >
              Submit
            </button>
            <button
              className="btn"
              style={{
                fontWeight: 500,
                background: themeColors.secondary,
                color: "#fff",
              }}
              onClick={() => setShowClue((x) => Math.min(x + 1, 2))}
              disabled={showClue >= 2 || revealed}
            >
              Clue
            </button>
            <button
              className="btn"
              style={{
                fontWeight: 500,
                background: "#f2c94c",
                color: "#333",
                marginLeft: 2,
              }}
              onClick={revealNow}
              disabled={revealed}
            >
              Reveal
            </button>
          </div>
          <div style={{ marginTop: 2 }}>
            {showClue >= 1 && (
              <div style={{ fontSize: "0.96em", fontWeight: 500 }}>
                <span style={{ color: themeColors.primary }}>Overview:</span>{" "}
                {clues.overview || ""}
              </div>
            )}
            {showClue >= 2 && (
              <div style={{ fontSize:"0.96em", fontWeight: 500}}>
                <span style={{ color: themeColors.secondary }}>Year/Genre:</span>{" "}
                {clues.year} &#8226; {clues.genre}
              </div>
            )}
          </div>
          {correct === true && (
            <div
              style={{
                marginTop: 6,
                color: themeColors.accent,
                fontWeight: 700,
                fontSize: "1.10rem",
              }}
            >
              🎉 Correct!
            </div>
          )}
          {correct === false && (
            <div
              style={{
                marginTop: 6,
                color: "#c0392b",
                fontWeight: 700,
                fontSize: "1.10rem",
              }}
            >
              ❌ Incorrect!
            </div>
          )}
          {revealed && (
            <div
              style={{
                marginTop: 6,
                color: "#2980b9",
                fontWeight: 700,
                fontSize: "1.10rem",
              }}
            >
              🎬 {curr.title}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button
          className="btn"
          style={{ background: themeColors.primary, color: "#fff" }}
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default BlurredPosterQuiz;

function ProgressBar({ percent, color }) {
  return (
    <div
      style={{
        width: "97%",
        background: "#e6e6e6",
        borderRadius: 12,
        height: 10,
        margin: "0 auto 12px auto",
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          background: color,
          height: "100%",
          borderRadius: 12,
          transition: "width 0.2s",
        }}
      />
    </div>
  );
}
