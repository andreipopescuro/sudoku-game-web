import { useState } from "react";

interface BoardProps {
  board: (number | null)[];
  selectedButton: number | null;
  handleAddNumberOnBoard: (index: number) => void;
  handleRemoveNumberFromBoard: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
}

const Board: React.FC<BoardProps> = ({
  board,
  handleAddNumberOnBoard,
  selectedButton,
  handleRemoveNumberFromBoard,
}) => {
  return (
    <div className="boardContainer">
      {board.map((button, index) => (
        <button
          key={index}
          className="boardButton"
          onClick={() => handleAddNumberOnBoard(index)}
          onContextMenu={(event) => handleRemoveNumberFromBoard(event, index)}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default Board;
