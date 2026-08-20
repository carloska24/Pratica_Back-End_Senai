package modulo02_estruturas_decisao.aula02_else_if;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 02 - Else If
 * Desafio 02
 * ============================================================
 *
 * Objetivo:
 * Desenvolver um sistema que calcule a comissão de um vendedor
 * de acordo com o valor total das vendas realizadas no mês.
 *
 * O programa deve identificar automaticamente o percentual
 * de comissão conforme as regras da empresa, calcular o valor
 * da comissão e apresentar o salário final do vendedor.
 */

public class Desafio2 {
    public static void main(String[] args) {

// Dados do vendedor
// ------------------------------------------------------------
        double valorVendas = 18500;

// ------------------------------------------------------------
// Variáveis utilizadas para armazenar os cálculos.
// O percentual começa em 0 e será definido pela estrutura
// de decisão conforme o valor das vendas.
// ------------------------------------------------------------
        double percentualComissao = 0;
        double valorComissao = 0;
        double salarioBase = 2500;
        double salarioFinal = 0;

// ------------------------------------------------------------
// Define o percentual de comissão de acordo com o valor
// total vendido pelo vendedor.
// ------------------------------------------------------------
        if (valorVendas >= 20000) {
            percentualComissao = 0.12;

        } else if (valorVendas >= 15000) {
            percentualComissao = 0.08;

        } else if (valorVendas >= 10000) {
            percentualComissao = 0.05;

        } else {
            percentualComissao = 0;
        }

// ------------------------------------------------------------
// Calcula o valor da comissão e o salário final.
// ------------------------------------------------------------
        valorComissao = valorVendas * percentualComissao;
        salarioFinal = salarioBase + valorComissao;

// ------------------------------------------------------------
// Exibe o relatório final com todas as informações.
// ------------------------------------------------------------
        System.out.println("RELATÓRIO DO VENDEDOR");
        System.out.println("===============================");
        System.out.println("Valor vendido: " + valorVendas);
        System.out.println("Percentual de Comissão: " + percentualComissao);
        System.out.println("Valor da Comissão: " + valorComissao);
        System.out.println("Salário Base: " + salarioBase);
        System.out.println("Salário Final: " + salarioFinal);
        System.out.println("===============================");
    }
}
