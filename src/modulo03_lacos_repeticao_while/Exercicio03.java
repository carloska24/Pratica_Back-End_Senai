package modulo03_lacos_repeticao_while;

/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Exercício 03
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while para somar os números de 1 a 5
 * e exibir o resultado final da soma.
 */

public class Exercicio03
{
	public static void main(String[] args)
	{
		int contador = 1;
        int soma = 0;

        while (soma < 15)
        {
           soma = soma + contador;
           contador++;
        }
        System.out.println("A Soma é: " + soma);
	}
}
