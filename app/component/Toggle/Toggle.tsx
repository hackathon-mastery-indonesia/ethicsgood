// components/Toggle.tsx
import React, { useState, useEffect } from 'react';

interface ToggleProps {
  options: string[];
  onChange: (option: string) => void;
  defaultOption?: string;
}

const Toggle: React.FC<ToggleProps> = ({ options, onChange, defaultOption }) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption || options[0]);

  useEffect(() => {
    onChange(selectedOption);
  }, [selectedOption, onChange]);

  const handleToggleChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex items-center space-x-4 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          className={`py-2 px-4 rounded-md focus:outline-none text-sm md:text-base ${
            selectedOption === option
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleToggleChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
