package modulo05_for_avancado;

// TESTE DE FIXAÇÃO
//
// Neste exercício consegui compreender definitivamente:
//
// ✔ O FOR é responsável pela repetição.
// ✔ O IF decide quando executar uma ação.
// ✔ As chaves {} representam as ações que serão executadas.
// ✔ As variáveis ("caixinhas") armazenam informações diferentes.
// ✔ O contador percorre os valores.
// ✔ A variável 'produtos' conta quantas vezes a condição foi verdadeira.

public class teste {
    public static void main(String[] args) {

        int produtos = 0;

        for (int contador = 1; contador <= 30; contador++)
        {
            if (contador % 3 == 0){
                produtos++;
                System.out.println(contador);
            }
        }
        System.out.println("Quandidade produtos:" + produtos);
    }
}