package modulo02_estruturas_decisao.aula02_else_if;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 02 - Else If
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Classificar uma pessoa por faixa etária utilizando
 * estruturas condicionais com if, else if e else.
 */

public class Exercicio3 {
    public static void main(String[] args) {
        int idade = 67;

        if (idade <= 12) {
            System.out.println("Criança");
        } else if (idade <= 18) {
            System.out.println("Adolescente");
        } else if (idade <= 59) {
            System.out.println("Adulto");
        } else {
            System.out.println("Idoso");
        }
    }
}
