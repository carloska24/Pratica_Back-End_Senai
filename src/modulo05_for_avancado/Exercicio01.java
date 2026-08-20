package modulo05_for_avancado;

public class Exercicio01 {
    public static void main(String[] args) {
        int soma = 0;

        for (int contador = 0; contador < 10; soma = soma + contador) contador++;
        {

            System.out.println("Soma = " + soma);
        }
    }
}