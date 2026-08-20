package modulo06_lacos_aninhados;

public class Programa2
{
    public static void main(String[] args)
    {
        verificarIdade(20);
    }
    public static void verificarIdade(int idade)
    {
        if ( idade >= 18)
        {
            System.out.println("Maior de idade");
        }
        else
        {
            System.out.println("Menor de idade");
        }
    }
}
