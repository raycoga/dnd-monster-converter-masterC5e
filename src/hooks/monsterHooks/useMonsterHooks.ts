import {  useState } from "react";
import { create } from "xmlbuilder";
import calcularModificador from "../../utilities/calcularModificador";
import capitalizarPrimeraLetra from "../../utilities/capitalizarPrimerLetra";
import generarCadenaDeInmunidades from "../../utilities/monsterUtilities/generarCadenaDeInmunidades";
import transformarStringAtaque from "../../utilities/monsterUtilities/transformarStringAtaque";
import createElement from "../../utilities/monsterUtilities/createElement";
import convertirSpellcastingEnArrays from "../../utilities/monsterUtilities/convertirSpellcastinEnarrays";

const useMonsterHooks = () => {

  const [xml, setXml] = useState<string>("");
  const [xmlRawObject, setxmlRawObject] = useState<any>(create("monster"));
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

  return { xml, xmlRawObject, setXml, convertJsonToXml };
};
export default useMonsterHooks;
