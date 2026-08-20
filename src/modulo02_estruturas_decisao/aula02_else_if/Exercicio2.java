package modulo02_estruturas_decisao.aula02_else_if;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 02 - Else If
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Classificar a situação de um aluno com base na média
 * final, utilizando múltiplas condições com else if.
 */

public class Exercicio2 {
    public static void main(String[] args) {
        double media = 7.8;

        if (media >= 9) {
            System.out.println("Excelente");
        } else if (media >= 7) {
            System.out.println("Aprovado");
        } else if (media >= 5) {
            System.out.println("Recuperação");
        } else if (media < 5) {
            System.out.println("Reprovado");
        }
    }
}
