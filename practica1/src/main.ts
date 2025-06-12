import { analizarEntrada } from './lexer';
import { extraerPokemones } from './parser';
import { seleccionarTop6 } from './selector';

const entrada = `
Jugador: "PokeEvee"
Pokemon: "venusaur" tipo: planta salud: 80 ataque: 82 defensa: 83
Pokemon: "charizard" tipo: fuego salud: 78 ataque: 84 defensa: 78
Pokemon: "blastoise" tipo: agua salud: 79 ataque: 83 defensa: 100
Pokemon: "alakazam" tipo: psiquico salud: 55 ataque: 50 defensa: 45
Pokemon: "dragonite" tipo: dragon salud: 91 ataque: 134 defensa: 95
Pokemon: "snorlax" tipo: normal salud: 160 ataque: 110 defensa: 65
Pokemon: "bulbasaur" tipo: planta salud: 45 ataque: 49 defensa: 49
`;

const tokens = analizarEntrada(entrada);
console.table(tokens);

const pokemones = extraerPokemones(tokens);
console.table(pokemones);

const top6 = seleccionarTop6(pokemones);
console.log('TOP 6 Pokémon:');
console.table(top6);

