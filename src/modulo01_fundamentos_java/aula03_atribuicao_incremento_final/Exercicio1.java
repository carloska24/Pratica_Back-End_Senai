package modulo01_fundamentos_java.aula03_atribuicao_incremento_final;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 03 - Atribuição, Incremento e Constantes
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Praticar os operadores de atribuição composta
 * (+=, -=, *= e /=) realizando alterações
 * sucessivas no valor de uma variável.
 */

public class Exercicio1 {
    public static void main(String[] args) {
        int estoque = 50;

        estoque += 20;
        System.out.println(estoque);

        estoque -= 10;
        System.out.println(estoque);

        estoque *= 2;
        System.out.println(estoque);

        estoque /= 2;
        System.out.println(estoque);

    }
}
