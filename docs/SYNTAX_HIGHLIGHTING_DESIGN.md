# Realce de sintaxe da Bancada de Execução

## Entendimento confirmado

- A Bancada deve reconhecer a gramática JavaScript automaticamente.
- O resultado visual deve se aproximar do tema da IDE usada no Laboratório.
- Monaco não será renderizado nem usado como editor nessa área.
- Layout, fonte, dimensões, espaçamento, controles e linha ativa não serão alterados.
- O código continuará somente leitura e seguirá sincronizado aos snapshots.

## Premissas

- A aplicação continua local-first e o código pode mudar em tempo de execução.
- O realce deve carregar somente quando a Bancada for usada.
- Enquanto o mecanismo é carregado, o texto original permanece disponível sem mudança de layout.
- JavaScript é a única gramática necessária nesta etapa.

## Decisão

Usar Shiki com bundle mínimo, gramática JavaScript, engine JavaScript e tema `dark-plus`. Os tokens serão renderizados dentro das mesmas linhas existentes da Bancada; apenas a propriedade `color` de cada token será aplicada.

## Alternativas consideradas

- **Colorizador manual:** leve, porém não compreende a gramática completa.
- **Monaco somente leitura:** correspondência máxima com o editor, mas alteraria a tecnologia e o comportamento da lousa, contrariando a restrição definida.
- **Shiki:** gramática TextMate real, tema compatível com VS Code e integração sem substituir a interface atual. Opção escolhida.

## Verificação

- teste de preservação integral do texto;
- teste de reconhecimento de construções que o colorizador manual não entende;
- regressão da Bancada e do projeto;
- inspeção visual desktop e gate de overflow em 390 px e 1024 px.
