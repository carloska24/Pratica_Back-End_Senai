package modulo01_fundamentos_java.aula01_variaveis;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 01 - Variáveis
 * Desafio
 * ============================================================
 *
 * Objetivo:
 * Criar um cadastro simples de funcionário utilizando
 * diferentes tipos de variáveis em Java.
 */

public class Desafio {
    public static void main(String[] args) {
        String nome = "Carlos";
        Long cpf = 3000000000L;
        int idade = 41;
        double salario = 5000;
        String departamento = "SMD";
        boolean possuiCracha = true;
        char letraInicialDepartamento = 'S';

        System.out.println("O nome do Funcionario é: " + nome);
        System.out.println("O CPF do Funcionario é: " + cpf);
        System.out.println("A idade do Funcionario é: " + idade);
        System.out.println("O salario é: " + salario);
        System.out.println("O Departamento do Funcionario é: " + departamento);
        System.out.println("O Funcionario possui crachá? " + possuiCracha);
        System.out.println("A letra inicial do departamento é: " + letraInicialDepartamento);
    }
}