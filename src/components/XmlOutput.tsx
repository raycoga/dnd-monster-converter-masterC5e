// src/components/XmlOutput.tsx
import React, { useState } from "react";

interface XmlOutputProps {
  xml: string;
}

const XmlOutput: React.FC<XmlOutputProps> = ({ xml }) => {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null); // Para manejar el estado de copiado

  const copyToClipboard = async () => {
    if (preRef.current) {
      const textToCopy = preRef.current.innerText;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus("¡Contenido copiado al portapapeles!"); // Actualizar estado de éxito
      } catch (err) {
        console.error("Error al copiar el contenido:", err);
        setCopyStatus("Error al copiar el contenido, intenta nuevamente."); // Mostrar estado de error
      }
      setTimeout(() => setCopyStatus(null), 2000); // Limpiar mensaje después de 2 segundos
    }
  };
  return (
    <div className="output-container">
      <h2>Output XML {' '} <button onClick={copyToClipboard} style={styles.button}>
        Copiar Contenido
      </button></h2>
     
      {copyStatus && <p style={styles.status}>{copyStatus}</p>}{" "}
      {/* Mostrar estado */}
      <pre
        style={{
          overflow: "auto",
          maxHeight: "100vh",
          padding: "10px",
          backgroundColor: "#1E1E1E", // Fondo oscuro como en VS Code
          color: "#D4D4D4", // Texto claro
          borderRadius: "4px",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          fontFamily: "'Courier New', Courier, monospace",
        }}
        ref={preRef}
        
      >
        {xml}
      </pre>
    </div>
  );
};

export default XmlOutput;

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  status: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#4CAF50",
  },
};
