export type Spellcasting = {
    name: string;
    type: string;
    headerEntries: string[];
    will?: string[]; // Hechizos a voluntad
    daily?: {
      [key: string]: string[]; // Hechizos diarios
    };
    spells?: {
      [level: string]: {
        slots?: number;
        spells: string[];
      };
    };
    ability: string;
  };
  

function convertirSpellcastingEnArrays(spellcasting: Spellcasting): {
    soloHechizos: string[];
    conPrefijos: string[];
    totalSlots: number;
  } {
    // Reemplazo del marcador {@dc} y {@hit} en el header
    const header = spellcasting.headerEntries[0]
      .replace(/{@dc (\d+)}/g, (_, dc) => `DC ${dc}`)
      .replace(/{@hit (\d+)}/g, (_, hit) => `+${hit}`);
  
    const soloHechizos: string[] = [`Spellcasting. ${header}`];
    const conPrefijos: string[] = [`Spellcasting. ${header}`];
    let totalSlots = 0;
  
    // Función para limpiar los marcadores {@spell} en los nombres de los hechizos
    const limpiarSpell = (spell: string) =>
      spell.replace(/{@spell (.*?)}/g, (_, spellName) => spellName);
  
    // Si existen hechizos a voluntad (will)
    if (spellcasting.will) {
      const hechizosWill = spellcasting.will.map(limpiarSpell).join(", ");
      soloHechizos.push(`${hechizosWill}`); // Solo los nombres de los hechizos
      conPrefijos.push(`At will: ${hechizosWill}`); // Con el prefijo "At will"
    }
  
    // Si existen hechizos diarios (daily)
    if (spellcasting.daily) {
      for (const frecuencia in spellcasting.daily) {
        const frecuenciaHechizos = spellcasting.daily[frecuencia]
          .map(limpiarSpell)
          .join(", ");
        soloHechizos.push(`${frecuenciaHechizos}`); // Solo los nombres de los hechizos
        conPrefijos.push(`${frecuencia}/day each: ${frecuenciaHechizos}`); // Con el prefijo "1/day each", "2/day each", etc.
      }
    }
  
    // Si existen hechizos por nivel (spells)
    if (spellcasting.spells) {
      for (const nivel in spellcasting.spells) {
        const nivelData = spellcasting.spells[nivel];
        const nivelNombre =
          nivel === "0"
            ? "Cantrips (at will)"
            : `${nivel}st level (${nivelData.slots} slots)`;
  
        // Limpiar los nombres de los hechizos
        const hechizos = nivelData.spells.map(limpiarSpell).join(", ");
  
        // Añadir solo los nombres de los hechizos
        soloHechizos.push(`${hechizos}`);
  
        // Añadir la línea con prefijo
        conPrefijos.push(`${nivelNombre}: ${hechizos}`);
  
        // Sumar los slots si existen
        if (nivelData.slots) {
          totalSlots += nivelData.slots;
        }
      }
    }
  
    return { soloHechizos, conPrefijos, totalSlots };
  }
  export default convertirSpellcastingEnArrays