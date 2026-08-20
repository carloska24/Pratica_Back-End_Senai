/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Exercício Extra 2
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while em conjunto com o if para
 * percorrer os números de -5 a 5, identificar quais são
 * positivos e contar quantos números positivos existem
 * nesse intervalo.
 */

package modulo03_lacos_repeticao_while;

public class ExercicioExtra2 {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Variável que controla a repetição, iniciando em -5
        // ------------------------------------------------------------
        int contador = -5;

        // ------------------------------------------------------------
        // Variável que armazenará a quantidade de números positivos
        // ------------------------------------------------------------
        int quantidadePositivos = 0;

        // ------------------------------------------------------------
        // Enquanto o contador for menor ou igual a 5,
        // o laço continuará executando
        // ------------------------------------------------------------
        while (contador <= 5) {

            // --------------------------------------------------------
            // Verifica se o número atual é maior que zero
            // --------------------------------------------------------
            if (contador > 0) {

                // ----------------------------------------------------
                // Incrementa a quantidade de números positivos
                // ----------------------------------------------------
                quantidadePositivos++;
            }

            // --------------------------------------------------------
            // Incrementa o contador para passar ao próximo número
            // --------------------------------------------------------
            contador++;
        }

        // ------------------------------------------------------------
        // Exibe a quantidade total de números positivos encontrados
        // ------------------------------------------------------------
        System.out.println("Quantidade de numeros positivos: " + quantidadePositivos);
    }
}
