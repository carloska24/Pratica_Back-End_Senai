package modulo01_fundamentos_java.aula02_operadores;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 02 - Operadores
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Calcular a média de três notas utilizando
 * operadores aritméticos.
 */

public class Exercicio3 {
    public static void main(String[] args) {
        double nota1 = 8.5;
        double nota2 = 7.0;
        double nota3 = 9.5;
        double media = (nota1 + nota2 + nota3) / 3;

        System.out.println("A média é: " + media);
    }
}
