package modulo03_lacos_repeticao_while;

public class DesafioExtra5 {

    public static void main(String[] args) {

        int contador = 1;
        int quantidadeMultiplos = 0;
        int somaMultiplos = 0;

        System.out.println("Multiplos de 3 encontrados:");

        while (contador <= 30) {

            if (contador % 3 == 0) {

                // 1º println: mostra cada múltiplo encontrado
                System.out.println(contador);

                quantidadeMultiplos++;
                somaMultiplos = somaMultiplos + contador;
            }

            contador++;
        }

        // 2º println: mostra a quantidade total
        System.out.println("Quantidade de multiplos de 3: " + quantidadeMultiplos);

        // 3º println: mostra a soma total
        System.out.println("Soma dos multiplos de 3: " + somaMultiplos);
    }
}
