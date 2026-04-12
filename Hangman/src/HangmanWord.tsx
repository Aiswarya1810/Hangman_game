export function HangmanWord(){

    const word ="test"
    const setGuessedLetters=["t","e"]

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
       
       {word.split("").map((letter,index)=>(
        <span style={{borderBottom: ".1em solid black",
           height: "0.9em",
        }}key={index}>
        <span style={{
            visibility: setGuessedLetters.includes(letter)?"visible":"hidden",

        }}>
            {letter}</span>
        </span>
       ))}

    </div>
    
}