package modulo01_fundamentos_java.aula01_variaveis;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 01 - Variáveis
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Criar variáveis para armazenar nome, idade, altura
 * e situação de trabalho, exibindo os valores no console.
 */

public class Exercicio1 {
    public static void main(String[] args){
        String nome = "Carlos";
        Integer idade = 41;
        double altura = 1.70;
        boolean trabalha = true;

        System.out.println(nome);
        System.out.println(idade);
        System.out.println(altura);
        System.out.println(trabalha);
    }
}