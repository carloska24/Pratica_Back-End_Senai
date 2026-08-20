package modulo03_lacos_repeticao_while;

/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Desafio Extra
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while para somar todos os números
 * pares de 1 a 20 e exibir o resultado final da soma.
 */

public class DesafioExtra {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Variáveis de controle e acumulação
        // ------------------------------------------------------------
        int contador = 1;
        int soma = 0;

        System.out.println("Números pares encontrados:");

        // ------------------------------------------------------------
        // Percorre os números de 1 a 20
        // ------------------------------------------------------------
        while (contador <= 20) {

            // Verifica se o número atual é par
            if (contador % 2 == 0) {

                // Exibe o número par encontrado
                System.out.println(contador);

                // Adiciona o número par à soma
                soma = soma + contador;
            }

            // Incrementa o contador para a próxima repetição
            contador++;
        }

        // ------------------------------------------------------------
        // Exibe o resultado final da soma
        // ------------------------------------------------------------
        System.out.println("Soma total dos pares: " + soma);
    }
}