package modulo02_estruturas_decisao.aula03_operadores_logicos;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 03 - Operadores Lógicos
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Verificar se uma pessoa pode entrar em um evento.
 * A entrada é permitida para maiores de idade
 * ou menores acompanhados.
 */

public class Exercicio02 {
    public static void main(String[] args) {
        // Idade da pessoa
        int idade = 16;
        // Indica se está acompanhada por um responsável
        boolean acompanhado = true;

        if (idade >= 18 || acompanhado) {
            System.out.println("Pode entrar");
        } else {
            System.out.println("Não pode entrar");
        }
    }
}
