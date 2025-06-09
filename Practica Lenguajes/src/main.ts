import { analizarEntrada } from './lexer';
import { extraerPokemones } from './parser';
import { seleccionarTop6 } from './selector';

const entrada = `
Jugador: "Ash"
Pokemon: "pikachu" tipo: normal salud: 35 ataque: 55 defensa: 40
Pokemon: "bulbasaur" tipo: planta salud: 45 ataque: 49 defensa: 49
Pokemon: "errormon" salud: 99 ataque: 99
`;

const tokens = analizarEntrada(entrada);
console.table(tokens);

const pokemones = extraerPokemones(tokens);
console.table(pokemones);

const top6 = seleccionarTop6(pokemones);
console.log('TOP 6 Pokémon:');
console.table(top6);
