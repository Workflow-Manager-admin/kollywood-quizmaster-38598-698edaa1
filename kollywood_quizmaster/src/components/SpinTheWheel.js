import React, { useState, useEffect } from "react";
import { getKollywoodMovies, getMovieDetails } from "../api/tmdb";

// Helper arrays
const ACTORS = [
  "Kamal Haasan",
  "Rajinikanth",
  "Vijay",
  "Ajith Kumar",
  "Suriya",
  "Vikram",
  "Dhanush",
  "Karthi",
  "Samantha Ruth Prabhu",
  "Nayanthara",
  "Jyothika",
  "Keerthy Suresh",
  "Trisha",
  "Sivakarthikeyan",
  "Ramya Krishnan",
];

// PUBLIC_INTERFACE
function SpinTheWheel({ onFinished, onBack, themeColors }) {
  const [spinVal, setSpinVal] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  useEffect(() => {
    generateSpin();
    setScore(0);
    setAnswered(0);
  }, []);

  async function generateSpin() {
    // Pick random actor, actress, and year
    let maleList = ACTORS.filter((a) =>
      ["Kamal Haasan", "Rajinikanth", "Vijay", "Ajith Kumar", "Suriya", "Vikram", "Dhanush", "Karthi", "Sivakarthikeyan"].includes(a)
    );
    let femaleList = ACTORS.filter((a) =>
      !maleList.includes(a)
    );
    let actor = maleList[Math.floor(Math.random() * maleList.length)];
    let actress = femaleList[Math.floor(Math.random() * femaleList.length)];
    let year = 2015 + Math.floor(Math.random() * 8); // 2015-2022
    setSpinVal({ actor, actress, year });
    // Find a movie with those criteria
    let resp = await getKollywoodMovies("popular", 1);
    let all = resp?.results || [];
    let moviesWithChoices = [];
    for (let m of all) {
      let det = await getMovieDetails(m.id);
      if (
        det.release_date &&
        det.release_date.startsWith(year.toString()) &&
        det.credits &&
        Array.isArray(det.credits.cast) &&
        det.credits.cast.some((c) =>
          [actor, actress].includes(c.name)
        )
      ) {
        moviesWithChoices.push({ ...det, title: m.title });
      }
      if (moviesWithChoices.length >= 1) break;
    }
    let selected = moviesWithChoices[0] || null;
    setQuestion(selected ? { ...spinVal, answer: selected.title } : null);
  }

  function handleGuess() {
    if (!answer.trim()) return;
    if (
      answer.trim().toLowerCase().replace(/[\W]/g, "") ===
      question.answer.trim().toLowerCase().replace(/[\W]/g, "")
    ) {
      setScore((s) => s + 1);
    }
    setAnswered((a) => a + 1);
    if (answered + 1 >= 3) {
      setTimeout(() => onFinished({ score: score + 1 }), 1200);
    } else {
      setTimeout(() => {
        setAnswer("");
        generateSpin();
      }, 800);
    }
  }

  if (!spinVal || !question)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Preparing spin... 🎡
        </div>
      </div>
    );

  return (
    <div style={{ padding: "28px 0 36px 0" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.27rem",
          color: themeColors.primary,
          marginBottom: 14,
        }}
      >
        Spin the Wheel
      </div>
      <div
        style={{
          fontSize: "1.04rem",
          color: themeColors.secondary,
          marginBottom: 8,
          fontWeight: 500,
        }}
      >
        Spin for Actor, Actress & Year - guess the movie
      </div>
      <div
        style={{
          margin: "30px auto 20px",
          padding: 15,
          background: "#fcf2e7",
          borderRadius: 14,
          boxShadow: "0 2px 10px #f4dbb185",
          width: 380,
          maxWidth: "98vw",
        }}
      >
        <div style={{ color: themeColors.primary, fontWeight: 650, marginBottom: 8 }}>
          Clues:
        </div>
        <div style={{ fontSize: "1.10rem" }}>
          <span style={{ color: "#e67e22" }}>Actor:</span> {spinVal.actor}
          <br />
          <span style={{ color: "#27AE60" }}>Actress:</span> {spinVal.actress}
          <br />
          <span style={{ color: "#9c6708" }}>Year:</span> {spinVal.year}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <input
          style={{
            border: `2px solid ${themeColors.secondary}`,
            borderRadius: 9,
            padding: "10px 15px",
            fontSize: "1.1rem",
            marginBottom: 9,
            width: 240,
          }}
          placeholder="Enter the movie's title…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={answered >= 3}
        />
        <div>
          <button
            className="btn"
            style={{
              background: themeColors.primary,
              color: "#fff",
              fontWeight: 500,
            }}
            onClick={handleGuess}
            disabled={answered >= 3}
          >
            Submit
          </button>
        </div>
        <div style={{ marginTop: 15, color: "#888" }}>
          {answered + 1} / 3 rounds
        </div>
      </div>
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button
          className="btn"
          style={{ background: themeColors.secondary, color: "#fff" }}
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SpinTheWheel;
