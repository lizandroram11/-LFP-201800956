export type TokenType = 
  | 'PalabraReservada'
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
