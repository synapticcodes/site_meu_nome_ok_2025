# Guia de Deploy - Netlify

## Configuração do build
- Comando: `npm run build`
- Diretório de publicação: `dist`
- Versão do Node: 20
- Variáveis obrigatórias:
  - `FORM_WEBHOOK_URL`: URL do serviço que receberá as submissões do formulário.
  - `PUBLIC_ANALYTICS_ENDPOINT` (opcional): endpoint para coleta dos Web Vitals.

## Passos recomendados
1. Criar novo site no Netlify apontando para o repositório Git.
2. Configurar as variáveis de ambiente acima em *Site Settings → Build & deploy → Environment*.
3. Ativar HTTPS automático (Netlify fornece certificado via Let’s Encrypt).
4. Validar que o arquivo `netlify.toml` está na raiz para aplicar redirects e cabeçalhos.
5. Após o primeiro deploy, executar `npm run perf:budget` localmente para garantir que o build atende aos limites definidos.

## Monitoramento
- Os Web Vitals são enviados para `PUBLIC_ANALYTICS_ENDPOINT` via `navigator.sendBeacon` (ver `src/utils/webVitals.ts`).
- Caso não exista endpoint configurado, os valores são logados no console do navegador para debug manual.
- Recomenda-se integrar com uma ferramenta de observabilidade (por exemplo, Netlify Analytics ou Logflare) para armazenar os eventos.
