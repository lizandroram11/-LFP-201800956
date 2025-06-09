import { Token } from "./token";
import { Pokemon } from "./pokemon";

export function extraerPokemones(tokens: Token[]): Pokemon[] {
  const pokemones: Pokemon[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Buscar un bloque que empiece con la palabra "Pokemon"
    if (token.valor === 'Pokemon') {
      let nombre = '';
      let tipo = '';
      let salud = 0;
      let ataque = 0;
      let defensa = 0;

      // Nombre: siguiente token tipo cadena
      if (tokens[i + 1]?.tipo === 'Cadena') {
        nombre = tokens[i + 1].valor.replace(/"/g, '');
        i += 2;
      } else {
        continue; // Saltar este bloque si está mal
      }

      // Recolectar atributos hasta encontrar otro "Pokemon" o final
      while (i < tokens.length && tokens[i].valor !== 'Pokemon') {
        const t = tokens[i];

        if (t.valor === 'tipo' && tokens[i + 2]?.tipo === 'PalabraReservada') {
          tipo = tokens[i + 2].valor;
          i += 3;
        } else if (t.valor === 'salud' && tokens[i + 2]?.tipo === 'Numero') {
          salud = parseInt(tokens[i + 2].valor);
          i += 3;
        } else if (t.valor === 'ataque' && tokens[i + 2]?.tipo === 'Numero') {
          ataque = parseInt(tokens[i + 2].valor);
          i += 3;
        } else if (t.valor === 'defensa' && tokens[i + 2]?.tipo === 'Numero') {
          defensa = parseInt(tokens[i + 2].valor);
          i += 3;
        } else {
          i++; // Avanza normalmente si no se reconoce el patrón
        }
      }

      // Verifica que todos los campos requeridos están presentes
      if (nombre && tipo && salud && ataque && defensa) {
        const iv = ((salud + ataque + defensa) / 45) * 100;
        pokemones.push({ nombre, tipo, salud, ataque, defensa, iv });
      }
    }
  }

  return pokemones;
}
