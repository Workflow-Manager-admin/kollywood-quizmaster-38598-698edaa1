import React, { useState, useEffect } from "react";
import { getKollywoodMovies, getMovieDetails } from "../api/tmdb";

// Helper bingo categories
const BINGO_CATEGORIES = [
  { label: "Award Winner", field: "awards" },
  { label: "By Famous Director", field: "director" },
  { label: "Released After 2015", field: "recent" },
  { label: "Family Drama", field: "drama" },
  { label: "Comedy", field: "comedy" },
  { label: "Mass Hero", field: "masshero" },
  { label: "Fantasy", field: "fantasy" },
  { label: "Action", field: "action" },
  { label: "Musical Hit", field: "musical" },
];

// Checks if movie fits a bingo slot
function isMatching(cat, movie, details) {
  switch (cat.field) {
    case "recent":
      return details.release_date && Number(details.release_date.slice(0, 4)) >= 2016;
    case "drama":
      return (
        details.genres &&
        details.genres.some((g) =>
          ["Drama", "Family", "Romance"].includes(g.name)
        )
      );
    case "comedy":
      return details.genres && details.genres.some((g) => g.name === "Comedy");
    case "masshero":
      return details.popularity > 28;
    case "fantasy":
      return (
        details.genres &&
        details.genres.some((g) => g.name === "Fantasy" || g.name === "Adventure")
      );
    case "action":
      return details.genres && details.genres.some((g) => g.name === "Action");
    case "musical":
      return details.genres && details.genres.some((g) => g.name === "Music");
    case "awards":
      return details.vote_average >= 7.7 && details.vote_count > 20;
    case "director":
      return (
        details.credits &&
        Array.isArray(details.credits.crew) &&
        details.credits.crew.some(
          (c) =>
            c.job === "Director" &&
            ["Mani Ratnam", "Shankar", "Vetrimaaran", "Atlee", "Lokesh Kanagaraj"].some(
              (dir) =>
                c.name.toLowerCase().includes(dir.toLowerCase())
            )
        )
      );
    default:
      return false;
  }
}

// PUBLIC_INTERFACE
function MovieBingo({ onFinished, onBack, themeColors }) {
  const [movies, setMovies] = useState([]);
  const [bingoArr, setBingoArr] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [selected, setSelected] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Load 9 movies / details for grid
  useEffect(() => {
    (async () => {
      let resp = await getKollywoodMovies("popular", 1);
      let movieList = (resp?.results || [])
        .filter((m) => m.poster_path)
        .slice(0, 9);
      setMovies(movieList);

      // Fetch details in parallel (with Promise.all)
      let ids = movieList.map((m) => m.id);
      let results = await Promise.all(ids.map((id) => getMovieDetails(id)));
      let map = {};
      for (let i = 0; i < ids.length; ++i) map[ids[i]] = results[i];
      setDetailsMap(map);
      setBingoArr(
        movieList.map((movie, idx) => ({
          ...movie,
          id: movie.id,
          details: results[idx],
          category: BINGO_CATEGORIES[idx % BINGO_CATEGORIES.length],
        }))
      );
      setSelected({});
      setFinished(false);
    })();
    setScore(0);
  }, []);

  if (!bingoArr.length)
    return (
      <div className="hero">
        <div className="subtitle" style={{ color: themeColors.secondary }}>
          Loading movies for bingo...
        </div>
      </div>
    );

  function onCellClick(idx) {
    if (selected[idx]) return;
    const { category, details } = bingoArr[idx];
    const match = isMatching(category, bingoArr[idx], details);
    setSelected((prev) => ({ ...prev, [idx]: match ? "correct" : "wrong" }));
    setScore((s) => s + (match ? 1 : 0));
    if (Object.keys(selected).length + 1 >= 9) {
      setFinished(true);
      setTimeout(() => {
        onFinished({ score: score + (match ? 1 : 0) });
      }, 1100);
    }
  }

  return (
    <div style={{ padding: "28px 0 36px 0" }}>
      <div style={{ fontWeight: 700, fontSize: "1.38rem", color: themeColors.primary, marginBottom: 14 }}>
        Movie Bingo
      </div>
      <div className="subtitle" style={{ color: themeColors.secondary, fontSize: "1.08rem" }}>
        Click the movies that match each category. Score for each correct!
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 142px)",
          gap: 13,
          margin: "32px auto 18px",
          justifyContent: "center",
        }}
      >
        {bingoArr.map((item, idx) => (
          <div
            key={item.id}
            style={{
              border: selected[idx]
                ? selected[idx] === "correct"
                  ? "3px solid #27AE60"
                  : "3px solid #c0392b"
                : "2px solid #E67E22",
              borderRadius: 9,
              background: "#fff3e1",
              padding: 7,
              boxShadow: "0px 4px 16px #f1f1f180",
              cursor: selected[idx] ? "not-allowed" : "pointer",
              textAlign: "center",
              fontSize: "1.09rem",
              position: "relative",
              minHeight: 177,
              opacity: selected[idx] === "wrong" ? 0.6 : 1,
              zIndex: 2,
            }}
            onClick={() => onCellClick(idx)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
              alt="Movie Poster"
              style={{
                borderRadius: 6,
                width: "78px",
                height: "110px",
                objectFit: "cover",
                marginBottom: 6,
                filter: selected[idx] === "wrong" ? "grayscale(1)" : "none",
                boxShadow: "0 2px 6px #eed98b49",
              }}
            />
            <div style={{ fontSize: "0.96rem", color: "#2C3E50", fontWeight: 600 }}>
              {item.title}
            </div>
            <div style={{ fontSize: "0.92rem", color: "#9c6708" }}>
              {item.category.label}
            </div>
            {selected[idx] === "correct" && (
              <span
                style={{
                  position: "absolute",
                  right: 6,
                  bottom: 5,
                  color: "#27AE60",
                  fontWeight: 900,
                  fontSize: 18,
                }}
              >
                ✓
              </span>
            )}
            {selected[idx] === "wrong" && (
              <span
                style={{
                  position: "absolute",
                  right: 6,
                  bottom: 5,
                  color: "#c0392b",
                  fontWeight: 800,
                  fontSize: 19,
                }}
              >
                ×
              </span>
            )}
          </div>
        ))}
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
      {finished && (
        <div style={{ color: "#27AE60", fontWeight: 700, fontSize: "1.13rem", marginTop: 20 }}>
          🎉 Bingo complete! Score: {score} / 9
        </div>
      )}
    </div>
  );
}

export default MovieBingo;
