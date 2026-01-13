// 🔹 Tasodifiy oddiy shakl yaratadigan funksiya
export const randomShape = () => {
  const colors = ["red", "blue", "green", "orange", "purple", "pink"]; // Ruxsat berilgan ranglar
  const shapes = ["circle", "square"]; // Ruxsat berilgan shakllar
  const value = Math.floor(Math.random() * 9) + 7; // 7 dan 15 gacha random score qiymat

  return {
    id: Date.now() * Math.random(), // Har bir shakl uchun noyob ID
    type: shapes[Math.floor(Math.random() * shapes.length)], // Tasodifiy shakl tanlash
    color: colors[Math.floor(Math.random() * colors.length)], // Tasodifiy rang tanlash
    value,
    x: Math.random() * 80, // Ekranda tasodifiy joylashuv (chapdan % bo‘yicha)
    y: Math.random() * 70, // Ekranda tasodifiy joylashuv (tepadan % bo‘yicha)
    danger: false, // Bu oddiy shakl → xavfli emas
    expiresAt: Date.now() + 2000, // 2 soniyadan keyin yo‘q bo‘ladi
  };
};

// 🔹 Xavfli shakl (bosilsa minus score beradi)
export const dangerShape = () => ({
  id: Date.now() * Math.random(), // Noyob ID
  type: "danger", // Xavfli ekanligini belgilash
  color: "black", // Har doim qora rang
  value: -10, // Bosilganda -10 ochko tushiradi
  x: Math.random() * 80,
  y: Math.random() * 70,
  danger: true, // Xavfli belgilandi
  expiresAt: Date.now() + 6000, // 6 soniyadan keyin yo'qoladi
});

// 🔹 O‘yin tarixini localStorage dan yuklash
const loadHistory = () => JSON.parse(localStorage.getItem("history") || "[]");

// 🔹 Saqlangan theme holatini olish (agar bo'lmasa light)
const savedTheme = localStorage.getItem("themeMode"); // LocalStorage dan theme olish
const safeTheme = savedTheme === "dark" ? "dark" : "light"; // Faqat light yoki dark ruxsat

// 🔹 Boshlang'ich dastlabki State
export const initialState = {
  score: 0, // Hozirgi ochko
  bestScore: Number(localStorage.getItem("bestScore")) || 0, // Eng yaxshi natija (saqlanadi)
  shapes: [], // Ekrandagi shakllar ro‘yxati
  speed: 1000, // Shakllar chiqish tezligi (ms)
  gameOver: false, // O‘yin tugaganmi?
  dangerClicks: 0, // Nechta xavfli shakl bosilgan
  isPlaying: false, // O‘yin boshlanganmi?
  lives: 3, // Jonlar soni
  timeLeft: 30, // Qolgan vaqt
  history: loadHistory(), // Tarixni yuklash
  difficulty: "normal", // Qiyinlik darajasi
  themeMode: safeTheme, // Mavzu rejimi
};

// 🔹 useReducer uchun reducer funksiyasi
export function reducer(state, action) {
  switch (action.type) {
    // 🔹 Qiyinlik darajasi o‘zgartirilganda
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };

    // 🔹 O‘yin boshlanishi
    case "START":
      return {
        ...state,
        isPlaying: true, // O‘yin boshlandi
        gameOver: false,
        score: 0,
        dangerClicks: 0,
        lives: 3, // Jonlar reset
        // Qiyinlik darajasiga qarab vaqt beriladi
        timeLeft:
          state.difficulty === "easy"
            ? 40
            : state.difficulty === "hard"
            ? 20
            : 30,
      };

    // 🔹 Yangi shakl paydo bo‘lishi
    case "SPAWN": {
      // 75% oddiy shakl, 25% xavfli shakl yaratiladi
      const newShape = Math.random() > 0.25 ? randomShape() : dangerShape();

      let updated = [...state.shapes, newShape]; // Yangisini qo‘shib qo‘yamiz

      // 🔹 Juda ko‘p xavfli shakllar yig‘ilib ketmasligi uchun
      const dangerList = updated.filter((s) => s.danger);

      if (dangerList.length > 10) {
        // 10 tadan oshsa eski xavfli shapelar o‘chiriladi
        updated = updated.filter(
          (s, i) => !(s.danger && i < dangerList.length - 10)
        );
      }

      return {
        ...state,
        shapes: updated,
        // Har safar o‘yin tezlashadi (minimal 600 ms)
        speed: state.speed > 600 ? state.speed - 30 : state.speed,
      };
    }

    // 🔹 Vaqti tugagan shapelarni tozalash
    case "CLEAR_EXPIRED":
      return {
        ...state,
        shapes: state.shapes.filter((s) => s.expiresAt > Date.now()),
      };

    // 🔹 Shakl bosilganda
    case "CLICK_SHAPE":
      // Agar xavfli bosilsa
      if (action.payload.danger) {
        const lives = state.lives - 1; // Jon kamayadi

        // 🔹 Jon tugasa o‘yin tugaydi
        if (lives <= 0) {
          const history = [...state.history, state.score].sort((a, b) => b - a);
          localStorage.setItem("history", JSON.stringify(history));

          return {
            ...state,
            lives: 0,
            gameOver: true,
            isPlaying: false,
            bestScore:
              state.score > state.bestScore ? state.score : state.bestScore, // Best score yangilanadi
            history,
          };
        }

        return { ...state, lives };
      }

      // Agar xavfli bo‘lmasa → ochko qo‘shiladi
      const newScore = state.score + action.payload.value;

      return {
        ...state,
        score: newScore,
        // Best score yangilash
        bestScore: newScore > state.bestScore ? newScore : state.bestScore,
        // Bosilgan shaklni ekrandan o‘chirish
        shapes: state.shapes.filter((s) => s.id !== action.payload.id),
      };

    // 🔹 Har soniyada ishlaydigan taymer
    case "TICK":
      // Vaqt tugasa o‘yin tugaydi
      if (state.timeLeft <= 1) {
        const history = [...state.history, state.score].sort((a, b) => b - a);
        localStorage.setItem("history", JSON.stringify(history));

        return {
          ...state,
          isPlaying: false,
          gameOver: true,
          history,
        };
      }

      // Vaqtni 1 soniyaga kamaytirish
      return { ...state, timeLeft: state.timeLeft - 1 };

    // 🔹 O‘yinni reset qilish
    case "RESET":
      localStorage.setItem("bestScore", state.bestScore); // Best score saqlab qo‘yiladi
      return {
        ...initialState, // Bosh holatga qaytarish
        bestScore: state.bestScore, // Best score yo‘qolmasin
        history: state.history, // Tarix ham saqlansin
        themeMode: state.themeMode, // Theme ham o‘zgarmasin
      };

    // 🔹 Mavzuni almashtirish (light ↔ dark)
    case "TOGGLE_THEME":
      const newMode = state.themeMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode); // Saqlab qo‘yiladi
      return { ...state, themeMode: newMode };

    default:
      return state; // Default holatda state qaytariladi
  }
}
