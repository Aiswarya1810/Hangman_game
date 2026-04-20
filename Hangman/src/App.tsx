import { useCallback, useEffect, useRef, useState } from "react"
import words from "./wordList.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import "../App.css"

function getWord() {
  const categories = Object.keys(words) as Array<keyof typeof words>
  const category = categories[Math.floor(Math.random() * categories.length)]
  const wordList = words[category]
  const word = wordList[Math.floor(Math.random() * wordList.length)]

  return { word, category }
}

type LeaderboardEntry = {
  name: string
  score: number
}

function App() {
  const [{ word, category }, setGameWord] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [playerName, setPlayerName] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const previousCorrectCount = useRef(0)
  const previousIncorrectCount = useRef(0)
  const winBonusAdded = useRef(false)
  const scoreSaved = useRef(false)

  const incorrectLetters = guessedLetters.filter(letter => !word.includes(letter))
  const correctLetters = guessedLetters.filter(letter => word.includes(letter))
  const [nameError, setNameError] = useState("")
  const isTimeUp = timeLeft <= 0
  const isLoser = incorrectLetters.length >= 6 || isTimeUp
  const isWinner = word.split("").every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return
    setGuessedLetters(current => [...current, letter])
  }, [guessedLetters, isWinner, isLoser])

  const resetGameValues = () => {
    setGameWord(getWord())
    setGuessedLetters([])
    setTimeLeft(60)
    previousCorrectCount.current = 0
    previousIncorrectCount.current = 0
    winBonusAdded.current = false
    scoreSaved.current = false
  }
const startGame = () => {
  const trimmedName = playerName.trim()

  if (!trimmedName) {
    setNameError("Please enter your name")
    return
  }

  const nameExists = leaderboard.some(
    entry => entry.name.toLowerCase() === trimmedName.toLowerCase()
  )

  if (nameExists) {
    setNameError("This name is already taken. Please use a different name.")
    return
  }

  setNameError("")
  setIsStarted(true)
  setScore(0)
  resetGameValues()
}

const saveScoreToLeaderboard = useCallback(() => {
  if (!playerName.trim() || scoreSaved.current) return

  const existingScores: LeaderboardEntry[] = JSON.parse(
    localStorage.getItem("hangmanLeaderboard") || "[]"
  )

  const existingPlayerIndex = existingScores.findIndex(
    entry => entry.name.toLowerCase() === playerName.trim().toLowerCase()
  )

  let updatedScores: LeaderboardEntry[]

  if (existingPlayerIndex !== -1) {
    updatedScores = [...existingScores]

    // keep only the best score for that player
    if (score > updatedScores[existingPlayerIndex].score) {
      updatedScores[existingPlayerIndex] = {
        name: playerName.trim(),
        score,
      }
    }
  } else {
    updatedScores = [
      ...existingScores,
      {
        name: playerName.trim(),
        score,
      },
    ]
  }

  updatedScores = updatedScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  localStorage.setItem("hangmanLeaderboard", JSON.stringify(updatedScores))
  setLeaderboard(updatedScores)
  scoreSaved.current = true
}, [playerName, score])

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("hangmanLeaderboard") || "[]")
    setLeaderboard(savedScores)
  }, [])

  useEffect(() => {
    if (!isStarted || isWinner || isLoser) return

    const timer = setInterval(() => {
      setTimeLeft(current => {
        if (current <= 1) {
          clearInterval(timer)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isStarted, isWinner, isLoser, word])

  useEffect(() => {
    const newCorrectCount = correctLetters.length
    const newIncorrectCount = incorrectLetters.length

    if (newCorrectCount > previousCorrectCount.current) {
      const difference = newCorrectCount - previousCorrectCount.current
      setScore(current => current + difference * 10)
    }

    if (newIncorrectCount > previousIncorrectCount.current) {
      const difference = newIncorrectCount - previousIncorrectCount.current
      setScore(current => Math.max(0, current - difference * 5))
    }

    previousCorrectCount.current = newCorrectCount
    previousIncorrectCount.current = newIncorrectCount
  }, [correctLetters.length, incorrectLetters.length])

  useEffect(() => {
    if (isWinner && !winBonusAdded.current) {
      setScore(current => current + 20)
      winBonusAdded.current = true
    }
  }, [isWinner])

  useEffect(() => {
  if ((isWinner || isLoser) && !scoreSaved.current) {
    const timer = setTimeout(() => {
      saveScoreToLeaderboard()
    }, 100)

    return () => clearTimeout(timer)
  }
}, [isWinner, isLoser, score, saveScoreToLeaderboard])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isStarted) return

      const key = e.key.toLowerCase()

      if (!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [addGuessedLetter, isStarted])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isStarted) return
      if (e.key !== "Enter") return
      if (!isWinner && !isLoser) return

      e.preventDefault()
      resetGameValues()
    }

    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [isStarted, isWinner, isLoser])

  if (!isStarted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
          padding: "2rem",
          animation: "fadeIn 0.8s ease",
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>

        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            textAlign: "center",
            color: "#8f6fc8",
          }}
        >
          🎮 Hangman Game
        </h1>

      <input
  type="text"
  placeholder="Enter your name"
  value={playerName}
  onChange={(e) => {
    setPlayerName(e.target.value)
    setNameError("")
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      startGame()
    }
  }}
  style={{
    padding: "1rem 1.2rem",
    borderRadius: "14px",
    border: "2px solid #7c3aed",
    outline: "none",
    fontSize: "1.2rem",
    width: "380px",
    maxWidth: "90%",
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    boxShadow: "0 0 15px rgba(124, 58, 237, 0.25)",
    transition: "0.3s ease",
  }}
