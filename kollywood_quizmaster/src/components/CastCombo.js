import React, { useState, useEffect } from "react";
import { getKollywoodMovies, getMovieDetails } from "../api/tmdb";

// PUBLIC_INTERFACE
function CastCombo({ onFinished, onBack, themeColors }) {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showAns, setShowAns] = useState(false);

  useEffect(() => {
    (async () => {
      let resp = await getKollywoodMovies("popular", 1);
      let movies = (resp?.results || []).slice(0, 8);
      let detailsArr = await Promise.all(
        movies.map((m) => getMovieDetails(m.id))
      );
      let qns = [];
      for (let i = 0; i < detailsArr.length && qns.length < 4; ++i) {
        let det = detailsArr[i];
        if (!det.credits || !Array.isArray(det.credits.cast)) continue;
        // pick 3 actors who are all in this movie
        let chosen = (det.credits.cast || [])
          .filter((c) => c.known_for_department === "Acting")
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        if (chosen.length < 3) continue;
        qns.push({
          actors: chosen.map((c) => c.name),
          answer: det.title,
          type: "combo",
        });
      }
      // Add “which actor NOT in movie”
      let combo = qns[0];
      if (combo) {
        // Pick an actor not in movie
        let resp2 = await getKollywoodMovies("popular", 2);
        let movies2 = (resp2?.results || []).slice(0, 12);
        let nonMovieActors = [];
        for (let m of movies2) {
          let det = await getMovieDetails(m.id);
          let first = (det.credits?.cast || [])[0]?.name;
          if (
            first &&
            !combo.actors.includes(first) &&
            combo.answer !== det.title
          )
            nonMovieActors.push(first);
          if (nonMovieActors.length >= 1) break;
        }
        if (nonMovieActors.length > 0) {
          qns.push({
            actors: [...combo.actors, nonMovieActors[0]],
            answer: nonMovieActors[0],
            movie: combo.answer,
            type: "oddone",
          });
        }
      }
      setQuestions(qns);
    })();
    setScore(0);
    setQIdx(0);
  }, []);

  function handleSubmit() {
    let cur = questions[qIdx];
    let closeMatch = (ans, inp) =>
      ans.toLowerCase().replace(/[\W]/g, "") === inp.toLowerCase().replace(/[\W]/g, "");
    if (
      (cur.type === "combo" && closeMatch(cur.answer, input.trim())) ||
      (cur.type === "oddone" && closeMatch(cur.answer, input.trim()))
    ) {
      setScore((s) => s + 1);
    }
    if (qIdx + 1 >= questions.length) {
      setTimeout(() => {
        onFinished({ score: score + 1 });
      }, 1200);
    } else {
      setTimeout(() => {
        setQIdx((i) => i + 1);
        setInput("");
        setShowAns(false);
      }, 800);
    }
  }

  if (!questions.length)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Loading combo...
        </div>
      </div>
    );

  const q = questions[qIdx];

  return (
    <div style={{ padding: "28px 0 36px 0" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.29rem",
          color: themeColors.primary,
          marginBottom: 14,
        }}
      >
        Cast Combo
      </div>
      <div
        className="subtitle"
        style={{
          color: themeColors.secondary,
          fontSize: "1.05rem",
          marginBottom: 16,
        }}
      >
        {q.type === "combo"
          ? "Guess the movie starring all these actors:"
          : `Which actor was NOT in "${q.movie}"?`}
      </div>
      <div
        style={{
          margin: "20px auto 18px",
          background: "#f3f7f3",
          padding: 12,
          borderRadius: 7,
          width: 340,
          maxWidth: "98vw",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {q.actors.map((a, idx) => (
          <span
            key={a}
            style={{
              color: ["#e67e22", "#2c3e50", "#27ae60", "#b63d1a"][idx % 4],
              fontWeight: 700,
              marginRight: 10,
              fontSize: 15,
            }}
          >
            {a}
          </span>
        ))}
      </div>
      <div>
        <input
          style={{
            border: `2px solid ${themeColors.secondary}`,
            borderRadius: 9,
            padding: "10px 15px",
            fontSize: "1.10rem",
            marginBottom: 9,
            width: 240,
          }}
          placeholder={
            q.type === "combo"
              ? "Movie title…"
              : "Type actor's name NOT present…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={showAns}
        />
        <button
          className="btn"
          style={{
            background: themeColors.primary,
            color: "#fff",
            fontWeight: 500,
            marginLeft: 8,
          }}
          onClick={handleSubmit}
          disabled={showAns}
        >
          Submit
        </button>
        <button
          className="btn"
          style={{
            marginLeft: 8,
            background: themeColors.accent,
            color: "#fff",
            fontWeight: 500,
          }}
          onClick={() => setShowAns(true)}
        >
          Reveal
        </button>
        {showAns && (
          <div style={{ marginTop: 8, fontWeight: 700, color: "#2980b9" }}>
            Answer: {q.answer}
          </div>
        )}
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

export default CastCombo;
