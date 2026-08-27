# Progressão individual de alunos

## Entendimento aprovado

- Cada novo aluno começa com 0% em M01, Aula 01.
- O currículo descreve conteúdo; não carrega o histórico pessoal do autor.
- O Neon é a fonte oficial do progresso de cada conta.
- Uma aula só pode ser concluída depois de explicação, lousa, checkpoint e exercício obrigatório.
- A próxima aula é liberada após a conclusão da atual; o próximo módulo depende da conclusão do módulo anterior.
- Nome, progresso, conquistas e ponto de retomada pertencem ao usuário autenticado.
- O visual atual do Campus deve ser preservado.

## Premissas

- Volume inicial pequeno, com atualizações curtas por etapa concluída.
- O sistema não armazena código ou respostas além do necessário para comprovar o avanço.
- Falhas de rede não podem apresentar progresso como persistido.
- Escritas repetidas devem ser idempotentes e nunca reduzir uma conclusão já registrada.

## Arquitetura

`courseLibrary` permanece como catálogo imutável. O estado individual é armazenado em `student_lesson_progress`, identificado por aluno e aula. Cada registro guarda as evidências obrigatórias, conclusão e data de atualização.

As rotas autenticadas recebem apenas módulo, aula e etapa. O `userId` é obtido da sessão no servidor. O servidor valida a ordem curricular e só aceita a conclusão quando todas as etapas aplicáveis estão satisfeitas.

O cliente consulta um resumo do progresso após o login. A visão geral, a grade, a sala de aula, o desempenho e as conquistas usam esse resumo. O armazenamento local deixa de definir o avanço e permanece apenas como apoio para experiências locais do laboratório.

## Fluxo

1. Conta sem progresso recebe M01-A01 como aula atual.
2. Cada etapa concluída é enviada ao servidor e persistida no Neon.
3. O botão `Concluir aula e avançar` é habilitado somente quando os requisitos forem atendidos.
4. A conclusão libera a próxima aula; a última aula libera o próximo módulo conforme as regras do catálogo.
5. Logout/login ou mudança de dispositivo restaura a jornada pelo Neon.

## Tratamento de falhas

- Sem sessão: resposta 401.
- Aula ou etapa desconhecida: resposta 400.
- Tentativa de pular requisito ou conteúdo bloqueado: resposta 409.
- Banco indisponível: nenhuma confirmação otimista; o aluno pode tentar novamente.
- Escrita duplicada: mantém o estado concluído sem criar registros adicionais.

## Estratégia de testes

- Novo aluno inicia em M01-A01 com 0%.
- Requisitos pendentes bloqueiam a conclusão.
- Todas as evidências liberam a próxima aula.
- Contas não compartilham progresso.
- Repetição, duas abas e nova sessão não causam regressão.
- Dashboard e currículo refletem apenas dados persistidos do aluno.

## Registro de decisões

1. Neon, em vez de `localStorage`, é a fonte oficial para permitir múltiplos dispositivos.
2. Conclusão manual foi escolhida no lugar de avanço por rolagem para exigir intenção do aluno.
3. O servidor valida requisitos para impedir avanço apenas manipulando a interface.
4. O catálogo e o progresso foram separados para que o histórico do autor não seja herdado.
5. A conta já criada será reiniciada sem apagar o usuário ou suas credenciais.
