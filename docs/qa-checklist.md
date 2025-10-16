# QA Checklist

## Navegadores Desktop
- [ ] Google Chrome (última versão)
- [ ] Mozilla Firefox
- [ ] Microsoft Edge
- [ ] Safari (macOS)

## Dispositivos Móveis
- [ ] iOS Safari (iPhone 12 ou superior)
- [ ] Chrome Android (Pixel / Samsung)
- [ ] Samsung Internet

## Breakpoints
- [ ] 320px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px

## Formulário "Limpe seu nome"
- [ ] Validação de campos obrigatórios por etapa
- [ ] Máscara de CPF/CNPJ e telefone
- [ ] Fluxo de erro de rede (exibe mensagem amigável)
- [ ] Redirecionamento para `/obrigado`

## SEO/Performance
- [ ] Lighthouse ≥ 90 (Performance, Acessibilidade, SEO)
- [ ] `npm run perf:budget` sem falhas
- [ ] Schema FAQ validado no Rich Results Test

## Acessibilidade
- [ ] Navegação completa via teclado
- [ ] Foco visível em todos os elementos interativos
- [ ] Teste com leitor de tela (NVDA ou VoiceOver)

Assinale cada item após a execução dos testes correspondentes.
