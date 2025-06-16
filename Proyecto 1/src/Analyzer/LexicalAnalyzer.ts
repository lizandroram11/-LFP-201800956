import { Token, Type } from "./Token";

class LexicalAnalyze{
    private row: number; //Filas
    private column: number; //columnas
    private auxChar: string; //analizador lexico
    private state: number; //tipo token de la clase numerada
    private tokenList: Token[]; //Para obtener el nombre del tipo de token
    private errorList: Token[];
    private RESERVERD_WORDS: string[];

    constructor(){
        this.row = 1;
        this.column = 1;
        this.auxChar = '';
        this.state = 0;
        this.tokenList = [];
        this.errorList = [];
        this.RESERVERD_WORDS = ['Carrera', 'Semestre', 'Curso', 'Nombre','Area', 'Prerrequisitos','Ingeniería en Sistemas','Matemática Básica 1','Social Humanistica 1'];
    }

    scanner(input: string){

        input += '#';
        let char: string;

        for(let i: number = 0; i< input.length; i++){

            char = input[i];

            switch (this.state){

                case 0:
                    switch(char){
                        case '{':
                            this.state = 1;
                            this.addCharacter(char);
                            break;
                        case '}':
                            this.state = 2;
                            this.addCharacter(char);
                            break;
                        case ':':
                            this.state = 3;
                            this.addCharacter(char);
                        break;
                        case ';':
                            this.state = 4;
                            this.addCharacter(char);
                            break;
                        case '"':
                            this.state = 5;
                            this.addCharacter(char);
                            break;
                        //Delimitadores
                        case ' ':
                            this.column++;
                            break;
                        case '\n':
                            break;
                        case '\r':
                            this.row++;
                            this.column = 1;
                            break;
                        case '\t':
                            this.column += 4;
                            break;
                        default:
                            if(/[a-z]/.test(char)){
                            //es una letra
                            this.state = 6;
                            this.addCharacter(char);
                            continue;
                            }
                            if(/\d/.test(char)){
                                //es un digito
                                this.state = 7;
                                this.addCharacter(char);
                                continue;
                            }

                            if(char == '#' && i == input.length - 1){
                                //Se termino el analisis
                                console.log("Analyze Finished");
                            }else{
                                //Error Lexico
                                this.addError(Type.UKNOW, char, this.row, this.column);
                                this.column++;
                            }
                                
                            break;

                    }
                    break;

                case 1: //Aceptacion
                    this.addToken(Type.LLAVE_ABRE, this.auxChar , this.row, this.column-this.auxChar.length);
                    this.clean();
                    i--;
                    break;

                case 2: //ACEPTACION
                    this.addToken(Type.LLAVE_CIERRA, this.auxChar , this.row, this.column-this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 3: //ACEPTACION
                    this.addToken(Type.PUNTO_COMA, this.auxChar , this.row, this.column-this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 4:
                    this.addToken(Type.DOS_PUNTOS, this.auxChar , this.row, this.column-this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 5:
                    this.addToken(Type.COMILLAS, this.auxChar , this.row, this.column-this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 6://Aceptacion letras
                    if(/[A-Za-z0-9]/.test(char)){
                        //Sigue siendo parte del identficador
                        this.addCharacter(char);
                        continue;
                    }

                    if(this.RESERVERD_WORDS.includes(this.auxChar)){
                        this.addToken(Type.RESERVERD_WORDS, this.auxChar, this.row, this.column-this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    //Error Lexico
                    this.addError(Type.UKNOW, this.auxChar, this.row, this.column-this.auxChar.length);
                    this.clean();
                    i--;

                    break;

                case 7: //Aceptacion Digitos
                    if(/\d/.test(char)){
                        this.addCharacter(char);
                        continue;
                    }

                    this.addToken(Type.NUMBER, this.auxChar, this.row, this.column);
                        this.clean();
                        i--;
                    break;
            }
        }

        return this.tokenList;
    }
    private addCharacter(char: string){
        this.auxChar += char;
        this.column++;
    }

    //Funcion de retorno para limpiar
    private clean(){
        this.state =0 ;
        this. auxChar = '';
    }

    private addToken(type: Type, lexeme: string,row: number, column: number){
        this.tokenList.push(new Token(type, lexeme, row, column));

    }

    private addError(type: Type, lexeme: string, row: number, column: number){
        this.errorList.push(new Token(type, lexeme, row, column));

    }

    getErrorList(){
        return this.errorList;
    }

}

export {LexicalAnalyze}