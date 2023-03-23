import React from "react";

interface ControlButtonsProps {
  handleResetBoard: () => void;
  handleComputerComplete: () => void;
  loadingCompletion: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  handleResetBoard,
  handleComputerComplete,
  loadingCompletion,
}) => {
  return (
    <div className="controlsContainer">
      <button onClick={handleComputerComplete} disabled={loadingCompletion}>
        Let the computer complete
      </button>
      <button onClick={handleResetBoard} disabled={loadingCompletion}>
        Reset
      </button>
    </div>
  );
};

export default ControlButtons;
