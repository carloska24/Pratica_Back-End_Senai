package modulo04_lacos_repeticao_for;

// Exercício 01
// Objetivo: Utilizar o laço FOR para exibir os números de 1 até 10.
//
// Estrutura do FOR:
// 1. Inicialização -> Define onde a repetição começa.
// 2. Condição -> Enquanto a condição for verdadeira, o laço continua.
// 3. Incremento -> Atualiza o contador a cada repetição.

public class Exercicio01 {

    public static void main(String[] args) {

        // Exibe um título no console
        System.out.println("Abaixo os números de 1 a 10:");

        // Inicia em 1, repete até 10 e incrementa 1 a cada volta
        for (int contador = 1; contador <= 10; contador++) {

            // Exibe o valor atual do contador
            System.out.println(contador);
        }
    }
}
