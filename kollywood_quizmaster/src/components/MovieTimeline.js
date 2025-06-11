import React, { useState, useEffect } from "react";
import { getKollywoodMovies, getMovieDetails } from "../api/tmdb";

// PUBLIC_INTERFACE
function MovieTimeline({ onFinished, onBack, themeColors }) {
  const [movies, setMovies] = useState([]);
  const [order, setOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    (async () => {
      // Get 6 movies, shuffle for answer list and chronological list
      let resp = await getKollywoodMovies("popular", 1);
      let pool = (resp?.results || []).filter((m) => m.id).slice(0, 6);
      let detailsAll = await Promise.all(pool.map((m) => getMovieDetails(m.id)));
      let movieObjs = pool.map((m, i) => ({
        ...m,
        release_date: detailsAll[i]?.release_date,
        release_year: detailsAll[i]?.release_date?.slice(0, 4),
      }));
      // Shuffle initial order randomly for answering
      let shuffled = [...movieObjs].sort(() => Math.random() - 0.5);
      setMovies(movieObjs);
      setOrder(shuffled);
    })();
    setAnswered(false);
    setScore(0);
  }, []);

  function swap(idx1, idx2) {
    if (answered) return;
    let o = [...order];
    let t = o[idx1];
    o[idx1] = o[idx2];
    o[idx2] = t;
    setOrder(o);
  }

  function handleCheck() {
    if (answered) return;
    let moviesChrono = [...movies].sort(
      (a, b) => new Date(a.release_date) - new Date(b.release_date)
    );
    let correct =
      JSON.stringify(order.map((m) => m.id)) ===
      JSON.stringify(moviesChrono.map((m) => m.id));
    setScore(correct ? 1 : 0);
    setAnswered(true);
    setTimeout(() => onFinished({ score: correct ? 1 : 0 }), 1300);
  }

  if (!order.length)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Loading Kollywood movies...
        </div>
      </div>
    );

  return (
    <div style={{ padding: "28px 0 36px 0" }}>
      <div
        style={{
          fontSize: "1.29rem",
          fontWeight: 700,
          color: themeColors.primary,
          marginBottom: 10,
        }}
      >
        Movie Timeline Challenge
      </div>
      <div className="subtitle" style={{ color: themeColors.secondary, fontSize: "1.05rem" }}>
        Arrange the movies in order of their release year (oldest first)
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          margin: "34px auto 18px",
          maxWidth: 400,
        }}
      >
        {order.map((m, idx) => (
          <div
            key={m.id}
            style={{
              background: "#f6f3ff",
              border: `2px solid ${themeColors.secondary}`,
              borderRadius: 9,
              padding: "11px 19px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative",
              fontWeight: 500,
              color: "#393447",
              fontSize: "1.01rem",
            }}
          >
            <span style={{ fontWeight: 700, color: themeColors.primary }}>
              {idx + 1}
            </span>
            <img
              src={`https://image.tmdb.org/t/p/w45${m.poster_path}`}
              alt=""
              style={{
                width: 40,
                height: 56,
                objectFit: "cover",
                borderRadius: 6,
                boxShadow: "0px 2.5px 7px #e9cfa173",
              }}
            />
            <span style={{ flex: 1 }}>{m.title}</span>
            {!answered && idx > 0 && (
              <button
                className="btn"
                style={{
                  background: themeColors.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "5px 13px",
                  borderRadius: 5,
                  marginLeft: 8,
                }}
                onClick={() => swap(idx, idx - 1)}
              >
                ↑
              </button>
            )}
            {!answered && idx < order.length - 1 && (
              <button
                className="btn"
                style={{
                  background: themeColors.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "5px 13px",
                  borderRadius: 5,
                  marginLeft: 0,
                }}
                onClick={() => swap(idx, idx + 1)}
              >
                ↓
              </button>
            )}
            {answered && (
              <span
                style={{
                  marginLeft: 16,
                  color:
                    m.release_year ===
                    [...movies].sort(
                      (a, b) => new Date(a.release_date) - new Date(b.release_date)
                    )[idx].release_year
                      ? "#27AE60"
                      : "#c0392b",
                  fontWeight: "bold",
                }}
              >
                {m.release_year}
              </span>
            )}
          </div>
        ))}
      </div>
      {!answered && (
        <button
          className="btn"
          style={{ background: themeColors.primary, color: "#fff", marginRight: 10 }}
          onClick={handleCheck}
        >
          Submit
        </button>
      )}
      <button
        className="btn"
        style={{ background: themeColors.secondary, color: "#fff", marginLeft: 10 }}
        onClick={onBack}
      >
        Back to Dashboard
      </button>
      {answered && (
        <div style={{ marginTop: 16, fontWeight: 700, color: "#27AE60", fontSize: "1.11rem" }}>
          {score === 1
            ? "🎉 Perfect! All in correct order."
            : "Not quite right. Better luck next time!"}
        </div>
      )}
    </div>
  );
}

export default MovieTimeline;
