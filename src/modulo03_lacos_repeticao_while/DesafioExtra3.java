/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Desafio Extra 3
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while em conjunto com o if para
 * percorrer os números de 1 a 15, identificar quais são
 * ímpares, exibir esses números e calcular a soma total
 * dos números ímpares encontrados.
 */

package modulo03_lacos_repeticao_while;

public class DesafioExtra3 {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Variável que controla a repetição, iniciando em 1
        // ------------------------------------------------------------
        int contador = 1;

        // ------------------------------------------------------------
        // Variável que armazenará a soma dos números ímpares
        // ------------------------------------------------------------
        int somaImpares = 0;

        // ------------------------------------------------------------
        // Enquanto o contador for menor ou igual a 15,
        // o laço continuará executando
        // ------------------------------------------------------------
        while (contador <= 15) {

            // --------------------------------------------------------
            // Verifica se o número atual é ímpar
            // --------------------------------------------------------
            if (contador % 2 != 0) {

                // ----------------------------------------------------
                // Exibe o número ímpar encontrado
                // ----------------------------------------------------
                System.out.println(contador);

                // ----------------------------------------------------
                // Adiciona o número ímpar à soma acumulada
                // ----------------------------------------------------
                somaImpares = contador + somaImpares;
            }

            // --------------------------------------------------------
            // Incrementa o contador para passar ao próximo número
            // --------------------------------------------------------
            contador++;
        }

        // ------------------------------------------------------------
        // Exibe o resultado final da soma dos números ímpares
        // ------------------------------------------------------------
        System.out.println("Soma dos numeros Impares: " + somaImpares);
    }
}