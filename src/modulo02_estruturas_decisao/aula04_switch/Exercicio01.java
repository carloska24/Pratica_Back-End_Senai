package modulo02_estruturas_decisao.aula04_switch;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 04 - Switch
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Simular um menu simples de um sistema utilizando a
 * estrutura switch.
 *
 * De acordo com a opção escolhida pelo usuário, o sistema
 * deverá exibir a funcionalidade correspondente.
 */

public class Exercicio01 {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Opção escolhida pelo usuário
        // ------------------------------------------------------------
        int opcao = 2;

        // ------------------------------------------------------------
        // Verifica a opção selecionada no menu
        // ------------------------------------------------------------
        switch (opcao) {

            case 1:
                System.out.println("Cadastrar Cliente");
                break;

            case 2:
                System.out.println("Consultar Cliente");
                break;

            case 3:
                System.out.println("Atualizar Cliente");
                break;

            case 4:
                System.out.println("Excluir Cliente");
                break;

            default:
                System.out.println("Opção inválida.");
        }

    }

}
