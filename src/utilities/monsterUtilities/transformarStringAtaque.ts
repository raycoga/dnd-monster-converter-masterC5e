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
    .replace(/{@dice (.*?)}/g, (_, dice) => dice)
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
        // Reemplazar cualquier {@status [status]} por "[status]"
        .replace(/{@status (.*?)}/g, (_, creature) => creature)
  return resultado;
}

export default transformarStringAtaque