package modulo02_estruturas_decisao.aula02_else_if;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 02 - Else If
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Criar um sistema simples de desconto para uma loja virtual,
 * definindo o percentual de desconto de acordo com o valor
 * da compra e calculando o valor final.
 */

public class Desafio {

    public static void main(String[] args) {

        double valorCompra = 850;

        double percentualDesconto = 0;
        double valorDesconto;
        double valorFinal;

        if (valorCompra >= 1000) {
            percentualDesconto = 0.20;
        } else if (valorCompra >= 500) {
            percentualDesconto = 0.10;
        } else if (valorCompra >= 200) {
            percentualDesconto = 0.05;
        } else {
            percentualDesconto = 0;
        }

        valorDesconto = valorCompra * percentualDesconto;
        valorFinal = valorCompra - valorDesconto;

        System.out.println("Valor da compra: R$ " + valorCompra);
        System.out.println("Percentual de desconto: " + (percentualDesconto * 100) + "%");
        System.out.println("Valor do desconto: R$ " + valorDesconto);
        System.out.println("Valor final: R$ " + valorFinal);

    }
}
