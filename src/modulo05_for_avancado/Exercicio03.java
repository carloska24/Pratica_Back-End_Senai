package modulo05_for_avancado;

// Exercício 03
// Objetivo: Percorrer os números de 1 até 30,
// exibir apenas os múltiplos de 4,
// contar quantos foram encontrados
// e calcular a soma desses números.
//
// Conceitos praticados:
// - Laço FOR
// - Estrutura IF
// - Contador
// - Acumulador

public class Exercicio03 {

    public static void main(String[] args) {

        // Conta quantos múltiplos de 4 foram encontrados
        int multiplos = 0;

        // Armazena a soma dos múltiplos encontrados
        int soma = 0;

        System.out.println("Múltiplos de 4 entre 1 e 30:");

        // Percorre os números de 1 até 30
        for (int contador = 1; contador <= 30; contador++) {

            // Verifica se o número é múltiplo de 4
            if (contador % 4 == 0) {

                // Conta o múltiplo encontrado
                multiplos++;

                // Soma o número encontrado
                soma += contador;

                // Exibe o número
                System.out.println(contador);
            }
        }

        System.out.println("---------------------------");
        System.out.println("Quantidade de múltiplos: " + multiplos);
        System.out.println("Soma dos múltiplos: " + soma);
    }
}