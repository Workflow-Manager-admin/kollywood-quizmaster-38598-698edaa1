import React from "react";

const GAMES = [
  {
    type: "BlurredPosterQuiz",
    title: "Blurred Poster Quiz",
    desc: "Guess the Kollywood movie from its blurred poster! Use clues or reveal the answer if stumped.",
    icon: "🖼️",
  },
  {
    type: "CharacterMovieMatch",
    title: "Character-Movie Match",
    desc: "Drag and drop character names into correct Kollywood movie titles.",
    icon: "🎭",
  },
  {
    type: "MovieBingo",
    title: "Movie Bingo",
    desc: "Movie bingo: click matching movies on a themed grid like Award Winners!",
    icon: "🔢",
  },
  {
    type: "MovieTimeline",
    title: "Movie Timeline Challenge",
    desc: "Arrange Kollywood movie titles in their correct release-year order.",
    icon: "🗓️",
  },
  {
    type: "SpinTheWheel",
    title: "Spin the Wheel",
    desc: "Spin to get actor, actress, and year — guess the movie!",
    icon: "🎡",
  },
  {
    type: "CastCombo",
    title: "Cast Combo",
    desc: "Guess movies with all shown actors, or which actor wasn't in the given combo.",
    icon: "👥",
  },
];

// PUBLIC_INTERFACE
function Dashboard({ onStartGame, quizResults, themeColors }) {
  return (
    <div className="hero" style={{ paddingTop: 32 }}>
      <div
        className="title"
        style={{ fontWeight: 800, color: themeColors.primary, fontSize: 38 }}
      >
        Kollywood QuizMaster 🎬
      </div>
      <div
        className="subtitle"
        style={{
          color: themeColors.secondary,
          fontWeight: 500,
          marginTop: 4,
          marginBottom: 6,
        }}
      >
        Challenge yourself with Kollywood-themed games!
      </div>
      <div
        className="description"
        style={{
          marginTop: 0,
          marginBottom: 20,
          color: "#555",
        }}
      >
        <ul style={{ paddingLeft: 22, fontSize: "1.1em", color: "#202020", margin: 0 }}>
          <li>10 questions per game, clues & reveal options</li>
          <li>All questions sourced live from TheMovieDB (Kollywood-only)</li>
          <li>Track your progress & see results at the end</li>
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          margin: "0 auto",
          justifyContent: "center",
          marginTop: 28,
          marginBottom: "1.2em",
        }}
      >
        {GAMES.map((game) => (
          <div
            key={game.type}
            style={{
              background: "#fdf7f3",
              border: `2.5px solid ${themeColors.secondary}`,
              borderRadius: 14,
              minWidth: 230,
              maxWidth: 260,
              flex: "1 0 170px",
              padding: "28px 18px 20px 18px",
              boxShadow: "0px 3px 9px rgba(236, 165, 37, 0.14)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "box-shadow 0.12s",
              position: "relative",
            }}
            onClick={() => onStartGame(game.type)}
          >
            <span
              style={{
                fontSize: 38,
                position: "absolute",
                left: 14,
                top: 14,
                userSelect: "none",
                opacity: 0.22,
              }}
              aria-hidden
            >
              {game.icon}
            </span>
            <div
              style={{
                fontWeight: 700,
                color: themeColors.primary,
                fontSize: "1.28rem",
              }}
            >
              {game.title}
            </div>
            <div style={{ fontSize: "1.02rem", color: "#8f5e27", margin: "10px 0 8px 0" }}>
              {game.desc}
            </div>
            <button
              className="btn"
              style={{
                background: themeColors.primary,
                color: "white",
                marginTop: 6,
                boxShadow: "1px 3px 11px #e9cfa183",
                fontWeight: 500,
              }}
            >
              Start
            </button>
            {quizResults[game.type] && (
              <div
                style={{
                  position: "absolute",
                  top: 13,
                  right: 10,
                  fontSize: "0.85rem",
                  background: themeColors.accent,
                  color: "#fff",
                  padding: "2.5px 12px",
                  borderRadius: 13,
                  fontWeight: 500,
                }}
              >
                Complete!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
