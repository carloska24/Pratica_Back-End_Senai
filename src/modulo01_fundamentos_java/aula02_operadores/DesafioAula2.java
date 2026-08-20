package modulo01_fundamentos_java.aula02_operadores;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 02 - Operadores
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Calcular o valor total da produção de placas,
 * aplicar um desconto de 10% sobre o valor total
 * e dividir o valor final em cinco parcelas.
 */

public class DesafioAula2 {
    public static void main(String[] args) {
        double valorPlaca = 18.75;
        int placasProduzidas = 325;
        double valorTotalProducao = valorPlaca * placasProduzidas;
        double desconto = valorTotalProducao * 0.10;
        double valorComDesconto = valorTotalProducao - desconto;
        double valorParcela = valorComDesconto / 5;

        System.out.println("Valor total de Produção: " + valorTotalProducao);
        System.out.println("Valor total com 10% de desconto: " + valorComDesconto);
        System.out.println("Valor dividido em 5 parcelas: " + valorParcela);
    }
}
