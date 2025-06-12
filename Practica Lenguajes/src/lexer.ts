import { Token, TokenType } from './token';

const palabrasReservadas = [
  'Jugador', 'Pokemon', 'tipo',
  'agua', 'dragon', 'planta',
  'psiquico', 'fuego', 'normal'
];

export function analizarEntrada(input: string): Token[] {
  const tokens: Token[] = [];
  let fila = 1, columna = 1;
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Nueva línea
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
        if (input[j] === '\n') break;
        lexema += input[j];
        j++;
      }

      if (j < input.length && input[j] === '"') {
        lexema += '"';
        tokens.push({ tipo: 'Cadena', valor: lexema, fila, columna: colIni });
        columna += lexema.length;
        i = j + 1;
        continue;
      } else {
        tokens.push({ tipo: 'Desconocido', valor: lexema, fila, columna: colIni });
        i = j;
        continue;
      }
    }

    // Número (entero o decimal)
    if (/[0-9]/.test(char)) {
      let lexema = '';
      let colIni = columna;
      let hasDot = false;

      while (i < input.length && /[0-9.]/.test(input[i])) {
        if (input[i] === '.') {
          if (hasDot) break;
          hasDot = true;
        }
        lexema += input[i];
        i++;
        columna++;
      }

      tokens.push({ tipo: 'Numero', valor: lexema, fila, columna: colIni });
      continue;
    }

    // Palabra (identificadores o reservadas)
    if (/[a-zA-Z]/.test(char)) {
      let lexema = '';
      let colIni = columna;

      while (i < input.length && /[a-zA-Z]/.test(input[i])) {
        lexema += input[i];
        i++;
        columna++;
      }

      const tipo: TokenType = palabrasReservadas.includes(lexema)
        ? 'PalabraReservada'
        : 'Identificador';

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

    // Cualquier otro carácter no reconocido
    tokens.push({ tipo: 'Desconocido', valor: char, fila, columna });
    i++;
    columna++;
  }

  return tokens;
}
