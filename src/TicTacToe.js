import { useEffect, useState } from "react";
import "./index.css";

export default function TicTacToe() {
  const [turnPlay, setTurnPlay] = useState("x");
  const [cells, setCells] = useState(Array(9).fill(""));
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState(() => {
    const storedScores = localStorage.getItem("scores");
    return storedScores ? JSON.parse(storedScores) : { x: 0, o: 0 };
  });

  const checkForWinner = (squares) => {
    const combos = {
      across: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      down: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ],
      diagonal: [
        [0, 4, 8],
        [2, 4, 6],
      ],
    };

    for (const combo in combos) {
      for (const pattern of combos[combo]) {
        if (
          squares[pattern[0]] !== "" &&
          squares[pattern[0]] === squares[pattern[1]] &&
          squares[pattern[0]] === squares[pattern[2]]
        ) {
          setWinner(squares[pattern[0]]);
          return true;
        }
      }
    }

    return false;
  };

  const saveScoresToLocalStorage = (updatedScores) => {
    localStorage.setItem("scores", JSON.stringify(updatedScores));
  };

  const handleClick = (num) => {
    if (winner) {
      return;
    }

    if (cells[num] !== "") {
      alert("Cell already played");
      return;
    }

    const newCells = [...cells];
    newCells[num] = turnPlay;
    setCells(newCells);

    if (checkForWinner(newCells)) {
      setScores((prevScores) => {
        const updatedScores = {
          ...prevScores,
          [turnPlay]: prevScores[turnPlay] + 1,
        };
        saveScoresToLocalStorage(updatedScores);
        return updatedScores;
      });
    } else if (newCells.every((cell) => cell !== "")) {
      setIsDraw(true);
    } else {
      setTurnPlay(turnPlay === "x" ? "o" : "x");
    }
  };

  const handleRestart = () => {
    setWinner(null);
    setCells(Array(9).fill(""));
    setIsDraw(false);
  };

  const resetScores = () => {
    setScores({ x: 0, o: 0 });
    localStorage.removeItem("scores");
  };

  const Cell = ({ num }) => {
    return (
      <td
        onClick={() => handleClick(num)}
        className={cells[num] === "x" ? "x" : cells[num] === "o" ? "o" : ""}
      >
        {cells[num]}
      </td>
    );
  };

  useEffect(() => {
    if (winner) {
      setIsDraw(false);
    }
  }, [winner]);

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>
      <table>
        <caption>
          Turn: {turnPlay === "x" ? "Player 1" : "Player 2"}'s Turn
        </caption>
        <tbody>
          <tr>
            <Cell num={0} />
            <Cell num={1} />
            <Cell num={2} />
          </tr>
          <tr>
            <Cell num={3} />
            <Cell num={4} />
            <Cell num={5} />
          </tr>
          <tr>
            <Cell num={6} />
            <Cell num={7} />
            <Cell num={8} />
          </tr>
        </tbody>
      </table>
      {isDraw ? (
        <>
          <h2>It's a Draw!</h2>
          <button onClick={handleRestart} className="button">
            Restart Game
          </button>
        </>
      ) : winner ? (
        <>
          <h2 className="winner">
            {winner === "x" ? "Player 1" : "Player 2"} is the winner!
          </h2>
          <button onClick={handleRestart} className="button">
            Restart Game
          </button>
        </>
      ) : null}
      <div className="score">
        <p>Score:</p>
        <p className="score-text">Player 1: {scores.x}</p>
        <p className="score-text">Player 2: {scores.o}</p>
      </div>
      <button onClick={resetScores} className="reset-button">
        Reset Scores
      </button>
    </div>
  );
}
