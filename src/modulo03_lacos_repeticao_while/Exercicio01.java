package modulo03_lacos_repeticao_while;

/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Exercício 01
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while para realizar uma contagem
 * simples de números, exibindo os valores de 1 a 5.
 */

public class Exercicio01
{
	public static void main(String[] args)
	{
		int contador = 1;

        while (contador <= 10)
        {
            System.out.println(contador);
            contador++;
        }
	}
}
