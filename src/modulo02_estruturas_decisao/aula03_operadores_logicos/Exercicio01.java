package modulo02_estruturas_decisao.aula03_operadores_logicos;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 03 - Operadores Lógicos
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Verificar se uma pessoa pode dirigir.
 * Para dirigir é necessário possuir carteira de habilitação
 * e ter idade mínima permitida.
 */

public class Exercicio01 {
    public static void main(String[] args) {
        // Idade da pessoa
        int idade = 18;
        // Informa se possui carteira de habilitação
        boolean possuiCarteira = true;

        if (idade <= 18 && possuiCarteira) {
            System.out.println("Pode dirigir");
        } else {
            System.out.println("Não pode dirigir");
        }
    }
}
