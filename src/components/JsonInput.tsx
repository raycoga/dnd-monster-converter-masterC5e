// src/components/JsonInput.tsx
import React, { useState } from "react";

interface JsonInputProps {
  onJsonChange: (json: string) => void;
  moreDataChange: (json: string) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({
  onJsonChange,
  moreDataChange,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputValue2, setInputValue2] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onJsonChange(e.target.value);
  };

  const handleChangetwo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue2(e.target.value);
    moreDataChange(e.target.value);
  };

  const clean = () => {
    setInputValue("");
    setInputValue2("");
    onJsonChange("");
    moreDataChange("");
  };

  return (
    <div className="input-container">
      <h2 style={{margin:0}}>
        Input JSON{' '}
        <button onClick={clean}>Limpiar</button>
      </h2>
      <textarea
        value={inputValue}
        onChange={handleChange}
        rows={15}
        cols={50}
      />
      Agregar mas descripcion
      <textarea
        value={inputValue2}
        onChange={handleChangetwo}
        rows={15}
        cols={50}
      />
    </div>
  );
};

export default JsonInput;
