
package Practica1;
import Practica1.Peleador;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;



public class lectorArchivo {
    private ArrayList<Peleador> peleadores=new ArrayList<>();
    Scanner scanner = new Scanner(System.in);
        
        // Pedir la ruta del archivo al usuario
         System.out.print("Ingrese la ruta del archivo CSV: ");
         String archivoSeleccionado = scanner.nextLine();

        String linea;
        //String separador = ",";

        //ArrayList<Persona> listaPersonas = new ArrayList<>();
        
        try{
                BufferedReader br=new BufferedReader(new FileReader(archivoSeleccionado));
                String linea;
                //buffer para leer linea con linea
                br.readLine(); //Apuntadore que dice en que linea se encuentra actualmente
                //Llamada a la funcion de leer una linea de texto en el documento
                
                //Lee la linea del archivo y se le asigna a la variable linea
                while((linea = br.readLine()) != null){
                    
                    String[] valores=linea.split("|");
                    
                    //4 es la cantidad de datos que se tendran
                    if(valores.length==4){
                        
                        String nombre = valores[0];
                        int salud = valores[1].toLowerCase();
                        int ataque = valores[2].toLowerCase();
                        int defensa = valores[3].toLowerCase();
                        
                       Peleador peleador = new Peleador(nombre,salud,ataque,defensa);
                        peleadores.add(peleador);
                        
                       
                        
                    }
                    
                    
                }
                //cargarDatos();
                
            }catch(IOException e){
                e.printStackTrace();
                System.out.println("Error al leer el archivo: " + e.getMessage());
            } finally {
            scanner.close();
        }
            
}
        
        
        
        /*try (BufferedReader br = new BufferedReader(new FileReader(archivoCSV))) {
            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split(separador);
                if (datos.length == 4) { // Verificar que tenga los campos necesarios
                    String nombre = datos[0].trim();
                    int salud = Integer.parseInt(datos[1].trim());
                    int ataque = Integer.parseInt(datos[1].trim());
                    int defensa = Integer.parseInt(datos[1].trim());

                    Peleador peleadores = new Peleador(nombre,salud , ataque, defensa);
                    peleador.add(peleadores);
                }
            }
        } catch (IOException e) {
            System.out.println("Error al leer el archivo: " + e.getMessage());
        } finally {
            scanner.close();
        }

        // Mostrar el contenido del ArrayList
        System.out.println("\nLista de Personas cargadas:");
        for (Peleador peleadores : peleador) {
            System.out.println(peleador);
        }/*
    }
    
