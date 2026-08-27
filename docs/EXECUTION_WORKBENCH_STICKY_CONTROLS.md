# Controles fixos da Bancada de Execução

## Entendimento

- O aluno precisa acompanhar o código enquanto avança pelos snapshots.
- A navegação da execução deve continuar acessível durante a rolagem vertical.
- O visual, o conteúdo e a lógica atuais da Bancada devem ser preservados.
- O cabeçalho azul não deve ocupar permanentemente a área útil da tela.
- Desktop, tablet e celular devem continuar funcionais.

## Pressupostos

- A fixação será feita apenas com HTML e CSS, sem observadores de rolagem.
- O bloco fixo reunirá a região de controles e a timeline existente.
- A timeline continuará permitindo rolagem horizontal em telas estreitas.
- Não há alteração de dados, segurança, privacidade ou execução do código.

## Design final

Os controles de passo e a timeline serão envolvidos por uma única região de navegação. Essa região usará posicionamento `sticky` no topo do contêiner rolável da Bancada, com fundo opaco, camada superior e separação visual discreta. O cabeçalho institucional continuará no fluxo normal e sairá da tela durante a rolagem, preservando espaço para o código.

O comportamento responsivo existente será mantido. Em telas pequenas, os botões continuam compactos e a timeline mantém seu deslocamento horizontal. A navegação por teclado, os rótulos acessíveis, a reprodução automática e a mudança manual de snapshots não serão modificados.

## Abordagens consideradas

1. **Controles e timeline fixos — escolhida.** Mantém a interação disponível com baixo consumo vertical.
2. Cabeçalho, controles e timeline fixos. Rejeitada porque encobre uma parte excessiva do código.
3. Botão flutuante isolado. Rejeitada porque separa a navegação do contexto do passo atual.

## Decisão

Foi escolhida uma barra fixa compacta formada pelos controles e pela timeline. A solução maximiza a leitura do código, não altera a identidade visual e exige pouca manutenção.

## Validação

- Confirmar que o cabeçalho azul sai da tela ao rolar.
- Confirmar que controles e timeline permanecem visíveis.
- Confirmar avanço, retorno, reprodução, reinício e troca direta de snapshot.
- Verificar desktop, 1024 px, 720 px e 390 px.
- Executar testes do componente, TypeScript e build de produção.
