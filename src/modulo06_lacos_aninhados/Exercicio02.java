package modulo06_lacos_aninhados;

// Exercício 02
// Objetivo: Utilizar um FOR dentro de outro FOR para exibir
// linhas e colunas.
//
// Conceitos praticados:
// - Laço FOR
// - Laço FOR aninhado (FOR dentro de FOR)
// - Variáveis de controle
// - Organização da lógica

public class Exercicio02 {

    public static void main(String[] args) {

        // Percorre as linhas de 1 até 3
        for (int linha = 1; linha <= 3; linha++) {

            System.out.println("Linha " + linha);

            // Para cada linha, percorre as colunas de 1 até 3
            for (int coluna = 1; coluna <= 3; coluna++) {

                System.out.println("coluna " + coluna);
            }

            // Apenas para separar visualmente uma linha da outra
            System.out.println();
        }
    }
}
