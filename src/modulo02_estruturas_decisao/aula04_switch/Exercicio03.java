package modulo02_estruturas_decisao.aula04_switch;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 04 - Switch
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura switch com String para verificar
 * o tipo de plano de assinatura e exibir o nível de
 * acesso correspondente.
 */

public class Exercicio03 {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Plano de assinatura escolhido pelo usuário
        // ------------------------------------------------------------
        String plano = "Premium";

        // ------------------------------------------------------------
        // Verifica o plano e exibe o tipo de acesso correspondente
        // ------------------------------------------------------------
        switch (plano) {

            case "Basico":
                System.out.println("Acesso limitado");
                break;

            case "Premium":
                System.out.println("Acesso completo");
                break;

            case "Enterprise":
                System.out.println("Acesso empresarial");
                break;

            default:
                System.out.println("Plano inexistente.");
        }
    }
}