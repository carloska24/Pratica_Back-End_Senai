// Origem: Programa2.java
// Ideia central: receber um valor, decidir e devolver um boolean.

function verificarMaioridade(idade) {
    if (idade >= 18) {
        return true;
    }

    return false;
}

const resultado = verificarMaioridade(20);
console.log(resultado);
