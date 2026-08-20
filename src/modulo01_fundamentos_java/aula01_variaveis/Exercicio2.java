package modulo01_fundamentos_java.aula01_variaveis;

/*
 * ============================================================
 * Curso Java
 * Módulo 01 - Fundamentos Java
 * Aula 01 - Variáveis
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Criar variáveis para armazenar empresa, cargo, salário
 * e anos de experiência, exibindo os valores no console.
 */

public class Exercicio2 {
    public static void main(String[] args){
        String empresa = "CADService";
        String cargo = "Operador de CAM";
        double salario = 4600;
        int anosExperiencia = 16;

        System.out.println(empresa);
        System.out.println(cargo);
        System.out.println(salario);
        System.out.println(anosExperiencia);
    }
}