// src/App.tsx
import React, { useState } from "react";
/* import * as xmlbuilder from 'xmlbuilder'; */
import { create } from "xmlbuilder";
import JsonInput from "./JsonInput";
import XmlOutput from "./XmlOutput";

const App: React.FC = () => {
  const [xml, setXml] = useState<string>("");

 /*  const convertJsonToXml = (json: any) => {
    const root = xmlbuilder.create('monster');

    const addPropertiesToXml = (obj: any, parent: any) => {
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          const arrayElement = parent.ele(key);
          obj[key].forEach((item: any) => {
            if (typeof item === 'object') {
              addPropertiesToXml(item, arrayElement);
            } else {
              arrayElement.ele('item', item);
            }
          });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const child = parent.ele(key);
          addPropertiesToXml(obj[key], child);
        } else {
          parent.ele(key, obj[key]);
        }
      }
    };

    addPropertiesToXml(json, root);
    setXml(root.end({ pretty: true }))
  
  }; */


 const convertJsonToXml = (jsonString: string) => {
  if(jsonString==='') return setXml('')
    try {
      const json = JSON.parse(jsonString);
      const xmlObj = create("Monster");

      // Agregar propiedades básicas
      xmlObj.ele("name", json.name);
      xmlObj.ele("source", json.source);
      xmlObj.ele("cr", json.cr);
      xmlObj.ele("page", json.page);

      // Agregar tamaño y tipo
      xmlObj.ele("size", json.size[0]);
      xmlObj.ele("type", json.type.type);
      if (json.type.tags) {
        xmlObj.ele("tags", json.type.tags.join(", "));
      }

      // Agregar alineación
      if (json.alignment) xmlObj.ele("alignment", json.alignment.join(", "));

      // Agregar armadura y puntos de vida
      xmlObj.ele("ac", json.ac[0].ac);
      xmlObj.ele("hp", json.hp.average);
      xmlObj.ele("hpFormula", json.hp.formula);

      // Agregar velocidad
      const speed = xmlObj.ele("speed");
      if (json.speed.walk) speed.ele("walk", json.speed.walk);
      if (json.speed.burrow) speed.ele("burrow", json.speed.burrow);
      if (json.speed.fly) speed.ele("fly", json.speed.fly);
      if (json.speed.swim) speed.ele("swim", json.speed.swim);
      if (json.speed.climb) speed.ele("climb", json.speed.climb);

      // Agregar atributos
      const attributes = xmlObj.ele("attributes");
      attributes.ele("str", json.str);
      attributes.ele("dex", json.dex);
      attributes.ele("con", json.con);
      attributes.ele("int", json.int);
      attributes.ele("wis", json.wis);
      attributes.ele("cha", json.cha);

      // Agregar salvaciones
      const saves = xmlObj.ele("savingThrows");
      if (json.save)
        Object.entries(json.save).forEach(([key, value]: any) => {
          saves.ele(key, value);
        });

      // Agregar habilidades
      const skills = xmlObj.ele("skills");
      if (json.skill)
        Object.entries(json.skill).forEach(([key, value]: any) => {
          skills.ele(key, value);
        });
 // Agregar pasiva
 if (json.passive)xmlObj.ele("passive", json.passive);
      // Agregar sentidos
      const senses = xmlObj.ele("senses");
      if (json.senses)
        json.senses.forEach((sense: string) => senses.ele("sense", sense));

      // Agregar inmunidades
      const immune = xmlObj.ele("immunities");
      if (json.immune)
        json.immune.forEach((item: string) => immune.ele("immune", item));

      // Agregar inmunidades a condiciones
      const conditionImmune = xmlObj.ele("conditionImmunities");
      if (json.conditionImmune)
        json.conditionImmune.forEach((item: string) =>
          conditionImmune.ele("conditionImmune", item)
        );

      // Agregar idiomas
      const languages = xmlObj.ele("languages");
      if (json.languages)
        json.languages.forEach((language: string) =>
          languages.ele("language", language)
        );

      // Agregar rasgos
      if (json.trait) {
        const traits = xmlObj.ele("traits");
        json.trait.forEach((trait: any) => {
          const traitElement = traits.ele("trait", { name: trait.name });
          trait.entries.forEach((entry: string) => {
            traitElement.ele("entry", entry);
          });
        });
      }

      // Agregar acciones
      if (json.action) {
        const actions = xmlObj.ele("actions");
        json.action.forEach((action: any) => {
          const actionElement = actions.ele("action", { name: action.name });
          action.entries.forEach((entry: string) => {
            actionElement.ele("entry", entry);
          });
        });
      }

      // Agregar acciones legendarias
      if (json.legendary) {
        const legendaryActions = xmlObj.ele("legendaryActions");
        json.legendary.forEach((legendary: any) => {
          const legendaryElement = legendaryActions.ele("legendaryAction", {
            name: legendary.name,
          });
          legendary.entries.forEach((entry: string) => {
            legendaryElement.ele("entry", entry);
          });
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
        const variants = xmlObj.ele("variants");
        json.variant.forEach((variant: any) => {
          const variantElement = variants.ele("variant", {
            type: variant.type,
            name: variant.name,
          });
          variant.entries.forEach((entry: any) => {
            if (entry.type === "entries") {
              entry.entries.forEach((entryText: string) => {
                variantElement.ele("entry", entryText);
              });
            } else if (entry.type === "list") {
              entry.items.forEach((item: any) => {
                const itemElement = variantElement.ele("item", {
                  name: item.name,
                });
                item.entries.forEach((itemEntry: string) => {
                  itemElement.ele("entry", itemEntry);
                });
              });
            }
          });
        });
      }

      // Agregar hechizos
      if (json.spells) {
        const spells = xmlObj.ele("spells");
        json.spells.forEach((spell: any) => {
          const spellElement = spells.ele("spell", {
            name: spell.name,
            level: spell.level,
          });
          spell.entries.forEach((entry: string) => {
            spellElement.ele("entry", entry);
          });
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
      setXml(xmlObj.end({ pretty: true }));
    } catch (error) {
      console.error("Error converting JSON to XML:", error);
      setXml(""); // O manejar el error como prefieras
    }
  }; 



  return (
    <div>
      <h1>JSON to XML Converter for Game Master 5</h1>
      <div className="body">
        <JsonInput onJsonChange={convertJsonToXml} />
        <XmlOutput xml={xml} />
      </div>
    </div>
  );
};

export default App;
