package modulo02_estruturas_decisao.aula03_operadores_logicos;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 03 - Operadores Lógicos
 * Desafio Extra
 * ============================================================
 *
 * Objetivo:
 * Desenvolver uma versão mais inteligente do sistema de
 * aprovação de financiamento utilizando operadores lógicos.
 *
 * Regras:
 *
 * O financiamento será aprovado quando:
 *
 * Opção 1:
 * - A renda mensal for maior ou igual a R$ 5.000,00
 *   E
 * - O score de crédito for maior ou igual a 700.
 *
 * OU
 *
 * Opção 2:
 * - A renda mensal for maior ou igual a R$ 10.000,00,
 *   independentemente do score de crédito.
 *
 * Caso nenhuma das condições seja atendida,
 * o financiamento deverá ser negado.
 */

public class DesafioExtra {
    public static void main(String[] args) {
        // Dados do cliente
        double rendaMensal = 10000;
        int scoreCredito = 600;
        // Verifica se o cliente atende
        // pelo menos uma das regras de aprovação
        if ((rendaMensal >= 5000 && scoreCredito >= 700) || rendaMensal >= 10000) {
            System.out.println("Financiamento aprovado!");
        } else {
            System.out.println("Financiamento negado");
        }
    }
}

