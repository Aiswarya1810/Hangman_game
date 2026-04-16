import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"

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

  const incorrectLetters = guessedLetters.filter(letter => !word.includes(letter))

  const isLoser = incorrectLetters.length >= 6
  const isWinner = word.split("").every(letter =>
    guessedLetters.includes(letter)
  )

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return
    setGuessedLetters(current => [...current, letter])
  }, [guessedLetters, isWinner, isLoser])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if (!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [addGuessedLetter])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return

      e.preventDefault()
      setGameWord(getWord())
      setGuessedLetters([])
    }

    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [])

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
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
            <h2>{isWinner ? "🎉 You Won!" : "💀 Game Over"}</h2>

            <p style={{ marginTop: "10px" }}>
              {isWinner
                ? "Great job! You guessed it!"
                : `The word was "${word}"`}
            </p>

            <button
              onClick={() => {
                setGameWord(getWord())
                setGuessedLetters([])
              }}
              style={{
                marginTop: "1rem",
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
          </div>
        </div>
      )}

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