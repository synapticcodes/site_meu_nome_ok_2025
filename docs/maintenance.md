# Rotina de Manutenção

## Atualizações de dependências
- Executar `npm outdated` mensalmente.
- Atualizar dependências com `npm update` ou Renovate.
- Rodar `npm run lint`, `npm run test`, `npm run perf:budget` após cada atualização.

## Monitoramento contínuo
- Verificar endpoint de Web Vitals (definido em `PUBLIC_ANALYTICS_ENDPOINT`).
- Revisar logs do webhook de formulário (`FORM_WEBHOOK_URL`) para identificar falhas.
- Agendar auditoria Lighthouse trimestral.

## Backup & rollback
- Netlify mantém histórico de deploys. Para rollback, acione `Deploys → Publish deploy` no último build estável.
- Exportar submissões do formulário via webhook (ex.: armazenar em CRM ou banco externo).