/>
{nameError && (
  <div
    style={{
      color: "#ef4444",
      fontSize: "0.95rem",
      marginTop: "-1rem",
    }}
  >
    {nameError}
  </div>
)}

        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={startGame}
            style={{
              padding: "0.9rem 1.8rem",
              fontSize: "1.1rem",
              cursor: "pointer",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#7c3aed",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 6px 18px rgba(124, 58, 237, 0.35)",
              transition: "0.3s ease",
            }}
          >
            Start Game
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            style={{
              padding: "0.9rem 1.8rem",
              fontSize: "1.1rem",
              cursor: "pointer",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#334155",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Leaderboard
          </button>
        </div>

        {showLeaderboard && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.65)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                background: "#1e293b",
                color: "#e2e8f0",
                padding: "2rem",
                borderRadius: "14px",
                width: "90%",
                maxWidth: "420px",
                border: "2px solid #7c3aed",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", color: "#8f6fc8", textAlign: "center" }}>
                🏆 Leaderboard
              </h2>

              {leaderboard.length === 0 ? (
                <p style={{ textAlign: "center" }}>No scores yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.name}-${entry.score}-${index}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#0f172a",
                        padding: "0.8rem 1rem",
                        borderRadius: "10px",
                      }}
                    >
                      <span>
                        {index + 1}. {entry.name}
                      </span>
                      <span style={{ fontWeight: "bold", color: "#22c55e" }}>
                        {entry.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  style={{
                    padding: "0.7rem 1.2rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#7c3aed",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        margin: "0 auto",
        alignItems: "center",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {(isWinner || isLoser) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1e293b",
              color: "#e2e8f0",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
              minWidth: "320px",
              border: "2px solid #7c3aed",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <h2 className={`${isWinner ? "clr-grn" : "clr-red"}`}>
                {isWinner ? "🎉 You Won!" : "💀 Game Over"}
              </h2>

              <p>
                {isWinner
                  ? `Great job, ${playerName}! You guessed it!`
                  : isTimeUp
                  ? `Time's up! The word was "${word}"`
                  : `The word was "${word}"`}
              </p>

              <p style={{ fontWeight: "bold" }}>Final Score: {score}</p>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => {
                    resetGameValues()
                  }}
                  style={{
                    padding: "0.7rem 1.2rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#7c3aed",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Play Again
                </button>

                <button
                  onClick={() => setShowLeaderboard(true)}
                  style={{
                    padding: "0.7rem 1.2rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#334155",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Leaderboard
                </button>

                <button
                  onClick={() => {
                    setIsStarted(false)
                    setPlayerName("")
                    setScore(0)
                    setGuessedLetters([])
                    setTimeLeft(60)
                    previousCorrectCount.current = 0
                    previousIncorrectCount.current = 0
                    winBonusAdded.current = false
                    scoreSaved.current = false
                    setGameWord(getWord())
                  }}
                  style={{
                    padding: "0.7rem 1.2rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Exit to Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#1e293b",
              color: "#e2e8f0",
              padding: "2rem",
              borderRadius: "14px",
              width: "90%",
              maxWidth: "420px",
              border: "2px solid #7c3aed",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <h2 style={{ marginBottom: "1rem", color: "#8f6fc8", textAlign: "center" }}>
              🏆 Leaderboard
            </h2>

            {leaderboard.length === 0 ? (
              <p style={{ textAlign: "center" }}>No scores yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.name}-${entry.score}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#0f172a",
                      padding: "0.8rem 1rem",
                      borderRadius: "10px",
                    }}
                  >
                    <span>
                      {index + 1}. {entry.name}
                    </span>
                    <span style={{ fontWeight: "bold", color: "#22c55e" }}>
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button
                onClick={() => setShowLeaderboard(false)}
                style={{
                  padding: "0.7rem 1.2rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#7c3aed",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
      >
        <div>Player: {playerName}</div>
        <div>Score: {score}</div>
        <div>Time Left: {timeLeft}s</div>

        <button
          onClick={() => setShowLeaderboard(true)}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.95rem",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#334155",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Leaderboard
        </button>
      </div>

      <div style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
        Clue: {category}
      </div>

      <HangmanDrawing numberofGuesses={incorrectLetters.length} />

      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={word}
      />

      <div style={{ alignSelf: "stretch", width: "100%", maxWidth: "900px",  margin: "0 auto",justifyContent: "center", }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => word.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App