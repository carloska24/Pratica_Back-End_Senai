# Conclusão de módulo e exemplos na Bancada

## Entendimento aprovado

- O aluno pode estudar todas as aulas e exercícios, mas a diferença entre revisão local e progresso oficial não está clara.
- O fluxo atual exige quatro evidências por aula e uma conclusão individual, o que pode impedir a liberação mesmo após o estudo do módulo.
- Cada módulo precisa de uma ação explícita e fácil para o aluno declarar que concluiu seus estudos e liberar apenas o próximo módulo.
- Os 20 exemplos guiados devem poder abrir na Bancada de Execução já existente no Laboratório.
- O visual editorial atual do Campus deve ser preservado.
- A `main` não será alterada durante o desenvolvimento; todo o trabalho ocorrerá nesta branch.

## Premissas não funcionais

- A conclusão deve persistir no Neon e permanecer disponível em qualquer dispositivo da mesma conta.
- A rota do servidor deve recusar conclusão de módulos bloqueados e requisições sem sessão.
- A operação deve ser idempotente: repetir a confirmação não pode regredir nem duplicar progresso.
- A interação precisa ser curta, acessível por teclado e clara em telas menores.
- O volume inicial é pequeno; não haverá armazenamento de código do aluno nem mudanças no modelo de autenticação.

## Design

### Conclusão manual

Na Biblioteca da Sala de Aula, o módulo atual e desbloqueado exibirá `Concluir Mxx e liberar Myy`. A confirmação curta explica o impacto antes da gravação. Confirmada a intenção, a API marca as aulas do módulo como concluídas e devolve o resumo atualizado; o próximo módulo torna-se disponível. Módulos concluídos permanecem como material de revisão e módulos futuros continuam bloqueados.

### Exemplos guiados

O exemplo com código exibe `Investigar na Bancada`. A ação encaminha o código, o título e o módulo M07 para o mesmo fluxo que já inicia a Bancada de Execução no Laboratório. O exemplo não altera missões, conquistas ou a conclusão de módulo.

## Tratamento de falhas

- Sem sessão ou banco indisponível: mostrar a mensagem retornada e não confirmar visualmente o avanço.
- Módulo bloqueado ou inexistente: retornar conflito/validação e não alterar registros.
- Cancelamento da confirmação: não faz chamada à API.
- Falha ao interpretar um exemplo: o Laboratório mostra o feedback de investigação já existente.

## Estratégia de testes

- A API só conclui o módulo atual desbloqueado e libera o seguinte.
- Uma segunda conclusão do mesmo módulo mantém o resultado.
- Cancelar o diálogo não persiste alterações.
- O botão de exemplo encaminha código e contexto corretos para a Bancada.
- Testes existentes de progresso, tipos e build continuam aprovados.

## Registro de decisões

1. Usar confirmação manual de módulo em vez de exigir todas as marcações locais, pois o objetivo é eliminar a ambiguidade da jornada.
2. Persistir no Neon, e não em `localStorage`, para manter o estado individual em qualquer dispositivo.
3. Exigir confirmação curta antes de liberar conteúdo para evitar acionamento acidental.
4. Reutilizar a Bancada existente em vez de criar outro depurador.
5. Manter exemplos guiados como estudo assistido, separados da validação oficial de missões.
