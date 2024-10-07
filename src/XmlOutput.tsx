// src/components/XmlOutput.tsx
import React from "react";

interface XmlOutputProps {
  xml: string;
}

const XmlOutput: React.FC<XmlOutputProps> = ({ xml }) => {
  const preRef = React.useRef<HTMLPreElement>(null);
  const copyToClipboard = async () => {
    if (preRef.current) {
      const textToCopy = preRef.current.innerText; // Obtener el contenido de <pre>
      try {
        await navigator.clipboard.writeText(textToCopy); // Copiar al portapapeles
        alert("Contenido copiado al portapapeles!"); // Mensaje de éxito
      } catch (err) {
        console.error("Error al copiar el contenido:", err);
      }
    }
  };
  return (
    <div className="output-container">
      <h2>Output XML</h2>{" "}
      <button onClick={copyToClipboard}>Copiar Contenido</button>
      <pre style={{overflow:'auto', maxHeight:500}} ref={preRef}>{xml}</pre>
    </div>
  );
};

export default XmlOutput;
