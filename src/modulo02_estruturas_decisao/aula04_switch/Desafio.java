package modulo02_estruturas_decisao.aula04_switch;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 04 - Switch
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Desenvolver uma calculadora simples utilizando a estrutura
 * switch para realizar operações matemáticas básicas.
 */

public class Desafio {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Números e operação escolhida
        // ------------------------------------------------------------
        double numero1 = 20;
        double numero2 = 10;
        char operacao = '+';

        double resultado = 0;

        // ------------------------------------------------------------
        // Realiza a operação matemática correspondente
        // ------------------------------------------------------------
        switch (operacao) {

            case '+':
                resultado = numero1 + numero2;
                break;

            case '-':
                resultado = numero1 - numero2;
                break;

            case '*':
                resultado = numero1 * numero2;
                break;

            case '/':
                resultado = numero1 / numero2;
                break;

            default:
                System.out.println("Operação inválida.");
                return;
        }

        // ------------------------------------------------------------
        // Exibe o resultado da operação
        // ------------------------------------------------------------
        System.out.println("Número 1: " + numero1);
        System.out.println("Número 2: " + numero2);
        System.out.println("Operação: " + operacao);
        System.out.println("Resultado: " + resultado);
    }
}