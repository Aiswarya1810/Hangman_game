# 🎮 Hangman Game

A modern Hangman game built using React, TypeScript, and Vite with a stylish dark UI, timer system, scoring, keyboard controls, and leaderboard support.

---

## 🚀 Features

- 🎯 Random word generation with categories
- ⏱️ Countdown timer
- 🧠 Clue/category system
- 🎮 Interactive on-screen keyboard
- ⌨️ Physical keyboard support
- 📊 Score system
- 🏆 Leaderboard using localStorage
- 💀 Hangman drawing animation
- 🔄 Play Again functionality
- 🌙 Responsive dark-themed UI
- ⚡ Built with Vite for fast performance

---

## 🛠️ Technologies Used

- React
- TypeScript
- Vite
- CSS Modules
- LocalStorage

---


## 🎮 How the Game Works

1. Enter your name and start the game.
2. A random word and category are selected.
3. Guess letters using:
   - the on-screen keyboard
   - or your physical keyboard.
4. Correct guesses reveal letters.
5. Wrong guesses draw parts of the hangman.
6. The player loses after:
   - 6 incorrect guesses
   - or when the timer reaches 0.
7. Scores are calculated based on:
   - Correct guesses → +10 points
   - Incorrect guesses → -5 points
   - Winning bonus → +20 points
8. Top 5 scores are saved in the leaderboard.

---

## 🏆 Leaderboard

The game stores leaderboard data using browser localStorage.

- Keeps only the top 5 scores
- Stores the best score for each player
- Persists even after page refresh

---

## ▶️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repository-url>
```

---

### 2️⃣ Navigate into the project

```bash
cd hangman-game
```

---

### 3️⃣ Install dependencies

```bash
npm install
```

---

### 4️⃣ Start the development server

```bash
npm run dev
```

---

### 5️⃣ Open in browser

```bash
http://localhost:5173
```

---


## 🔮 Future Improvements

- Difficulty levels
- Multiplayer support
- Sound effects
- Backend database leaderboard
- User authentication
- Mobile optimization
- Animations and transitions
- More categories and words

---

## 👨‍💻 Author

Developed by Aiswarya

---
