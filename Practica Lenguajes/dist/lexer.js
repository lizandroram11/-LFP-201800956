"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analizarEntrada = analizarEntrada;
const palabrasReservadas = [
    'Jugador', 'Pokemon', 'tipo',
    'agua', 'dragon', 'planta',
    'psiquico', 'fuego', 'normal'
];
function analizarEntrada(input) {
    const tokens = [];
    let fila = 1, columna = 1;
    let i = 0;
    while (i < input.length) {
        const char = input[i];
        if (char === '\n') {
            fila++;
            columna = 1;
            i++;
            continue;
        }
        // Espacios y tabulaciones
        if (char === ' ' || char === '\t') {
            columna++;
            i++;
            continue;
        }
        // Cadena de texto
        if (char === '"') {
            let lexema = '"';
            let j = i + 1;
            let colIni = columna;
            while (j < input.length && input[j] !== '"') {
                lexema += input[j];
                j++;
            }
            if (j < input.length && input[j] === '"') {
                lexema += '"';
                tokens.push({ tipo: 'Cadena', valor: lexema, fila, columna: colIni });
                columna += lexema.length;
                i = j + 1;
                continue;
            }
            else {
                // Error: cadena sin cerrar
                tokens.push({ tipo: 'Desconocido', valor: lexema, fila, columna: colIni });
                i = j;
                continue;
            }
        }
        // Número
        if (/[0-9]/.test(char)) {
            let lexema = '';
            let colIni = columna;
            while (i < input.length && /[0-9]/.test(input[i])) {
                lexema += input[i];
                i++;
                columna++;
            }
            tokens.push({ tipo: 'Numero', valor: lexema, fila, columna: colIni });
            continue;
        }
        // Palabra
        if (/[a-zA-Z]/.test(char)) {
            let lexema = '';
            let colIni = columna;
            while (i < input.length && /[a-zA-Z]/.test(input[i])) {
                lexema += input[i];
                i++;
                columna++;
            }
            const tipo = palabrasReservadas.includes(lexema)
                ? 'PalabraReservada'
                : 'Desconocido';
            tokens.push({ tipo, valor: lexema, fila, columna: colIni });
            continue;
        }
        // Dos puntos
        if (char === ':') {
            tokens.push({ tipo: 'DosPuntos', valor: ':', fila, columna });
            i++;
            columna++;
            continue;
        }
        // Carácter desconocido
        tokens.push({ tipo: 'Desconocido', valor: char, fila, columna });
        i++;
        columna++;
    }
    return tokens;
}
