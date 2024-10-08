function capitalizarPrimeraLetra(palabra: string): string {
  if (!palabra) return ""; // Verifica si la cadena está vacía
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

export default capitalizarPrimeraLetra;
