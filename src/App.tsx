// src/App.tsx
import React, { useState } from "react";
import { create } from "xmlbuilder";
import JsonInput from "./JsonInput";
import XmlOutput from "./XmlOutput";

type ImmuneEntry =
  | string
  | {
      immune: string[];
      note?: string;
      cond?: boolean;
    };

type Spellcasting = {
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

const createElement = ({ tag, trait, xmlObj }: any) => {
  const OBJECT = xmlObj.ele(tag);
  OBJECT.ele("name", transformarStringAtaque(trait.name));
  trait.entries.forEach((entry: string | any) => {
    if (typeof entry === "string") {
      OBJECT.ele("text", transformarStringAtaque(entry));
    } else if (entry.items) {
      entry.items.forEach((item: string | any) => {
        OBJECT.ele("text", transformarStringAtaque(item.name));
        OBJECT.ele("text", transformarStringAtaque(item.entries.join("")));
      });
    }
  });
  OBJECT.ele(
    "attack",
    `${transformarStringAtaque(trait.name)}${transformarAtaqueAFormatoBreve(
      transformarStringAtaque(trait.entries.join(","))
    )}`
  );
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

function transformarAtaqueAFormatoBreve(input: string): string {
  // Expresión regular para capturar el valor de hit y el daño
  const hitRegex = /\+(\d+) to hit/;
  const damageRegex = /\((\d+d\d+ \+ \d+)\)/;

  // Extraer el valor de hit
  const hitMatch = input.match(hitRegex);
  const hitValue = hitMatch ? `+${hitMatch[1]}` : "";

  // Extraer el valor de daño
  const damageMatch = input.match(damageRegex);
  const damageValue = damageMatch ? damageMatch[1].replace(/\s+/g, "") : "";

  // Devolver el resultado en el formato solicitado
  if (hitValue?.length > 0 && damageValue?.length > 0)
    return `|${hitValue}|${damageValue}`;
  return "";
}

function transformarStringAtaque(input: string): string {
  if (input === "" || input === undefined || input === null) return "";

  // Reemplazos básicos
  let resultado = input
    // Reemplazar {@atk mw,rw}, {@atk mw}, o {@atk rw} por su equivalente
    .replace(/{@atk (mw|rw|rs|ms)(,rw|,mw|,rs|,ms)?}/g, (_, tipo1, tipo2) => {
      if (tipo1 === "mw" && tipo2 === ",rw")
        return "Melee or Ranged Weapon Attack";
      if (tipo1 === "ms" && tipo2 === ",rs")
        return "Melee or Ranged Spell Attack";
      if (tipo1 === "ms") return "Melee Spell Attack";
      if (tipo1 === "mw") return "Melee Weapon Attack";
      if (tipo1 === "rs") return "Ranged Spell Attack";
      if (tipo1 === "rw") return "Ranged Weapon Attack";
      return ""; // Para manejar casos inesperados
    })
    // Reemplazar {@hit X} por "+X to hit"
    .replace(/{@hit (\d+)}/g, (_, hit) => `+${hit} to hit`)
    // Reemplazar {@h} por "Hit:"
    .replace(/{@h}/g, "Hit:")
    // Reemplazar {@damage XdY + Z} por "XdY + Z"
    .replace(/{@damage ([0-9]+d[0-9]+(?: \+ \d+)?)}/g, (_, damage) => damage)
    // Reemplazar {@recharge X} por "(Recharge X–6)"
    .replace(/{@recharge (\d)}/g, (_, recarga) => `(Recharge ${recarga}–6)`)
    // Reemplazar {@dc X} por "DC X" para las tiradas de salvación
    .replace(/{@dc (\d+)}/g, (_, dc) => `DC ${dc}`)
    // Reemplazar {@dice XdY + Z} por "XdY + Z"
    .replace(/{@dice ([0-9]+d[0-9]+(?: \+ \d+)?)}/g, (_, dice) => dice)
    // Reemplazar cualquier {@condition [condición]} por "[condición]"
    .replace(/{@condition (.*?)}/g, (_, condition) => condition)
    // Reemplazar cualquier {@spell [hechizo]} por "[Hechizo]"
    .replace(/{@spell (.*?)}/g, (_, spell) => spell)

    // Reemplazar cualquier {@skill  [habilidad]} por "[habilidad]"
    .replace(/{@skill (.*?)}/g, (_, skill) => skill)
    // Reemplazar cualquier {@sense [sentido]} por "[sentido]"
    .replace(/{@sense (.*?)}/g, (_, sense) => sense)
    // Reemplazar cualquier {@note  [nota]} por "[nota]"
    .replace(/{@note (.*?)}/g, (_, note) => note)
    // Reemplazar cualquier {@creature [criatura]} por "[criatura]"
    .replace(/{@creature (.*?)}/g, (_, creature) => creature)
  return resultado;
}

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

function calcularModificador(puntuacion: number): number {
  return Math.floor((puntuacion - 10) / 2);
}
function capitalizarPrimeraLetra(palabra: string): string {
  if (!palabra) return ""; // Verifica si la cadena está vacía
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

const App: React.FC = () => {
  const [xml, setXml] = useState<string>("");
  const [xmlRawObject, setxmlRawObject] = useState<any>(create("monster"));
  const [descriptionInfo, setdescriptionInfo] = useState("");
  const convertJsonToXml = (jsonString: string) => {
    if (jsonString === "") return setXml("");
    try {
      const json = JSON.parse(jsonString);
      const xmlObj = create("monster");
      // Agregar propiedades básicas
      xmlObj.ele("name", json.name);
      xmlObj.ele("source", json.source);
      xmlObj.ele("cr", json.cr);
      xmlObj.ele("page", json.page);

      // Agregar tamaño y tipo
      xmlObj.ele("size", json.size[0]);
      if (json.type.type) xmlObj.ele("type", json.type.type);
      if (json.type.tags) {
        xmlObj.ele("tags", json.type.tags.join(", "));
      }

      // Agregar alineación
      if (json.alignment) xmlObj.ele("alignment", json.alignment.join(", "));

      // Agregar armadura y puntos de vida
      xmlObj.ele(
        "ac",
        `${json.ac[0].ac ? json.ac[0].ac : json.ac[0]} (${
          json?.ac[0]?.from ? json.ac[0].from[0] : ""
        })`
      );
      xmlObj.ele("hp", `${json.hp.average} (${json.hp.formula})`);

      // Agregar velocidad
      let speedString = "";
      if (json.speed.walk)
        speedString += `walk ${
          json.speed.walk.number ? json.speed.walk.number : json.speed.walk
        },`;
      if (json.speed.burrow)
        speedString += `burrow ${
          json.speed.burrow.number
            ? json.speed.burrow.number
            : json.speed.burrow
        }, `;
      if (json.speed.fly)
        speedString += `fly ${
          json.speed.fly.number ? json.speed.fly.number : json.speed.fly
        } `;
      if (json.speed.swim)
        speedString += `swim ${
          json.speed.swim.number ? json.speed.swim.number : json.speed.swim
        } `;
      if (json.speed.climb)
        speedString += `climb ${
          json.speed.climb.number ? json.speed.climb.number : json.speed.climb
        } `;
      xmlObj.ele("speed", speedString);

      // Agregar iniciativa
      if (json.dex)
        xmlObj.ele(
          "init",
          `${calcularModificador(json.dex)} (${
            calcularModificador(json.dex) + 10
          })`
        );

      // Agregar atributos
      if (json.str) xmlObj.ele("str", { class: "hola" }, json.str);
      if (json.dex) xmlObj.ele("dex", json.dex);
      if (json.con) xmlObj.ele("con", json.con);
      if (json.int) xmlObj.ele("int", json.int);
      if (json.wis) xmlObj.ele("wis", json.wis);
      if (json.cha) xmlObj.ele("cha", json.cha);

      // Agregar salvaciones
      if (json.save)
        xmlObj.ele(
          "save",
          Object.entries(json.save)
            .map(
              ([clave, valor]) => `${capitalizarPrimeraLetra(clave)}: ${valor}`
            )
            .join(", ")
        );

      // Agregar habilidades
      if (json.skill)
        xmlObj.ele(
          "skill",
          Object.entries(json.skill)
            .map(
              ([clave, valor]) => `${capitalizarPrimeraLetra(clave)}: ${valor}`
            )
            .join(", ")
        );


      // Agregar inmunidades
      if (json.immune)
        xmlObj.ele("immune", generarCadenaDeInmunidades(json.immune));

      // Agregar inmunidades a condiciones
      if (json.conditionImmune)
        xmlObj.ele(
          "conditionImmune",
          generarCadenaDeInmunidades(json.conditionImmune)
        );

      // Agregar senses
      if (json.senses) xmlObj.ele("senses", json.senses.join(", "));

      // Agregar pasiva
      if (json.passive) xmlObj.ele("passive", json.passive);

      // Agregar idiomas
      if (json.languages) xmlObj.ele("languages", json.languages.join(", "));

      // Agregar rasgos
      if (json.trait) {
        json.trait.forEach((trait: any) => {
          const traits = xmlObj.ele("trait");
          traits.ele("name", trait.name);
          trait.entries.forEach((entry: string) => {
            traits.ele("text", transformarStringAtaque(entry));
          });
        });
      }

      // Agregar acciones
      if (json.action) {
        json.action.forEach((trait: any) => {
          createElement({ tag: "action", trait, xmlObj });
        });
      }
        // Agregar bonus
        if (json.bonus) {
          json.bonus.forEach((trait: any) => {
            createElement({ tag: "action", trait, xmlObj });
          });
        }
      // Agregar reacciones
      if (json.reaction) {
        json.reaction.forEach((trait: any) => {
          createElement({ tag: "reaction", trait, xmlObj });
        });
      }
     
      // Agregar acciones legendarias
      if (json.legendary) {
        json.legendary.forEach((trait: any) => {
          createElement({ tag: "legendary", trait, xmlObj });
        });
      }
      // Agregar ambiente
      if (json.environment) {
        const environment = xmlObj.ele("environment");
        json.environment.forEach((env: string) => environment.ele("type", env));
      }
      // Agregar sonido
      if (json.soundClip) {
        const soundClip = xmlObj.ele("soundClip");
        soundClip.ele("type", json.soundClip.type);
        soundClip.ele("path", json.soundClip.path);
      }
      // Agregar variantes
      if (json.variant) {
        const variants = xmlObj.ele("description");
        json.variant.forEach((variant: any) => {
          variants.ele("text", transformarStringAtaque(variant.name));
          variant.entries.forEach((entry: any) => {
            if (entry.type === "entries") {
              entry.entries.forEach((entryText: any) => {
                if (typeof entryText === "string") {
                  variants.ele("text", transformarStringAtaque(entryText));
                } else {
                  entryText.items.forEach((moreEntries: any) => {
                    variants.ele(
                      "text",
                      transformarStringAtaque(moreEntries.name)
                    );
                    variants.ele(
                      "text",
                      transformarStringAtaque(moreEntries.entries.join(""))
                    );
                  });
                }
              });
            } else if (entry.type === "list") {
              entry.items.forEach((item: any) => {
                const itemElement = variants.ele("item", {
                  name: item.name,
                });
                item.entries.forEach((itemEntry: string) => {
                  itemElement.ele("text", transformarStringAtaque(itemEntry));
                });
              });
            }
          });
        });
      }

      // Agregar hechizos
      if (json.spellcasting) {
        const { conPrefijos, totalSlots, soloHechizos } =
          convertirSpellcastingEnArrays(json.spellcasting[0]);
        xmlObj.ele("slots", totalSlots);
        conPrefijos.forEach((spell: any) => {
          xmlObj.ele("text", spell);
        });
        soloHechizos.forEach((spell: any, key: number) => {
          if (key !== 0) {
            xmlObj.ele("spells", spell);
          }
        });
      }

      // Agregar rasgos de clase
      if (json.features) {
        const features = xmlObj.ele("features");
        json.features.forEach((feature: any) => {
          const featureElement = features.ele("feature", {
            name: feature.name,
          });
          feature.entries.forEach((entry: string) => {
            featureElement.ele("entry", entry);
          });
        });
      }

      // Agregar habilidades de invocación
      if (json.summonAbilities) {
        const summonAbilities = xmlObj.ele("summonAbilities");
        json.summonAbilities.forEach((ability: any) => {
          const abilityElement = summonAbilities.ele("ability", {
            name: ability.name,
          });
          ability.entries.forEach((entry: string) => {
            abilityElement.ele("entry", entry);
          });
        });
      }

      // Agregar etiquetas de rasgos, sentidos, acciones, etc.
      if (json.traitTags) {
        const traitTags = xmlObj.ele("traitTags");
        json.traitTags.forEach((tag: string) => traitTags.ele("tag", tag));
      }
      if (json.senseTags) {
        const senseTags = xmlObj.ele("senseTags");
        json.senseTags.forEach((tag: string) => senseTags.ele("tag", tag));
      }
      if (json.actionTags) {
        const actionTags = xmlObj.ele("actionTags");
        json.actionTags.forEach((tag: string) => actionTags.ele("tag", tag));
      }
      if (json.languageTags) {
        const languageTags = xmlObj.ele("languageTags");
        json.languageTags.forEach((tag: string) =>
          languageTags.ele("tag", tag)
        );
      }
      if (json.damageTags) {
        const damageTags = xmlObj.ele("damageTags");
        json.damageTags.forEach((tag: string) => damageTags.ele("tag", tag));
      }
      if (json.miscTags) {
        const miscTags = xmlObj.ele("miscTags");
        json.miscTags.forEach((tag: string) => miscTags.ele("tag", tag));
      }
      if (json.conditionInflict) {
        const conditionInflict = xmlObj.ele("conditionInflict");
        json.conditionInflict.forEach((condition: string) =>
          conditionInflict.ele("condition", condition)
        );
      }
      if (json.savingThrowForced) {
        const savingThrowForced = xmlObj.ele("savingThrowForced");
        json.savingThrowForced.forEach((throwType: string) =>
          savingThrowForced.ele("throwType", throwType)
        );
      }

      // Agregar otros atributos
      xmlObj.ele("hasToken", json.hasToken ? "true" : "false");
      xmlObj.ele("hasFluff", json.hasFluff ? "true" : "false");
      xmlObj.ele("hasFluffImages", json.hasFluffImages ? "true" : "false");

      // Finalizar y establecer XML
      setxmlRawObject(xmlObj);
      /* setXml(xmlObj.end({ pretty: true })); */
    } catch (error) {
      console.error("Error converting JSON to XML:", error);
      setXml(""); // O manejar el error como prefieras
    }
  };

  const moreDataChange = (value: string) => {
    setdescriptionInfo(value);
  };

  const handleTransform = () => {
    xmlRawObject.ele("description", transformarStringAtaque(descriptionInfo));
    setXml(xmlRawObject.end({ pretty: true }));
  };

  return (
    <div>
      <h1>JSON to XML Converter for Game Master 5</h1>
      <div className="body">
        <JsonInput
          onJsonChange={convertJsonToXml}
          moreDataChange={moreDataChange}
        />
        <button onClick={handleTransform}>transformar</button>
        <XmlOutput xml={xml} />
      </div>
    </div>
  );
};

export default App;
