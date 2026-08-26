# Acesso de alunos e progresso persistente

## Entendimento validado

- O Campus será acessível por um link público hospedado na Vercel.
- Qualquer visitante poderá criar uma conta, sem código de convite.
- O aluno começará pelo M01 e poderá continuar de onde parou.
- O progresso deverá pertencer ao aluno, não apenas ao navegador.
- O visual atual é uma restrição: não alterar cores, tipografia, espaçamentos, componentes ou identidade da aplicação.
- A implementação será feita em branch separada e só chegará à `main` após testes.

## Decisão arquitetural

Usar Better Auth para autenticação, Drizzle ORM para acesso tipado ao banco e Neon PostgreSQL para persistência. A sessão será mantida em cookie HTTP-only e as senhas serão armazenadas somente como hash pela biblioteca de autenticação.

## Fluxo do aluno

1. Visitante abre o link público.
2. Escolhe entrar ou criar conta.
3. Cadastro recebe nome, e-mail e senha.
4. Após autenticar, o aluno recebe uma introdução do Campus.
5. O primeiro módulo exibido é o M01.
6. A aplicação lê e grava progresso, aulas concluídas, tentativas e conquistas associados ao usuário autenticado.
7. O logout encerra a sessão sem apagar o progresso.

## Modelo inicial de dados

- `user`: identidade, nome, e-mail e timestamps.
- `session`: sessões ativas e expiração.
- `account`: vínculo com o mecanismo de autenticação.
- `verification`: tokens temporários de verificação.
- `student_progress`: módulo, aula, estado, percentual e atualização.
- `student_attempt`: execução, resultado e metadados pedagógicos mínimos.

## Segurança e limites

- Validar entrada no servidor.
- Nunca confiar no `userId` enviado pelo cliente; obtê-lo da sessão.
- Aplicar autorização em cada leitura e gravação de progresso.
- Não colocar segredos no cliente ou no repositório.
- Separar variáveis locais e de produção.
- Não enviar código do aluno para serviços externos sem ação explícita.
- Implementar rate limit e mensagens de erro que não revelem se um e-mail existe.

## Alternativas consideradas

- Auth.js + Prisma: maduro, mas introduz mais camadas para este projeto.
- Supabase Auth + Neon: divide autenticação e dados entre dois provedores.
- Better Auth + Drizzle + Neon: escolhido por combinar com Vercel/Neon e manter a solução enxuta.

## Critérios de aceite

- Cadastro e login funcionam localmente e em ambiente Vercel configurado.
- Usuários diferentes não conseguem ler o progresso uns dos outros.
- O progresso sobrevive a logout, novo navegador e novo dispositivo.
- Usuário não autenticado não acessa dados privados.
- O visual existente permanece sem alterações não relacionadas.
- Testes, TypeScript e build de produção passam.
