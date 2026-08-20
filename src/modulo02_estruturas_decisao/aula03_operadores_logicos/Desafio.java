package modulo02_estruturas_decisao.aula03_operadores_logicos;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 03 - Operadores Lógicos
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Simular a aprovação de um financiamento.
 *
 * O financiamento será aprovado somente quando
 * TODAS as condições forem verdadeiras.
 */

public class Desafio {
    public static void main(String[] args) {
        // Renda mensal do cliente
        double rendaMensal = 6500;
        // Score de crédito
        int scoreCredito = 780;
        // Indica se o cliente possui nome limpo
        boolean nomeLimpo = true;
        // Verifica se todas as regras foram atendidas
        if (rendaMensal >= 5000 && scoreCredito >= 700 && nomeLimpo) {
            System.out.println("Financiamento aprovado!");
        } else {
            System.out.println("Financiamento negado");
        }
    }
}
