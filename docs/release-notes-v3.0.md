Release v3.0 – Notas de atualização

Esta versão consolida melhorias visuais, conteúdo e componentes do site.

Principais mudanças
- Inclusão de novas imagens e ícones:
  - `public/images/partners/*`, `public/images/press/*`, `public/images/testimonials/*`, `public/images/icons/*`, `public/images/avatars/*`
- Novos componentes e seções:
  - `src/components/sections/Press.astro`, `src/components/sections/TestimonialsCarousel.tsx`, `src/components/ui/RetroGrid.tsx`
- Ajustes de páginas e seções:
  - `src/components/sections/Hero.astro`, `src/components/sections/Benefits.astro`, `src/pages/index.astro`
- Configuração e estilos:
  - Ajustes em `tailwind.config.cjs` e estilos para suportar os novos componentes.

Fluxo de branches e release
- `version_2.0` integrado à `main`.
- Branch `versao_3.0` criado e alinhado à `main`.
- Tag `v3.0` publicada apontando para o commit atual de `main`.

Observação
- Recomenda-se validar visualmente em ambiente de preview antes do deploy.
