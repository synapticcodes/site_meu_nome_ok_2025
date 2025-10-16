# Auditoria de Conteúdo e Arquitetura Atual

## 1. Inventário de Páginas e CTAs

| Página | URL antiga | Conteúdo principal | CTA atual | Observações |
| --- | --- | --- | --- | --- |
| Página inicial (home) | `/home-2/` (alias `home/index.html`) | Anúncio de novo portal, seções de benefícios, depoimentos, FAQ | "Quero negociar minhas dívidas" → formulário Bitrix | Estrutura pesada com Divi, carregamento lento, múltiplos scripts externos |
| Limpe seu nome agora | `/limpe-seu-nome-agora/` | Landing focada no formulário Bitrix24 | Formulário Bitrix inline (Loader 11) + botão "Voltar ao site" | Página sem conteúdo de apoio, depende 100% do iframe do formulário |
| Como funciona | `/como-funciona/` | Explicação do processo em etapas | CTA "Iniciar renegociação" apontando para formulário | Conteúdo repetitivo; títulos desorganizados |
| O que fazemos | `/o-que-fazemos/` | Serviços oferecidos, diferenciais da equipe | CTA "Fale com um especialista" | Mistura de blocos de texto com estilização pesada |
| Ajuda / Blog | `/category/ajuda/`, `/ajuda/` | Artigos de suporte e notícias | CTAs secundárias para formulário | Falta categorização clara e links internos |
| Blog Post (ex: Hello World) | `/hello-world/` | Conteúdo padrão WordPress | Sem CTA estratégica | Conteúdo legado sem alinhamento |
| Página institucional | `/index.html?p=6090` etc. | Conteúdos arquivados do WordPress | Links quebrados | Necessário mapear para redirects |
| Robots / Feed | `/robots.txt`, `/feed/` | Arquivos técnicos | — | Manter atualizados na nova estrutura |

## 2. Componentes e Blocos Reutilizáveis

- **Header / Navigation**: menu superior com logotipo e links para Home, Blog, Formulário; versão atual é inconsistente entre páginas e não responsiva.
- **Footer**: blocos padrão WordPress com informações da empresa, redes e direitos autorais; não há selos de confiança.
- **Blocos de prova social**: depoimentos (textos curtos) e logos de parceiros em `home/index.html`.
- **FAQ**: acordeão com perguntas frequentes em `home/index.html`.
- **Formulário Bitrix**: embed padrão carregado via script externo (loader_11.js) presente na landing e em widgets flutuantes.

## 3. Estrutura de Navegação Planejada

- **Navegação principal (desktop/mobile)**
  - Início
  - Como Funciona
  - O que Fazemos
  - Limpe seu Nome
  - Ajuda (FAQ + Blog)
  - CTA fixo: "Quero negociar minhas dívidas"
- **Footer**
  - Empresa: Sobre, Cases, Contato
  - Suporte: Perguntas frequentes, Blog, Área do cliente
  - Legal: Política de Privacidade, Termos de Uso, LGPD

## 4. Objetivos de Negócio, Métricas e Personas

- **Objetivo primário**: gerar leads qualificados pelo formulário "Limpe seu nome".
- **Objetivos secundários**: educar sobre renegociação de dívidas, fortalecer confiança na marca, capturar contatos para nutrição.
- **Métricas chave**:
  - Taxa de conversão do formulário (visitas → envios)
  - Tempo médio de carregamento (LCP < 2.5s)
  - Posições orgânicas para termos de renegociação
  - Volume de leads qualificados por canal
- **Personas principais**:
  1. **Consumidor endividado**: precisa negociar dívidas pessoais rapidamente; busca suporte humano.
  2. **Empreendedor com restrição**: procura renegociar dívidas PJ e manter operação ativa.
  3. **Parceiro B2B**: escritórios contábeis e jurídicos que indicam clientes.

## 5. Funis e Fluxos de Conversão Atuais

1. **Funil principal (orgânico/paid → landing)**
   - Entrada por anúncios ou busca orgânica → página "Limpe seu nome" → formulário Bitrix → contato com consultor.
2. **Funil secundário (conteúdo → formulário)**
   - Usuário acessa blog/FAQ → CTA interna "Resolver minhas dívidas" → formulário principal.
3. **Fluxo de suporte**
   - Clique em Widget Bitrix 24 (botão flutuante) → chat/ligação com equipe → encaminhamento para renegociação.

### Pontos de atenção identificados
- Scripts legados (GTM, Bitrix, Divi) prejudicam performance e precisam ser substituídos por soluções otimizadas.
- Navegação inconsistente entre páginas e ausência de versão mobile eficiente.
- Necessidade de conteúdo atualizável em seções-chave (depoimentos, FAQ, benefícios) com componentes reutilizáveis no novo design system.
- Falta de controle sobre mensagens de sucesso/erro do formulário atual.

Este inventário orienta a migração de conteúdo e a criação de componentes modulares no novo projeto Astro.

## 6. Mapeamento para o novo site

| Página WordPress | Nova rota Astro | Template | Componentes principais |
| --- | --- | --- | --- |
| `/home-2/` | `/` | MainLayout + Home Sections | Hero, Trust, Highlights, Steps, Benefits, Form CTA, Testimonials, FAQ |
| `/como-funciona/` | `/como-funciona` | MainLayout + Service sections | PageHero, ServiceSection x4, Checklist |
| `/o-que-fazemos/` | `/o-que-fazemos` | MainLayout + Service sections | PageHero, ServiceSection x3, Checklist |
| `/limpe-seu-nome-agora/` | `/limpe-seu-nome` (em desenvolvimento) | Form multi-etapas | PageHero, MultiStepForm, FAQ |
| `/ajuda/` | `/ajuda` | MainLayout + Conteúdo de suporte | PageHero, ServiceSection x2, Checklist, FAQ |
| Blog (`/category/ajuda/`) | `/blog` (fase 2) | Collections Astro | Listagem + CTA |

Todos os textos foram migrados para arquivos estruturados em `src/content`, permitindo edição centralizada e reaproveitamento pelos componentes de layout.

### Biblioteca de assets migrados
- Logos institucionais convertidos para SVG em `public/images/logos`.
- Ícones sociais otimizados em `public/icons`.
- Registros de favicon, manifest e arquivos técnicos em `public/`.
- Demais imagens originais serão convertidas para WebP na etapa 4.3.
