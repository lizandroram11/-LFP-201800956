
package Practica1;

import java.util.Scanner;

public class LFP_Practica1 {
    
    public Scanner entrada = new Scanner(System.in);
    public static void main(String[] args) {
        System.out.println("Hola mundo");
        
        
    }
    
    public void menu(){
        int opcion;
        do{
                    
        System.out.println(" * ======================================================== * ");
        System.out.println("| |========================================================| |");
        System.out.println(" * ELIJA UNA OPERACION ARITMETICA A REALIZAR:               * ");
        System.out.println("| |1. CARGAR ARCHIVO.                                      | |");
        System.out.println(" * 2. JUGAR.                                                * ");
        System.out.println("| |3. GENERAR REPORTE DE MAYOR ATAQUE.                     | |");
        System.out.println(" * 4. GENERAR REPORTE DE MAYOR DERENSA.                     * ");
        System.out.println("| |5. MOSTRAR INFORMACION DEL DESARROLLADOR.               | |");
        System.out.println(" * 6. SALIR.                                                * ");
        System.out.println("| |========================================================| |");
        System.out.println(" * ======================================================== *");
        
        
        opcion=entrada.nextInt();
        
        
         switch (opcion){
             
             case 1: //CARGAR ARCHIVO
                 lectorArchivo a =new lectorArchivo();
                
                break;
            
            case 2: //JUGAR
                
                break;
                
                
            case 3: //REPORTE MAYOR ATAQUE
                
                break;
                
            case 4: //REPORTE MAYOR DEFENSA
                
                break;
                
                
            case 5: //INFORMACION DEL DESARROLLADOR
                
                mostrarDatos();
                
                break;
            default:
             
         }
     
                }while(opcion != 6);
        System.out.println("Hola mundo");
        
    }
    
    
    public void mostrarDatos(){
        
        System.out.println("--------Datos del desarrollador--------");
        System.out.println("Nombre: HUGO LIZANDRO RAMIREZ SIQUINAJAY");
        System.out.println("Registro Academico: 201800956");
        
    }
}

