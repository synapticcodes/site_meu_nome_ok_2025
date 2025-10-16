# Meu Nome OK — Site Estático Modernizado

Projeto Astro com foco em performance, acessibilidade e conversão para o serviço "Limpe seu nome".

## 🧱 Tecnologias principais
- [Astro](https://astro.build/) com renderização estática
- Tailwind CSS com design tokens personalizados
- Formulário multi-etapas em React + `react-hook-form` + `zod`
- API serverless (`/api/forms/limpar-nome`) com integração via webhook
- Otimizações: `astro-compress`, PWA (vite-plugin-pwa), division de bundles

## 📂 Estrutura
```
Site Melhorado/
├── public/               # Assets públicos, ícones, robots.txt
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── forms/        # Componentes do sistema de formulários
│   │   ├── layout/       # Header, Footer, SEO, consentimento
│   │   └── sections/     # Blocos das páginas
│   ├── content/          # Conteúdo estruturado em TypeScript
│   ├── lib/              # Schemas e utilitários compartilhados
│   ├── layouts/          # Layout base do site
│   ├── pages/            # Rotas Astro + API
│   ├── styles/           # CSS global e tokens
│   └── utils/            # Funções auxiliares (formatters, cn, web vitals)
├── docs/                 # Documentação interna (auditoria, QA, deploy)
├── scripts/              # Script de orçamento de performance
├── netlify.toml          # Configuração de deploy + redirects
└── package.json
```

## 🚀 Scripts úteis
| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Ambiente de desenvolvimento (`localhost:4321`) |
| `npm run build` | Gera build estático em `dist/` |
| `npm run preview` | Preview local do build |
| `npm run lint` | ESLint (Astro + TS + Tailwind) |
| `npm run test` | Testes unitários com Vitest |
| `npm run coverage` | Relatório de cobertura |
| `npm run a11y` | Auditoria automática de acessibilidade (`astro check`) |
| `npm run perf:budget` | Verificação de tamanhos de bundle pós-build |

## 🔐 Variáveis de ambiente
Definidas em `.env.example`:
- `FORM_WEBHOOK_URL`: endpoint que recebe as submissões do formulário.
- `PUBLIC_ANALYTICS_ENDPOINT` (opcional): recebe eventos de Web Vitals.

## 🧪 QA & Launch
- Checklists em `docs/qa-checklist.md` e `docs/launch-checklist.md`.
- Auditoria de conteúdo e mapeamento de páginas em `docs/content-audit.md`.
- Guia de deploy Netlify em `docs/deployment.md`.

## 🧭 Rotas principais
- `/` — Landing page completa
- `/limpe-seu-nome` — Formulário multi-etapas
- `/como-funciona`, `/o-que-fazemos`, `/ajuda` — Páginas institucionais
- `/obrigado` — Confirmação de sucesso do formulário
- `/api/forms/limpar-nome` — Endpoint POST para submissões

## ✅ Status
Todas as tarefas obrigatórias do PRD foram implementadas seguindo `tasks.md`. Utilize os scripts acima para validar lint, testes, acessibilidade e performance antes do deploy.
