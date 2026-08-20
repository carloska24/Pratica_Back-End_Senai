package modulo06_lacos_aninhados;

// Exercício 03
// Objetivo:
// Utilizar FOR dentro de FOR para exibir:
//
// Linha 1
// *
// **
// ***
//
// Linha 2
// *
// **
// ***
//
// Linha 3
// *
// **
// ***
//
// Conceitos praticados:
// - FOR aninhado
// - print()
// - println()
// - Controle de linhas e colunas

public class Exercicio03 {

    public static void main(String[] args) {

        // Controla as linhas (Linha 1, Linha 2 e Linha 3)
        for (int linha = 1; linha <= 3; linha++) {

            // Exibe o título da linha
            System.out.println("Linha " + linha);

            // Controla a quantidade de estrelas
            for (int coluna = 1; coluna <= 3; coluna++) {

                // Imprime a quantidade de estrelas correspondente
                for (int estrela = 1; estrela <= coluna; estrela++) {

                    System.out.print("*");

                }

                // Pula para a próxima linha após imprimir as estrelas
                System.out.println();

            }

            // Linha em branco para separar os blocos
            System.out.println();

        }

    }

}