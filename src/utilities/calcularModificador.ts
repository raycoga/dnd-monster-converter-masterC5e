function calcularModificador(puntuacion: number): number {
  return Math.floor((puntuacion - 10) / 2);
}
export default calcularModificador;
