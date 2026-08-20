package modulo02_estruturas_decisao.aula02_else_if;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 02 - Else If
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Classificar a produtividade de acordo com a quantidade
 * produzida, utilizando if, else if e else.
 */

public class Exercicio1 {
    public static void main(String[] args) {
        int producao = 85;

        if (producao >= 100) {
            System.out.println("Excelente");
        } else if (producao >= 80) {
            System.out.println("Boa");
        } else if (producao >= 50) {
            System.out.println("Regular");
        } else if (producao < 50) {
            System.out.println("Baixa");
        }
    }
}
