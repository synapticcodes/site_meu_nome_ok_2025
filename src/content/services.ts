export const services = {
  comoFunciona: {
    slug: 'como-funciona',
    title: 'Como funciona o Meu Nome OK',
    description:
      'Processo transparente, com diagnóstico gratuito e acompanhamento humano em todas as etapas da renegociação.',
    hero: {
      eyebrow: 'Jeito Meu Nome OK de resolver',
      title: 'Quatro etapas para resolver suas dívidas sem burocracia',
      description:
        'Desde o primeiro contato você sabe exatamente o que acontece em cada fase. Nosso time combina análise de dados, negociação ativa e suporte jurídico quando necessário.',
      primaryCta: { label: 'Quero iniciar agora', href: '/#formulario' },
      secondaryCta: { label: 'Falar com um especialista', href: '/#formulario' }
    },
    sections: [
      {
        id: 'diagnostico',
        badge: 'Etapa 1',
        title: 'ETAPA 1 — Entenda suas pendências',
        content: [
          'Você envia suas contas; a gente confere valores e prazos e mostra quanto dá para reduzir num plano único.',
          'Você recebe um raio-X fácil de entender da sua situação atual.'
        ]
      },
      {
        id: 'estrategia',
        badge: 'Etapa 2',
        title: 'ETAPA 2 — Um plano que cabe no seu bolso',
        content: [
          'Reunimos tudo em um só plano com desconto, parcela fixa e prazo para começar a pagar.',
          'Alívio no mês: você volta a respirar e abre caminho para novas oportunidades de crédito.*'
        ]
      },
      {
        id: 'negociacao',
        badge: 'Etapa 3',
        title: 'ETAPA 3 — Comece sem dor de cabeça',
        content: [
          'A gente formaliza o plano com calendário claro e carência combinada.',
          'Um único cronograma de pagamentos, sem você lidar com vários acordos separados.'
        ]
      },
      {
        id: 'acompanhamento',
        badge: 'Etapa 4',
        title: 'ETAPA 4 — Estamos com você até o fim',
        content: [
          'Atualizações semanais e suporte quando precisar, do começo ao fim.',
          'Acompanhamos os registros conforme as regras de cada instituição até concluir o plano.',
          'As oportunidades de crédito dependem das políticas do mercado e do seu perfil.'
        ]
      }
    ],
    checklist: [
      'Avaliação inicial ágil e plano sugerido em 2 dias úteis',
      'Equipe experiente em renegociações com grandes credores',
      'Você escolhe o canal: telefone, WhatsApp ou portal seguro',
      'Acompanhamento fácil: progresso e documentos organizados em um só painel'
    ]
  },
  oQueFazemos: {
    slug: 'o-que-fazemos',
    title: 'Serviços especializados em renegociação',
    description:
      'Atendemos pessoas físicas e jurídicas com soluções completas para recuperação de crédito e reorganização financeira.',
    hero: {
      eyebrow: 'O que fazemos por você',
      title: 'Resolvemos dívidas complexas com estratégia e transparência',
      description:
        'Da negociação com credores à consultoria financeira pós-acordo, somos parceiros em todas as etapas da retomada do seu crédito.',
      primaryCta: { label: 'Falar com atendimento', href: '/#formulario' },
      secondaryCta: { label: 'Quero simular condições', href: '/#formulario' }
    },
    sections: [
      {
        id: 'pessoa-fisica',
        badge: 'Serviço',
        title: 'Para pessoas físicas',
        content: [
          'Renegociação de todos os tipos de dívidas (empréstimos, cartões de crédito e financiamentos, etc)',
          'Redução de dívidas com plano de pagamento ajustado ao seu orçamento,'
        ]
      },
      {
        id: 'pessoa-juridica',
        badge: 'Serviço',
        title: 'Para empresas',
        content: [
          'Negociação com fornecedores estratégicos, instituições financeiras e órgãos públicos.',
          'Estruturação de acordos que preservam fluxo de caixa e mantêm operações em andamento.'
        ]
      },
      {
        id: 'consultoria',
        badge: 'Serviço',
        title: 'Consultoria financeira e jurídica',
        content: [
          'Análise de contratos, contestação de cobranças abusivas e suporte jurídico quando necessário.',
          'Orientação fianceira para prevenção de endividamento'
        ]
      }
    ],
    checklist: [
      'Especialistas em endividamento',
      'Equipe dedicada e estratégica',
      'Rede de parceiros em todo o Brasil',
      'Tecnologia que acompanha todo o processo em tempo real'
    ]
  },
  ajuda: {
    slug: 'ajuda',
    title: 'Central de ajuda',
    description:
      'Guias rápidos, perguntas frequentes e canais de suporte para garantir uma experiência sem dúvidas.',
    hero: {
      eyebrow: 'Suporte',
      title: 'Dúvidas frequentes e materiais para quem quer resolver suas dívidas',
      description:
        'Selecionamos os principais tópicos para você entender como funciona o processo e acompanhar cada etapa com segurança.',
      primaryCta: { label: 'Entrar em Contato', href: '/#formulario' },
      secondaryCta: { label: 'Enviar e-mail', href: 'mailto:site@meunomeok.com' }
    },
    sections: [
      {
        id: 'faq',
        badge: 'Guia',
        title: 'Perguntas rápidas',
        content: [
          {
            question: 'Quanto tempo leva para receber a proposta?',
            answer:
              'Depois que você envia as informações, fazemos as análises e verificamos sua situação financeira bem como estimamos os cenários possíveis para resolver sua situação. Em geral, você recebe a análise completa entre 1 e 2 dias úteis (o prazo exato é informado após as análises e pode variar conforme os documentos).'
          },
          {
            question: 'Quais documentos preciso enviar?',
            answer: `Pedimos só o essencial para avaliar sua situação com segurança:
Documento com foto (RG ou CNH) e CPF; comprovante de residência;
Comprovante de renda (holerite/benefício) e, se houver, extrato de descontos em folha;
O que tiver das pendências (contratos, fatura, carta/print com valores e prazos);
Seus gastos mensais para avaliação de comprometimento de renda;
Se algo faltar, orientamos você passo a passo — sem burocracia.`
          },
          {
            question: 'Posso renegociar mais de uma dívida ao mesmo tempo?',
            answer:
              'Sim. Nosso modelo reúne suas pendências em um só plano com desconto, com parcela fixa que cabe no seu bolso e prazo para começar a pagar, evitando vários acordos separados e confusão de vencimentos.'
          },
          {
            question: 'Como funciona o acompanhamento depois do acordo?',
            answer:
              'Você conta com atualizações semanais e suporte dedicado durante todo o plano. Mantemos um histórico claro de etapas e documentos e acompanhamos os reflexos cadastrais conforme as regras de cada instituição — até a conclusão do seu plano.'
          },
          {
            question: 'Atendem todo o Brasil?',
            answer: 'Sim. O processo é 100% digital, com atendimento humano quando você precisar.'
          },
          {
            question: 'Como começo agora?',
            answer:
              'Leva 2 minutos para enviar suas informações. A previsão do plano é informada após a análise financeira do seu caso (geralmente 1–2 dias úteis).'
          }
        ]
      }
    ],
    checklist: [
      'Atendimento em até 2 minutos via WhatsApp',
      'Equipe treinada para casos complexos',
      'Base de conhecimento sempre atualizada',
      'Canal exclusivo para parceiros'
    ]
  }
} as const;
