import transformarStringAtaque from "./transformarStringAtaque";

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

  export default createElement