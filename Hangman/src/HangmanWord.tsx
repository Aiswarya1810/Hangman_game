type HangmanWordProps ={
    guessesLetters : string[]
    wordToGuess: string
}


export function HangmanWord({ guessedLetters, wordToGuess}: HangmanWordProps) {


    return<div style ={{
        display: "flex", 
        gap:".25em",
        fontSize:"3rem",
        fontWeight:"bold", 
        textTransform:"uppercase",
        fontFamily:"monospace",
        color: "black",              // text color
        marginTop: "1rem",           //  move down
        justifyContent: "center",
        alignItems: "flex-end",    }}>
       
       {wordToGuess.split("").map((letter,index)=>(
        <span style={{borderBottom: ".1em solid black",
           height: "0.9em",
        }}key={index}>
        <span style={{
            visibility: guessedLetters.includes(letter)?"visible":"hidden",

        }}>
            {letter}</span>
        </span>
       ))}

    </div>
    
}