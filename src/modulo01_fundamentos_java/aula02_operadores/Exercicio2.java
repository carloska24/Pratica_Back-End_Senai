package modulo01_fundamentos_java.aula02_operadores;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 02 - Operadores
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Calcular o salário final de um funcionário somando
 * o salário base ao valor do bônus utilizando
 * o operador de adição.
 */

public class Exercicio2 {
    public static void main(String[] args) {
        double salario = 4600;
        double bonus = 750;
        double salarioFinal = salario + bonus;

        System.out.println(salarioFinal);
    }
}
