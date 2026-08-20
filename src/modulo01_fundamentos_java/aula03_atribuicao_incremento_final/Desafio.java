package modulo01_fundamentos_java.aula03_atribuicao_incremento_final;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 03 - Atribuição, Incremento e Constantes
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Simular o controle de produção de uma fábrica,
 * utilizando operadores de atribuição composta
 * para atualizar a quantidade de placas produzidas
 * e calcular quanto falta para atingir a meta.
 */

public class Desafio {
    public static void main(String[] args) {
        int placasProduzidas = 100;
        final int META = 150;

        placasProduzidas += 25;
        placasProduzidas += 15;
        placasProduzidas -= 5;

        System.out.println(placasProduzidas);
        System.out.println(META);
        System.out.println(META - placasProduzidas);
    }
}
