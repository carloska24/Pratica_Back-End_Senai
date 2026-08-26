# Auditoria funcional do Campus Backend

Data: 24/08/2026
Branch auditada: `codex/lab-module-ai-tutor`

## Escopo

- navegação entre as sete áreas do Campus;
- grade, progresso local e bloqueio sequencial dos módulos;
- Sala de Aula e simulação guiada;
- Laboratório, editor, investigação passo a passo, execução livre e validação de missão;
- Arena, conquistas e desempenho;
- Tutor local/IA, contratos da API e limites de entrada;
- build de produção, cabeçalhos HTTP, dependências e CI;
- responsividade e acessibilidade básica por teclado/semântica.

## Problemas críticos corrigidos

1. Um arquivo livre podia receber a suíte de testes do módulo selecionado. Agora a validação só aparece depois de carregar explicitamente a missão correspondente.
2. A execução livre podia registrar tentativa e desbloquear progresso indevidamente. Agora ela mostra apenas o console.
3. Módulos liberados apareciam com 72% sem terem sido estudados. Agora começam em 0%.
4. O executor aceitava mensagens sem correlação e expunha capacidades desnecessárias. Agora usa identificador por execução, valida o protocolo, limita arquivo/logs/testes e bloqueia APIs incompatíveis com o ambiente local.
5. O endurecimento inicial do executor gerava `Unexpected eval or arguments in strict mode`. A auditoria em navegador detectou a regressão e a fábrica foi corrigida e coberta por teste.
6. Pedidos do Tutor não eram cancelados ao sair ou mudar o código. Agora usam `AbortController` e o endpoint rejeita corpos acima de 256 KB.
7. O CI não executava a suíte de testes. Agora roda testes, TypeScript, auditoria de dependências e build.
8. Next.js 15 e dependências transitivas apresentavam vulnerabilidades altas. O projeto foi migrado para Next.js 16.3.2 e DOMPurify 3.4.14.

## Resultado verificado

- `npm test`: 85 testes aprovados em 23 arquivos;
- `npm run typecheck`: aprovado;
- `npm run build`: aprovado com Next.js 16.3.2/Turbopack;
- `npm audit --omit=dev`: 0 vulnerabilidades;
- smoke test de produção: `/` respondeu 200;
- API do Tutor: JSON inválido respondeu 400 e corpo excessivo respondeu 413;
- cabeçalhos: `nosniff`, `DENY`, política de referência e permissões restritas presentes;
- navegador real: execução livre exibiu `true` sem testes e sem desbloquear M08;
- navegador real: missão M07 carregada explicitamente exibiu 0/4 critérios para o exercício incompleto;
- navegador real: Bancada de Execução abriu com oito snapshots e controles passo a passo;
- navegador real: Sala de Aula exibiu “SIMULAÇÃO GUIADA”;
- viewport 390×844: largura raiz 390 px, sem overflow horizontal; sete alvos de navegação medidos em 48×48 px;
- console do navegador: zero erros e zero avisos nos fluxos finais auditados.

## Limites conhecidos

- o executor usa Web Worker e limites defensivos, mas não deve ser tratado como sandbox para código hostil;
- a explicação por OpenAI depende de `OPENAI_API_KEY`; sem chave, o Tutor usa a explicação local determinística;
- os módulos M13–M22 continuam planejados e não foram implementados nesta etapa;
- persistência permanece local no navegador, sem conta, servidor ou sincronização entre dispositivos.
