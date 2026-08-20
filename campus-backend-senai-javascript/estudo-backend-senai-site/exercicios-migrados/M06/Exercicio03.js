// Exercicio03.js
// Objetivo: formar blocos de estrelas usando repeticoes aninhadas.

for (let linha = 1; linha <= 3; linha++) {
    console.log(`Linha ${linha}`);

    for (let coluna = 1; coluna <= 3; coluna++) {
        let estrelas = "";

        for (let estrela = 1; estrela <= coluna; estrela++) {
            estrelas += "*";
        }

        console.log(estrelas);
    }

    console.log("");
}
