package modulo03_lacos_repeticao_while;

/*
 * ============================================================
 * Curso Java
 * Módulo 03 - Laços de Repetição
 * Aula 01 - While
 * Exercício 02
 * ============================================================
 *
 * Objetivo:
 * Utilizar a estrutura while para exibir os números pares
 * de 2 a 10, demonstrando o uso de incremento em laços
 * de repetição.
 */

public class Exercicio02
{
    public static void main(String[] args)
    {
        int contador = 2;

        while(contador <= 10)
        {
            System.out.println(contador);
            contador+=2;
        }
    }
}
