package modulo01_fundamentos_java.aula03_atribuicao_incremento_final;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 03 - Atribuição, Incremento e Constantes
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Praticar os operadores de incremento (++)
 * e decremento (--) para controlar
 * o valor de uma variável.
 */

public class Exercicio2 {
    public static void main(String[] args) {
        int contador = 0;

        contador++;
        contador++;
        contador++;
        contador--;
        contador++;

        System.out.println(contador);
    }
}
