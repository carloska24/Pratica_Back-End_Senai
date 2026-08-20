package modulo02_estruturas_decisao.aula03_operadores_logicos;

/*
 * ============================================================
 * Curso Java
 * Módulo 02 - Estruturas de Decisão
 * Aula 03 - Operadores Lógicos
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Demonstrar o uso do operador lógico NOT (!).
 * O acesso somente será permitido se o usuário
 * não estiver bloqueado.
 */

public class Exercicio03
{
    public static void main(String[] args) {
        // Indica se o usuário está bloqueado
        boolean bloqueado = false;

        if (!bloqueado) {
            System.out.println("Acesso liberado");
        }
    }
}
