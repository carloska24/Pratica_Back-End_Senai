/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Desafio - Tabuada
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while para exibir a tabuada
 * do número 7.
 */

package modulo03_lacos_repeticao_while;

public class Desafio {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Número da tabuada e contador inicial
        // ------------------------------------------------------------
        int numero = 7;
        int contador = 1;

        // ------------------------------------------------------------
        // Exibe a tabuada enquanto o contador for menor ou igual a 10
        // ------------------------------------------------------------
        while (contador <= 10) {

            int resultado = numero * contador;

            System.out.println(numero + " x " + contador + " = " + resultado);

            contador++;
        }
    }
}
