"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const selector_1 = require("./selector");
const entrada = `
Jugador: "Ash"
Pokemon: "pikachu" tipo: normal salud: 35 ataque: 55 defensa: 40
Pokemon: "bulbasaur" tipo: planta salud: 45 ataque: 49 defensa: 49
Pokemon: "errormon" salud: 99 ataque: 99
`;
const tokens = (0, lexer_1.analizarEntrada)(entrada);
console.table(tokens);
const pokemones = (0, parser_1.extraerPokemones)(tokens);
console.table(pokemones);
const top6 = (0, selector_1.seleccionarTop6)(pokemones);
console.log('TOP 6 Pokémon:');
console.table(top6);
