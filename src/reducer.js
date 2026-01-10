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
    x: Math.random() * 80, // Ekranda tasodifiy joylashuv (chapdan)
    y: Math.random() * 70, // Ekranda tasodifiy joylashuv (tepadan)
    danger: false, // Bu oddiy shakl → xavfli emas
    expiresAt: Date.now() + 2000, // 2 soniyadan keyin yo‘q bo‘ladi
  };
};

// 🔹 Xavfli shakl (bosilsa minus score beradi)
export const dangerShape = () => ({
  id: Date.now() * Math.random(),
  type: "danger", // Xavfli ekanligini belgilash
  color: "black", // Faqat qora rangda bo‘ladi
  value: -10, // Bosilganda -10 ochko tushirib yuboradi
  x: Math.random() * 80,
  y: Math.random() * 70,
  danger: true, // Xavfli belgilandi
  expiresAt: Date.now() + 6000, // 6 soniyadan keyin yo'qoladi
});

// 🔹 O‘yin tarixini localStorage dan yuklash
const loadHistory = () => JSON.parse(localStorage.getItem("history") || "[]");

// 🔹 Saqlangan theme holatini olish (agar bo'lmasa light)
const savedTheme = localStorage.getItem("themeMode");
const safeTheme = savedTheme === "dark" ? "dark" : "light";

// 🔹 Boshlang'ich dastlabki State
export const initalState = {
  score: 0, // Hozirgi ochko
  bestScore: Number(localStorage.getItem("bestScore")) || 0, // Eng yaxshi natija
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
    case "SET_DIFFICULTY":
      // Qiyinlik darajasini yangilash
      return { ...state, difficulty: action.payload };

    case "START":
      // O‘yinni qayta boshlash yoki boshlash
      return {
        ...state,
        isPlaying: true,
        gameOver: false,
        score: 0,
        dangerClicks: 0,
        lives: 3,
        timeLeft:
          state.difficulty === "easy"
            ? 40 // Oson rejim → ko‘proq vaqt
            : state.difficulty === "hard"
            ? 20 // Qiyin rejim → kam vaqt
            : 30, // Normal → 30s
      };

    case "SPAWN": {
      // 🔹 Yangi shakl yaratish
      // 75% oddiy shakl, 25% xavfli shakl
      const newShape = Math.random() > 0.25 ? randomShape() : dangerShape();

      let updated = [...state.shapes, newShape];

      // 🔹 Juda ko‘p xavfli shakllar bo‘lib ketmasligi uchun cheklash
      const dangerList = updated.filter((s) => s.danger);
      if (dangerList.length > 10) {
        // Agar 10 tadan ko‘p bo‘lsa eski xavfli shakllarni o‘chiradi
        updated = updated.filter(
          (s, i) => !(s.danger && i < dangerList.length - 10)
        );
      }

      return {
        ...state,
        shapes: updated, // Yangilangan shakllar
        speed: state.speed > 600 ? state.speed - 30 : state.speed,
        // Har safar tezlashib boradi (minimum 600ms)
      };
    }
  }
}
