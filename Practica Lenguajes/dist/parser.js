"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extraerPokemones = extraerPokemones;
function extraerPokemones(tokens) {
    var _a, _b, _c, _d, _e;
    const pokemones = [];
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
            if (((_a = tokens[i + 1]) === null || _a === void 0 ? void 0 : _a.tipo) === 'Cadena') {
                nombre = tokens[i + 1].valor.replace(/"/g, '');
                i += 2;
            }
            else {
                continue; // Saltar este bloque si está mal
            }
            // Recolectar atributos hasta encontrar otro "Pokemon" o final
            while (i < tokens.length && tokens[i].valor !== 'Pokemon') {
                const t = tokens[i];
                if (t.valor === 'tipo' && ((_b = tokens[i + 2]) === null || _b === void 0 ? void 0 : _b.tipo) === 'PalabraReservada') {
                    tipo = tokens[i + 2].valor;
                    i += 3;
                }
                else if (t.valor === 'salud' && ((_c = tokens[i + 2]) === null || _c === void 0 ? void 0 : _c.tipo) === 'Numero') {
                    salud = parseInt(tokens[i + 2].valor);
                    i += 3;
                }
                else if (t.valor === 'ataque' && ((_d = tokens[i + 2]) === null || _d === void 0 ? void 0 : _d.tipo) === 'Numero') {
                    ataque = parseInt(tokens[i + 2].valor);
                    i += 3;
                }
                else if (t.valor === 'defensa' && ((_e = tokens[i + 2]) === null || _e === void 0 ? void 0 : _e.tipo) === 'Numero') {
                    defensa = parseInt(tokens[i + 2].valor);
                    i += 3;
                }
                else {
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
