import { useState } from "react";
import "./App.css";
import Board from "./Board";
import ControlButtons from "./ControlButtons";
import PickerButtons from "./PickerButtons";

const App: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  const [board, setBoard] = useState<(number | null)[]>(Array(81).fill(null));

  const [loadingCompletion, setLoadingCompletion] = useState<boolean>(false);

  const [timeShow, setTimeShow] = useState<string>("");

  const handleSelectNumber = (button: number | null) => {
    setSelectedButton(button);
  };

  const boxes = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
  ];

  const checkVerticalLine = (colIndex: number) => {
    let verticalArray = [];
    for (let i = colIndex; i <= 80; i += 9) {
      verticalArray.push(board[i]);
    }
    const isSameOnColumn = verticalArray.includes(selectedButton);
    return isSameOnColumn;
  };

  const checkHorizontalLine = (rowIndex: number) => {
    const startingIndex = rowIndex * 9;
    let horizontalArray = board.slice(startingIndex, startingIndex + 9);
    const isSameOnRow = horizontalArray.includes(selectedButton);
    return isSameOnRow;
  };

  const checkBox = (index: number) => {
    const boxIndex = boxes.findIndex((box) => box.includes(index));
    const box = boxes[boxIndex];
    const valuesInBox = box.map((boxIndex) => board[boxIndex]);
    const isSameInBox = valuesInBox.includes(selectedButton);
    return isSameInBox;
  };

  const handleAddNumberOnBoard = (index: number) => {
    if (selectedButton === null || board[index]) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = selectedButton;

    setBoard(newBoard);
    setSelectedButton(null);

    const colIndex = index % 9;
    const rowIndex = Math.floor(index / 9);

    const existsOnVertical = checkVerticalLine(colIndex);
    const existsOnHrizontal = checkHorizontalLine(rowIndex);
    const existsInBox = checkBox(index);

    addClassname(index, existsOnVertical, existsOnHrizontal, existsInBox);
  };

  async function solveSudoku(
    puzzle: (number | null)[]
  ): Promise<(number | null)[]> {
    async function isValid(index: number, value: number) {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;

      for (let i = 0; i < 9; i++) {
        const rowIndex = row * 9 + i;
        const colIndex = col + i * 9;
        const boxIndex = boxRow * 9 + boxCol + Math.floor(i / 3) * 9 + (i % 3);

        if (
          puzzle[rowIndex] === value ||
          puzzle[colIndex] === value ||
          puzzle[boxIndex] === value
        ) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      return true;
    }

    async function solve(index: number): Promise<boolean> {
      if (index === puzzle.length) {
        return true;
      }

      if (puzzle[index] !== null) {
        return solve(index + 1);
      }

      const values = shuffle([...Array(9)].map((_, i) => i + 1));

      for (const value of values) {
        if (await isValid(index, value)) {
          puzzle[index] = value;
          const boardButtons = document.querySelectorAll(".boardButton");
          boardButtons[index].classList.add("correct");
          boardButtons[index].textContent = value.toString();

          if (await solve(index + 1)) {
            return true;
          }

          puzzle[index] = null;
          boardButtons[index].classList.remove("correct");
          boardButtons[index].textContent = "";
        } else {
          const boardButtons = document.querySelectorAll(".boardButton");
          boardButtons[index].classList.add("wrong");
          boardButtons[index].textContent = value.toString();

          await new Promise((resolve) => setTimeout(resolve, 10));
          boardButtons[index].classList.remove("wrong");
          boardButtons[index].textContent = "";
        }
      }

      return false;
    }

    const startTime = new Date().getTime();
    await solve(0);
    const endTime = new Date().getTime();
    const timeTakenInSeconds = (endTime - startTime) / 1000;
    const timeShow = `Time taken to solve puzzle: ${timeTakenInSeconds.toFixed(
      2
    )} seconds`;

    setTimeShow(timeShow);

    return puzzle;
  }

  function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const addClassname = (
    index: number,
    existsOnVertical: boolean,
    existsOnHrizontal: boolean,
    existsInBox: boolean
  ) => {
    const boardButtons = document.querySelectorAll(".boardButton");
    if (!existsOnHrizontal && !existsOnVertical && !existsInBox) {
      boardButtons[index].classList.add("correct");
    } else {
      boardButtons[index].classList.add("wrong");
    }
  };

  const handleRemoveNumberFromBoard = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    const boardButtons = document.querySelectorAll(".boardButton");

    if (board[index]) {
      const newBoard = [...board];
      newBoard[index] = null;
      boardButtons[index].classList.remove("wrong");
      boardButtons[index].classList.remove("correct");
      setBoard(newBoard);
    }
    return;
  };

  const handleResetBoard = async () => {
    const boardButtons = document.querySelectorAll(".boardButton");
    boardButtons.forEach((btn) => {
      btn.classList.remove("wrong");
      btn.classList.remove("correct");
      btn.textContent = "";
    });
    setBoard(Array(81).fill(null));
    setLoadingCompletion(false);
  };

  const handleComputerComplete = async () => {
    handleResetBoard();
    setLoadingCompletion(true);
    const solvedBoard = solveSudoku(Array(81).fill(null));
    setBoard(await solvedBoard);
    setLoadingCompletion(false);
  };

  return (
    <div className="App">
      <h1>Sudoku Game</h1>
      <h4 className="infoText">
        For manual completing click on a button below and then click on the box
      </h4>
      <h4 className="infoText">
        Remove a number right clicking or long pressing (for mobile) on the box
      </h4>
      <ControlButtons
        handleComputerComplete={handleComputerComplete}
        handleResetBoard={handleResetBoard}
        loadingCompletion={loadingCompletion}
      />
      <PickerButtons
        handleSelectNumber={handleSelectNumber}
        selectedButton={selectedButton}
        loadingCompletion={loadingCompletion}
      />
      <Board
        board={board}
        selectedButton={selectedButton}
        handleAddNumberOnBoard={handleAddNumberOnBoard}
        handleRemoveNumberFromBoard={handleRemoveNumberFromBoard}
      />
      {timeShow}
    </div>
  );
};

export default App;
