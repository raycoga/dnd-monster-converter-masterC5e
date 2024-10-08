export type ImmuneEntry =
  | string
  | {
      immune: string[];
      note?: string;
      cond?: boolean;
    };

function generarCadenaDeInmunidades(immuneList: ImmuneEntry[]): string {
  let inmunidades: string[] = [];
  let note = "";

  immuneList.forEach((entry) => {
    if (typeof entry === "string") {
      // Si es una cadena, la añadimos a la lista de inmunidades
      inmunidades.push(entry);
    } else if (typeof entry === "object" && entry.immune) {
      // Si es un objeto con una lista de inmunidades, las unimos
      inmunidades.push(entry.immune.join(", "));

      // Si existe el atributo "note", lo almacenamos
      if (entry.note) {
        note = entry.note;
      }
    }
  });

  // Creamos la cadena final
  const resultado =
    inmunidades.length > 1
      ? `${inmunidades.slice(0, -1).join(", ")} and ${
          inmunidades[inmunidades.length - 1]
        }`
      : inmunidades.join("");

  // Añadimos la nota si existe
  return note ? `${resultado} ${note}` : resultado;
}
export default generarCadenaDeInmunidades