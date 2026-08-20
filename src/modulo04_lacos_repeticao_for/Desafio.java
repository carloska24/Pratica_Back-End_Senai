package modulo04_lacos_repeticao_for;

// Desafio
// Objetivo: Utilizar o laço FOR juntamente com a estrutura IF
// para exibir apenas os números pares entre 1 e 20.
//
// Conceitos praticados:
// - Laço de repetição FOR
// - Estrutura de decisão IF
// - Operador módulo (%) para identificar números pares

public class Desafio {

    public static void main(String[] args) {

        // Exibe um título no console
        System.out.println("Números pares de 1 a 20:");

        // Percorre os números de 1 até 20
        for (int contador = 1; contador <= 20; contador++) {

            // Verifica se o número atual é par
            if (contador % 2 == 0) {

                // Exibe o número par encontrado
                System.out.println(contador);
            }
        }
    }
}
