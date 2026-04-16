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

  const[guessedLetters, setGuessedLetters]=useState<string[]>([])
  

const incorrectLetters = guessedLetters.filter(
  letter => !word.includes(letter)
)

const isLoser = incorrectLetters.length >= 6
const isWinner = word.split("").every(letter=>
   guessedLetters.includes(letter))

const addGuessedLetter = useCallback((letter: string) => {
  if (guessedLetters.includes(letter) || isWinner || isLoser) return

  setGuessedLetters(currentLetters => [...currentLetters, letter])
}, [guessedLetters, isWinner, isLoser])

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()

    if(!key.match(/^[a-z]$/)) return
    e.preventDefault()
    addGuessedLetter(key)
}

document.addEventListener("keypress",handler)
return()=> {
  document.removeEventListener("keypress",handler)

}
}, [guessedLetters])


useEffect(() => {
const handler = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    if(key !== "Enter") 
    return
   e.preventDefault()
   setGameWord(getWord())
   setGuessedLetters([])
   
    
}

document.addEventListener("keydown",handler)
return()=> {
  document.removeEventListener("keydown",handler)

}
}, [])

  return (<div style={{
    maxWidth: "800px",
    width: "100%",
    display: "flex",
    flexDirection:"column",
    gap :"2rem",
    margin: "0 auto",
    alignItems: "center"


}} >
    <div style={{ fontSize: "2rem",textAlign:"center"}}>
      
      {isWinner && "Winner! - Refresh to try again"}
      {isLoser && "Nice Try - Refresh to try again"}

    </div>

    <div style={{ fontSize: "1.5rem", textAlign: "center" }}>
      Clue : {category}
    </div>
    <HangmanDrawing numberofGuesses={incorrectLetters.length}/>
    <HangmanWord 
    reveal ={isLoser}
    guessedLetters = {guessedLetters} 
    wordToGuess ={word}/>

    <div style={{alignSelf:"stretch"}}>
    <Keyboard 
      disabled={isWinner || isLoser}
      activeLetters = { guessedLetters.filter(letter => word.includes (letter))}
      inactiveLetters={incorrectLetters}
      addGuessedLetter ={addGuessedLetter}
  
  />
    </div>
    

  </div>
  )
}

export default App
