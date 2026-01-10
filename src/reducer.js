export const randomShape = () => {
  const colors = ["red", "blue", "green", "orange", "purple", "pink"];
  const shapes = ["circle", "square"];
  const value = Math.floor(Math.random() * 9) + 7;

  return {
    id: Date.now() * Math.random(),
    type: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    value,
    x: Math.random() * 80,
    y: Math.random() * 70,
    danger: false,
    expiresAt: Date.now() + 2000,
  };
};

export const dangerShape = () => ({
  id: Date.now() * Math.random(),
  type: "danger",
  color: "black",
  value: -10,
  x: Math.random() * 80,
  y: Math.random() * 70,
  danger: true,
  expiresAt: Date.now() + 6000,
});

const loadHistory = () => JSON.parse(localStorage.getItem("history") || "[]");

const savedTheme = localStorage.getItem("themeMode");
const safeTheme = savedTheme === "dark" ? "dark" : "light";

export const initalState = {
  score: 0,
  bestScore: Number(localStorage.getItem("bestScore")) || 0,
  shapes: [],
  speed: 1000,
  gameOver: false,
  dangerClicks: 0,
  isPlaying: false,
  lives: 3,
  timeLeft: 30,
  history: loadHistory(),
  difficulty: "normal",
  themeMode: safeTheme,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };

    case "START":
      return {
        ...state,
        isPlaying: true,
        gameOver: false,
        score: 0,
        dangerClicks: 0,
        lives: 3,
        timeLeft:
          state.difficulty === "easy"
            ? 40
            : state.difficulty === "hard"
            ? 20
            : 30,
      };

    case "SPAWN": {
      const newShape = Math.random() > 0.25 ? randomShape() : dangerShape();
      let updated = [...state.shapes, newShape];

      const dangerList = updated.filter((s) => s.danger);
      if (dangerList.length > 10) {
        updated = updated.filter(
          (s, i) => !(s.danger && i < dangerList.length - 10)
        );
      }

      return {
        ...state,
        shapes: updated,
        speed: state.speed > 600 ? state.speed - 30 : state.speed,
      };
    }
  }
}
