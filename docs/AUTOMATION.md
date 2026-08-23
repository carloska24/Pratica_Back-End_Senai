# Automação e manutenção

## Integração contínua

O workflow `.github/workflows/ci.yml` é executado em pull requests e em pushes para `main`.

Ele usa Node.js 22.19.0 e executa, nesta ordem:

1. instalação reproduzível com `npm ci`;
2. auditoria das dependências de produção, bloqueando vulnerabilidades críticas;
3. verificação TypeScript;
4. build de produção do Next.js.

A CI possui somente `contents: read`, não recebe secrets e não persiste as credenciais do checkout.

## Project Metrics

O workflow `.github/workflows/metrics.yml` gera dois arquivos:

- `docs/assets/metrics/project-overview.svg`: informações do repositório e distribuição de linguagens;
- `docs/assets/metrics/project-activity.svg`: atividade pública recente.

Ele pode ser executado manualmente e também roda às segundas-feiras, às 09:00 UTC. Os arquivos só são atualizados quando o conteúdo gerado muda.

### Secret necessário

Crie um repository secret chamado `METRICS_TOKEN`:

```text
GitHub
→ Pratica_Back-End_Senai
→ Settings
→ Secrets and variables
→ Actions
→ New repository secret
→ METRICS_TOKEN
```

O valor deve ser um Personal Access Token com validade definida e sem scopes adicionais. Ele é usado somente para consultar dados públicos pela API do GitHub.

Não conceda `repo`, `read:org`, acesso a packages, projects ou gists. Não use o PAT para gravar arquivos: essa responsabilidade pertence ao `GITHUB_TOKEN` temporário do workflow, limitado a `contents: write` no próprio repositório.

O valor real do token nunca deve ser colocado no YAML, em commits, logs ou documentação.

## Dependências conhecidas

Em 23 de agosto de 2026, `npm audit --omit=dev` registra cinco vulnerabilidades transitivas: três altas, uma moderada e uma baixa. Não há vulnerabilidade crítica.

As correções das ocorrências altas em `postcss` e `sharp` exigem, segundo o npm audit atual, uma atualização major para Next.js 16. Por isso, `npm audit fix --force` não deve ser usado. A remediação deve ocorrer em uma migração controlada, acompanhada de build e testes de navegador.

Até essa migração, a CI bloqueia novas vulnerabilidades críticas e mantém as ocorrências atuais explicitamente documentadas.
