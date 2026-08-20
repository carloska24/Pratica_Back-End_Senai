package modulo02_estruturas_decisao.aula01_if_else;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 01 - If / Else
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Verificar se um aluno foi aprovado ou reprovado
 * de acordo com a nota obtida, utilizando
 * a estrutura if / else.
 */

public class Exercicio2 {
    public static void main(String[] args) {
        double nota = 6.5;

        if (nota >= 7) {
            System.out.println("Aprovado");
        } else {
            System.out.println("Reprovado");
        }
    }
}
