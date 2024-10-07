// src/components/JsonInput.tsx
import React, { useState } from 'react';

interface JsonInputProps {
  onJsonChange: (json: string) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onJsonChange }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onJsonChange(e.target.value);
  };
  const clean = () => {
    setInputValue('');
    onJsonChange('');
  };
  return (
    <div className='input-container'>
      <h2>Input JSON</h2>
      <button onClick={clean}>Limpiar</button>
      <textarea
        value={inputValue}
        onChange={handleChange}
        rows={30}
        cols={50}
      />
    </div>
  );
};

export default JsonInput;
