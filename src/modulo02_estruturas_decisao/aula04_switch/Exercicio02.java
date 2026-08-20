package modulo02_estruturas_decisao.aula04_switch;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 04 - Switch
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura switch para identificar o dia da semana
 * de acordo com um número informado.
 */

public class Exercicio02 {
    public static void main(String[] args) {
// ------------------------------------------------------------
// Número correspondente ao dia da semana
// ------------------------------------------------------------
        int diaSemana = 6;
// ------------------------------------------------------------
// Exibe o dia da semana conforme a opção informada
// ------------------------------------------------------------
        switch (diaSemana) {

            case 1:
                System.out.println("Domingo");
                break;
            case 2:
                System.out.println("Segunda-feira");
                break;
            case 3:
                System.out.println("Terca-feira ");
                break;
            case 4:
                System.out.println("Quarta-feira");
                break;
            case 5:
                System.out.println("Quinta-feira");
                break;
            case 6:
                System.out.println("Sexta-feira");
                break;
            case 7:
                System.out.println("Sabado");
                break;
            default:
                System.out.println("Dia Inexistente.");
        }
    }
}
