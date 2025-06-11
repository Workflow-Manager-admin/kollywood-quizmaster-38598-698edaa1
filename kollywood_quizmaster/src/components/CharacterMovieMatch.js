import React, { useState, useEffect } from "react";
import { getKollywoodMovies, getMovieDetails } from "../api/tmdb";

// PUBLIC_INTERFACE
function CharacterMovieMatch({ onFinished, onBack, themeColors }) {
  const [pairs, setPairs] = useState([]);
  const [dragSrc, setDragSrc] = useState(null);
  const [matched, setMatched] = useState({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load 10 random movie/character pairs
    (async () => {
      let movResp = await getKollywoodMovies("popular", 1);
      let movies = movResp?.results?.filter((m) => m.id) || [];
      const questions = [];
      for (let i = 0; i < movies.length && questions.length < 10; i++) {
        let det = await getMovieDetails(movies[i].id);
        if (
          det &&
          det.credits &&
          Array.isArray(det.credits.cast) &&
          det.credits.cast.length > 0
        ) {
          // Use lead character
          questions.push({
            movieId: det.id,
            movieTitle: det.title,
            character: det.credits.cast[0].character,
            actor: det.credits.cast[0].name,
          });
        } else if (det && det.title && det.overview) {
          questions.push({
            movieId: det.id,
            movieTitle: det.title,
            character: det.overview.split(" ")[0] || "Unknown",
            actor: "Unknown",
          });
        }
      }
      // Shuffle
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      setPairs(questions.slice(0, 10));
      setMatched({});
    })();
    setQuestionIdx(0);
    setScore(0);
  }, []);

  if (!pairs.length)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Loading movie-characters...
        </div>
      </div>
    );

  // Generate shuffled choices for drag-targets
  const moviesShuffled =
    pairs.map((p) => p.movieTitle).sort(() => Math.random() - 0.5);

  function onDragStart(idx) {
    setDragSrc(idx);
  }

  function onDrop(targetMovie) {
    if (dragSrc != null) {
      let srcChar = pairs[dragSrc].character;
      if (pairs[dragSrc].movieTitle === targetMovie) {
        setMatched((m) => ({ ...m, [srcChar]: targetMovie }));
        setScore((s) => s + 1);
      }
      setDragSrc(null);
      // Next character
      if (Object.keys(matched).length + 1 >= pairs.length) {
        onFinished({ score: score + 1 });
      }
    }
  }

  return (
    <div style={{ padding: "28px 0 36px 0" }}>
      <div
        style={{
          fontSize: "1.33rem",
          fontWeight: 700,
          color: themeColors.primary,
          marginBottom: 14,
        }}
      >
        Character-Movie Match
      </div>
      <div className="subtitle" style={{ color: themeColors.secondary, fontSize: "1.07rem" }}>
        Drag character names onto the correct Kollywood movie titles
      </div>
      <div
        style={{
          marginTop: 21,
          display: "flex",
          flexDirection: "row",
          gap: 32,
          justifyContent: "center",
        }}
      >
        <div>
          <div style={{ marginBottom: 10, fontWeight: 500 }}>Characters</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pairs.map((p, idx) => (
              <div
                key={p.character + idx}
                draggable
                style={{
                  border: "2px solid #E67E22",
                  borderRadius: 7,
                  padding: "10px",
                  background: "#fffbee",
                  opacity: matched[p.character] ? 0.45 : 1,
                  cursor: matched[p.character] ? "not-allowed" : "grab",
                  fontWeight: 500,
                }}
                onDragStart={() => !matched[p.character] && onDragStart(idx)}
              >
                {p.character}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 10, fontWeight: 500 }}>Movies</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {moviesShuffled.map((m, i) => (
              <div
                key={m + i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => !Object.values(matched).includes(m) && onDrop(m)}
                style={{
                  border: "2px dashed #2C3E50",
                  borderRadius: 7,
                  padding: "9px 7px",
                  background: Object.values(matched).includes(m)
                    ? "#dcfbea"
                    : "#f4f6fa",
                  color: Object.values(matched).includes(m)
                    ? "#27AE60"
                    : "#222",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 30, textAlign:"center" }}>
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

export default CharacterMovieMatch;
