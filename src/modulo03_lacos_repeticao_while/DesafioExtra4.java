/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Desafio Extra 4
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while em conjunto com o if para
 * percorrer os números de 1 a 20 e identificar qual é
 * o maior número encontrado durante a repetição.
 */

package modulo03_lacos_repeticao_while;

public class DesafioExtra4 {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Variável que controla a repetição, iniciando em 1
        // ------------------------------------------------------------
        int contador = 1;

        // ------------------------------------------------------------
        // Variável que armazenará o maior número encontrado
        // ------------------------------------------------------------
        int maiorNumero = 0;

        // ------------------------------------------------------------
        // Enquanto o contador for menor ou igual a 20,
        // o laço continuará executando
        // ------------------------------------------------------------
        while (contador <= 20) {

            // --------------------------------------------------------
            // Verifica se o número atual é maior que o valor
            // armazenado na variável maiorNumero
            // --------------------------------------------------------
            if (contador > maiorNumero) {

                // ----------------------------------------------------
                // Atualiza o maior número encontrado
                // ----------------------------------------------------
                maiorNumero = contador;
            }

            // --------------------------------------------------------
            // Incrementa o contador para passar ao próximo número
            // --------------------------------------------------------
            contador++;
        }

        // ------------------------------------------------------------
        // Exibe o maior número encontrado
        // ------------------------------------------------------------
        System.out.println("Maior numero encontrado: " + maiorNumero);
    }
}