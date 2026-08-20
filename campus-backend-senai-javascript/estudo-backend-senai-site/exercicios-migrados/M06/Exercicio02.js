// Exercicio02.js
// Objetivo: visualizar quem repete primeiro em dois laços aninhados.

for (let linha = 1; linha <= 3; linha++) {
    // Executa uma vez para cada volta do for externo.
    console.log("Linha", linha);

    for (let coluna = 1; coluna <= 3; coluna++) {
        // Este bloco precisa terminar as 3 colunas antes da próxima linha.
        console.log("   Coluna", coluna);
    }

    console.log("");
}
