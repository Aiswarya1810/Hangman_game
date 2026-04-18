import { useCallback, useEffect, useRef, useState } from "react"
import words from "./wordList.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import '../App.css';

function getWord() {
  const categories = Object.keys(words) as Array<keyof typeof words>
  const category = categories[Math.floor(Math.random() * categories.length)]
  const wordList = words[category]
  const word = wordList[Math.floor(Math.random() * wordList.length)]

  return { word, category }
}

function App() {
  const [{ word, category }, setGameWord] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [playerName, setPlayerName] = useState("")
  const [isStarted, setIsStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  const previousCorrectCount = useRef(0)
  const previousIncorrectCount = useRef(0)
  const winBonusAdded = useRef(false)

  const incorrectLetters = guessedLetters.filter(letter => !word.includes(letter))
  const correctLetters = guessedLetters.filter(letter => word.includes(letter))

  const isTimeUp = timeLeft <= 0
  const isLoser = incorrectLetters.length >= 6 || isTimeUp
  const isWinner = word.split("").every(letter =>
    guessedLetters.includes(letter)
  )

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return
    setGuessedLetters(current => [...current, letter])
  }, [guessedLetters, isWinner, isLoser])

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
      setGameWord(getWord())
      setGuessedLetters([])
      setTimeLeft(60)
      previousCorrectCount.current = 0
      previousIncorrectCount.current = 0
      winBonusAdded.current = false
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
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && playerName.trim() !== "") {
              setIsStarted(true)
              setScore(0)
              setTimeLeft(60)
              previousCorrectCount.current = 0
              previousIncorrectCount.current = 0
              winBonusAdded.current = false
            }
          }}
          style={{
            padding: "1rem 1.2rem",
            borderRadius: "14px",
            border: "2px solid #7c3aed",
            outline: "none",
            fontSize: "1.2rem",
            width: "380px",
            backgroundColor: "#1e293b",
            color: "#e2e8f0",
            boxShadow: "0 0 15px rgba(124, 58, 237, 0.25)",
            transition: "0.3s ease",
          }}
        />

        <button
          onClick={() => {
            if (playerName.trim() !== "") {
              setIsStarted(true)
              setScore(0)
              setTimeLeft(60)
              previousCorrectCount.current = 0
              previousIncorrectCount.current = 0
              winBonusAdded.current = false
            }
          }}
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
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: "800px",
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
            <div style={{
                display:'flex',
                flexDirection:'column',
                gap:'20px'
            }}>
                <h2 className={`${isWinner ? 'clr-grn' : 'clr-red'}`}>{isWinner ? "🎉 You Won!" : "💀 Game Over"}</h2>

                            <p>
                            {isWinner
                                ? `Great job, ${playerName}! You guessed it!`
                                : isTimeUp
                                ? `Time's up! The word was "${word}"`
                                : `The word was "${word}"`}
                            </p>

                            <p style={{ fontWeight: "bold" }}>
                            Final Score: {score}
                            </p>
                            
                            <div style={{
                                display:'flex',
                                gap: '20px'
                            }}>
                                <button
                            onClick={() => {
                                setGameWord(getWord())
                                setGuessedLetters([])
                                setTimeLeft(60)
                                previousCorrectCount.current = 0
                                previousIncorrectCount.current = 0
                                winBonusAdded.current = false
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
                                onClick={() => {
                                    setIsStarted(false)
                                    setGuessedLetters([])
                                    setTimeLeft(60)
                                    previousCorrectCount.current = 0
                                    previousIncorrectCount.current = 0
                                    winBonusAdded.current = false
                                    scoreSaved.current = false
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

      <div
        style={{
          width: "100%",
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

      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            word.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App