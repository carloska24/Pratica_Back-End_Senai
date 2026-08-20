package modulo02_estruturas_decisao.aula01_if_else;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 01 - If / Else
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Simular a liberação de uma placa para montagem,
 * verificando se ela foi aprovada na inspeção e
 * possui a quantidade mínima de componentes.
 */

public class Desafio {
    public static void main(String[] args) {
        boolean placaAprovada = true;
        int quantidadeComponentes = 145;

        if (placaAprovada && quantidadeComponentes >= 100) {
            System.out.println("Liberar para montagem");
        } else {
            System.out.println("Enviar para inspeção");
        }
    }
}
