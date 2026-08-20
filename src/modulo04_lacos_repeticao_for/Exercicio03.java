package modulo04_lacos_repeticao_for;

// Exercício 03
// Objetivo: Utilizar o laço FOR para realizar uma contagem decrescente de 10 até 1.
//
// Estrutura do FOR:
// 1. Inicialização -> O contador começa em 10.
// 2. Condição -> O laço continua enquanto o contador for maior ou igual a 1.
// 3. Decremento -> O contador é reduzido em 1 a cada repetição.

public class Exercicio03 {

    public static void main(String[] args) {

        // Exibe um título no console
        System.out.println("A contagem de 10 até 1 abaixo:");

        // Percorre os números de forma decrescente
        for (int contador = 10; contador >= 1; contador--) {

            // Exibe o valor atual do contador
            System.out.println(contador);
        }
    }
}