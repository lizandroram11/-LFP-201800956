// token.ts - Enumeración y clase Token para el analizador léxico
// Enumeración de todos los tipos de token posibles
enum Type {
  RESERVERD_WORDS,
  UKNOW,
  //CARRERA = 1,
  //SEMESTRE,
  //CURSO,
  //AREA,
  //NOMBRE,
  //PREREQUISITOS,
  //CADENA,
  //NUMERO,
  LLAVE_ABRE,
  LLAVE_CIERRA,
  CORCH_ABRE,
  CORCH_CIERRA,
  DOS_PUNTOS,
  COMA,
  COMILLAS,
  PUNTO_COMA,
  NUMBER
}

// Clase Token que contiene tipo, valor y posición
class Token {
  
    private row: number; //Filas
    private column: number; //columnas
    private lexeme: String; //analizador lexico
    private typeToken: Type; //tipo token de la clase numerada
    private typeTokenString: string; //Para obtener el nombre del tipo de token
    //private palabrasReservadas: string[];



    constructor( typeToken: Type,lexeme: string,row: number, column: number) {
        this.typeToken = typeToken;
        this.typeTokenString = Type[typeToken];
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
        //this.palabrasReservadas = ["Carrera", "Semestre", "Curso", "Nombre","Area", "Prerequisitos"];

    }
}
export {Token, Type}
