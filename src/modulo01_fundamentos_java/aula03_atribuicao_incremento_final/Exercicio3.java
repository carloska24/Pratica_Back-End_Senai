package modulo01_fundamentos_java.aula03_atribuicao_incremento_final;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 03 - Atribuição, Incremento e Constantes
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Compreender o uso da palavra-chave
 * final para criar constantes que
 * não podem ser alteradas durante
 * a execução do programa.
 */

public class Exercicio3 {
    public static void main(String[] args) {
        final double PI = 3.14;
        final int IDADE_MINIMA = 18;
        final double DESCONTO = 0.10;

        //PI= 5;

        System.out.println(PI);
        System.out.println(IDADE_MINIMA);
        System.out.println(DESCONTO);

    }
}
