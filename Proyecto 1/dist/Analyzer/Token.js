"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Token = void 0;
// token.ts - Enumeración y clase Token para el analizador léxico
// Enumeración de todos los tipos de token posibles
var Type;
(function (Type) {
    Type[Type["RESERVERD_WORDS"] = 0] = "RESERVERD_WORDS";
    Type[Type["UKNOW"] = 1] = "UKNOW";
    //CARRERA = 1,
    //SEMESTRE,
    //CURSO,
    //AREA,
    //NOMBRE,
    //PREREQUISITOS,
    //CADENA,
    //NUMERO,
    Type[Type["LLAVE_ABRE"] = 2] = "LLAVE_ABRE";
    Type[Type["LLAVE_CIERRA"] = 3] = "LLAVE_CIERRA";
    Type[Type["CORCH_ABRE"] = 4] = "CORCH_ABRE";
    Type[Type["CORCH_CIERRA"] = 5] = "CORCH_CIERRA";
    Type[Type["DOS_PUNTOS"] = 6] = "DOS_PUNTOS";
    Type[Type["COMA"] = 7] = "COMA";
    Type[Type["COMILLAS"] = 8] = "COMILLAS";
    Type[Type["PUNTO_COMA"] = 9] = "PUNTO_COMA";
    Type[Type["NUMBER"] = 10] = "NUMBER";
})(Type || (exports.Type = Type = {}));
// Clase Token que contiene tipo, valor y posición
class Token {
    //private palabrasReservadas: string[];
    constructor(typeToken, lexeme, row, column) {
        this.typeToken = typeToken;
        this.typeTokenString = Type[typeToken];
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
        //this.palabrasReservadas = ["Carrera", "Semestre", "Curso", "Nombre","Area", "Prerequisitos"];
    }
}
exports.Token = Token;
