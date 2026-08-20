package modulo02_estruturas_decisao.aula01_if_else;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 01 - If / Else
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Verificar se uma pessoa possui idade suficiente
 * para entrar em um determinado local utilizando
 * a estrutura de decisão if / else.
 */

public class Exercicio1 {
    public static void main(String[] args) {
        int idade = 20;

        if (idade >= 18) {
            System.out.println("Pode entrar");
        } else {
            System.out.println("Entrada proibida");
        }
    }
}
