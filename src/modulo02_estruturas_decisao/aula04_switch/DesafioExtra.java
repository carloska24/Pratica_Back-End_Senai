package modulo02_estruturas_decisao.aula04_switch;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 04 - Switch
 * Desafio Extra
 * ============================================================
 *
 * Objetivo:
 * Simular um menu de caixa eletrônico utilizando a estrutura
 * switch, permitindo que o usuário escolha uma operação
 * bancária e receba a mensagem correspondente.
 *
 * Operações disponíveis:
 * 1 - Consultar Saldo
 * 2 - Sacar
 * 3 - Depositar
 * 4 - Transferir
 * 5 - Sair
 */

public class DesafioExtra {

    public static void main(String[] args) {

        // ------------------------------------------------------------
        // Opção escolhida pelo usuário no caixa eletrônico
        // ------------------------------------------------------------
        int opcao = 2;

        // ------------------------------------------------------------
        // Verifica a opção selecionada e exibe a operação correspondente
        // ------------------------------------------------------------
        switch (opcao) {

            case 1:
                System.out.println("Consulta realizada com sucesso.");
                break;

            case 2:
                System.out.println("Saque realizado com sucesso.");
                break;

            case 3:
                System.out.println("Depósito realizado com sucesso.");
                break;

            case 4:
                System.out.println("Transferência realizada com sucesso.");
                break;

            case 5:
                System.out.println("Encerrando sistema...");
                break;

            default:
                System.out.println("Opção inválida.");
        }
    }
}
