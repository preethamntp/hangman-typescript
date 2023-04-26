import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";
import buttonStyle from "./button.module.css";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}
function getRandomKey(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [clue, setClue] = useState(false);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incrrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incrrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters((currnetLetters) => [...currnetLetters, letter]);
    },
    [guessedLetters, isLoser, isWinner]
  );

  useEffect(() => {
    if (clue) {
      const array1 = wordToGuess.split("");
      const unGuessedWordArray = array1.filter(
        (val) => !guessedLetters.includes(val)
      );

      addGuessedLetter(getRandomKey(unGuessedWordArray));
      setClue(false);
    }
  }, [addGuessedLetter, clue, guessedLetters, wordToGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [addGuessedLetter, guessedLetters, clue, wordToGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice try - Refresh to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incrrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div>
        <button
          className={buttonStyle.button}
          title="click here for a clue"
          onClick={() => setClue(true)}
        >
          Clue
        </button>
      </div>
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetter={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetter={incrrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
