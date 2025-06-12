import { Token } from "./token";
import { Pokemon } from "./pokemon";

export function extraerPokemones(tokens: Token[]): Pokemon[] {
  const pokemones: Pokemon[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Inicia un bloque de Pokémon
    if (token.valor === 'Pokemon') {
      let nombre = '';
      let tipo = '';
      let salud = 0;
      let ataque = 0;
      let defensa = 0;

      // Esperar cadena como nombre del Pokémon
      if (tokens[i + 1]?.tipo === 'Cadena') {
        nombre = tokens[i + 1].valor.replace(/"/g, '');
        i += 2;
      } else {
        continue; // Skip si no tiene nombre válido
      }

      // Leer atributos hasta otro "Pokemon" o final
      while (i < tokens.length && tokens[i].valor !== 'Pokemon') {
        const t = tokens[i];

        if (t.valor === 'tipo' && tokens[i + 2]?.tipo === 'PalabraReservada') {
          tipo = tokens[i + 2].valor;
          i += 3;
        } else if (t.valor === 'salud' && tokens[i + 2]?.tipo === 'Numero') {
          salud = parseFloat(tokens[i + 2].valor);
          i += 3;
        } else if (t.valor === 'ataque' && tokens[i + 2]?.tipo === 'Numero') {
          ataque = parseFloat(tokens[i + 2].valor);
          i += 3;
        } else if (t.valor === 'defensa' && tokens[i + 2]?.tipo === 'Numero') {
          defensa = parseFloat(tokens[i + 2].valor);
          i += 3;
        } else {
          i++; // Continuar si no se reconoce patrón
        }
      }

      // Validación final
      const camposValidos = nombre && tipo && salud >= 0 && ataque >= 0 && defensa >= 0;
      if (camposValidos) {
        const iv = ((salud + ataque + defensa) / 45) * 100;
        pokemones.push({ nombre, tipo, salud, ataque, defensa, iv });
      }
    }
  }

  return pokemones;
}
