import React from "react";

interface PickerButtonsProps {
  handleSelectNumber: (button: number | null) => void;
  selectedButton: number | null;
  loadingCompletion: boolean;
}

const PickerButtons: React.FC<PickerButtonsProps> = ({
  handleSelectNumber,
  selectedButton,
  loadingCompletion,
}) => {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="pickerButtonsContainer">
      {buttons.map((button) => (
        <button
          key={button}
          className={`pickerButton ${selectedButton === button && "selected"}`}
          onClick={() => handleSelectNumber(button)}
          disabled={loadingCompletion}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default PickerButtons;
