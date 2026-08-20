package modulo05_for_avancado;

// Desafio
// Objetivo: Percorrer os números de 1 até 100 utilizando o laço FOR,
// exibir apenas os múltiplos de 7,
// contar quantos múltiplos foram encontrados
// e calcular a soma desses números.
//
// Conceitos praticados:
// - Laço FOR
// - Estrutura IF
// - Operador módulo (%) para identificar múltiplos
// - Contador
// - Acumulador

public class Desafio {

    public static void main(String[] args) {

        // Variável responsável por contar quantos múltiplos de 7 foram encontrados
        int multiplos = 0;

        // Variável responsável por armazenar a soma dos múltiplos encontrados
        int soma = 0;

        // Título
        System.out.println("Múltiplos de 7 entre 1 e 100:");

        // Percorre os números de 1 até 100
        for (int contador = 1; contador <= 100; contador++) {

            // Verifica se o número atual é múltiplo de 7
            if (contador % 7 == 0) {

                // Conta mais um múltiplo encontrado
                multiplos++;

                // Soma o número encontrado ao acumulador
                soma += contador;

                // Exibe o número encontrado
                System.out.println(contador);
            }
        }

        // Exibe os resultados finais
        System.out.println("---------------------------");
        System.out.println("Quantidade de múltiplos de 7: " + multiplos);
        System.out.println("Soma dos múltiplos de 7: " + soma);
    }
}
