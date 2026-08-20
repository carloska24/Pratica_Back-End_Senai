package modulo02_estruturas_decisao.aula01_if_else;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 01 - If / Else
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Verificar se a quantidade em estoque é suficiente
 * para atender à demanda, utilizando
 * a estrutura de decisão if / else.
 */

public class Exercicio3 {
    public static void main(String[] args) {
        int estoque = 12;

        if (estoque >= 10) {
            System.out.println("Estoque suficiente");
        } else {
            System.out.println("Comprar mais peças");
        }
    }
}
