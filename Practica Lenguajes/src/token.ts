export type TokenType = 
  | 'PalabraReservada'
  | 'Identificador'
  | 'Cadena'
  | 'Numero'
  | 'DosPuntos'
  | 'Desconocido';

export interface Token {
  tipo: TokenType;
  valor: string;
  fila: number;
  columna: number;
}
