export const hero = {
  eyebrow: 'Renegociação humanizada',
  title: 'Resolva suas dívidas com especialistas que atuam por você',
  description:
    'Unimos tecnologia e atendimento personalizado para reduzir débitos e abrir caminho para recuperar seu crédito.',
  primaryCta: { label: 'Quero resolver minhas dívidas', href: '/#formulario' },
  secondaryCta: { label: 'Entenda como funciona', href: '#como-funciona' },
  highlights: [
    { label: 'Casos atendidos', value: '35 mil+' },
    { label: '+ de 2 mil acordos', value: 'fechados todos os meses' },
    { label: '+ de R$ 7 milhões', value: 'em descontos oferecidos todos os meses' }
  ]
};

export const trustSection = {
  title: 'Nosso Parceiros',
  description: 'Empresas com quem negociamos descontos e planos que cabem no seu bolso.',
  logos: Array.from({ length: 44 }, (_, index) => {
    const id = index + 1;
    const src = `/images/partners/N${id}.png`;
    return {
      name: `Parceiro ${id}`,
      src,
      alt: `Parceiro ${id}`
    };
  })
};

export const expertCare = {
  eyebrow: 'Suas finanças com tecnologia e sem complicação',
  title: 'Especialistas Cuidam, Você Relaxa',
  paragraphs: [
    'A Meu Nome OK é uma empresa de tecnologia dedicada a tornar sua vida financeira mais leve e previsível.',
    'Simples e sem sair de casa, você relaxa enquanto o seu caso é tratado por nossos especialistas.'
  ],
  highlights: [
    'Menos burocracia, zero preocupação e transparência em todos os passos!',
    'Assim, suas contas ficam em ordem, o bolso respira e o fim do mês deixa de ser um sufoco. Tudo isso com a agilidade que você precisa!'
  ]
};

export const benefits = {
  title: 'Você resolve em uma jornada desenhada para reduzir suas dívidas',
  description:
    'Reunimos tudo em um plano com desconto e parcelas leves, para sua vida financeira voltar aos trilhos.',
  items: [
    {
      title: 'Diagnóstico profissional',
      description: 'Mapeamos pendências e priorizamos a redução máxima da sua dívida.'
    },
    {
      title: 'Desconto consolidado',
      description: 'Transformamos seus débitos em um acordo único com desconto e valor mensal que cabe no bolso.'
    },
    {
      title: 'Acompanhamento total',
      description: 'Você recebe status semanal e tem apoio jurídico, se necessario.'
    }
  ]
};

export const steps = {
  title: 'Como funciona na prática',
  description: 'Processo transparente em quatro etapas com comunicação clara em cada passo.',
  items: [
    {
      step: 1,
      title: 'Envie suas dívidas',
      description:
        'Assim mapeamos valores, prazos, juros, parcelas e histórico de pagamentos para estruturar um plano de alívio imediato.'
    },
    {
      step: 2,
      title: 'Estratégia personalizada',
      description: 'Consolidamos suas dívidas em um plano único, com parcelas e prazo compatíveis com seu orçamento.'
    },
    {
      step: 3,
      title: 'Negociação assistida',
      description: 'Nossos especialistas buscam reduções agressivas e novas condições junto a credores.'
    },
    {
      step: 4,
      title: 'Pronto! Tudo resolvido!',
      description: 'Processo concluído! Dívida resolvida, bolso aliviado e você já pode voltar a ter uma vida sem restrições!'
    }
  ]
};

export const testimonials = {
  title: 'Histórias reais de quem voltou a ter crédito',
  items: [
    {
      name: 'Ana Cláudia, São Paulo/SP',
      role: 'Microempreendedora',
      image: '/images/testimonials/ana-claudia.jpg',
      content:
        'Consegui reduzir em 58% as dívidas do meu CNPJ e em menos de 15 dias já estava com o nome regularizado para voltar a comprar com fornecedores.'
    },
    {
      name: 'Ricardo Santos, Belo Horizonte/MG',
      role: 'Autônomo',
      image: '/images/testimonials/ricardo-santos.jpg',
      content:
        'Eu já tinha tentado renegociar sozinho sem sucesso. O Meu Nome OK cuidou de tudo e ainda parcelou o restante dentro do meu orçamento.'
    },
    {
      name: 'Mariana Lemos, Salvador/BA',
      role: 'Profissional liberal',
      image: '/images/testimonials/mariana-lemos.jpg',
      content:
        'Além de limpar meu nome, recebi orientação financeira para montar um plano e evitar novas restrições. Atendimento humano do início ao fim.'
    },
    {
      name: 'Francisca Andrade, Rio de Janeiro/RJ',
      role: 'Microempresária',
      image: '/images/testimonials/felipe-andrade.jpg',
      content:
        'Precisava liberar limite para o meu negócio crescer. Em três semanas, as negociações reduziram 48% do valor e pude investir novamente.'
    },
    {
      name: 'Patrícia Moura, Campinas/SP',
      role: 'Professora',
      image: '/images/testimonials/patricia-moura.jpg',
      content:
        'Sempre tive receio de negociar sozinha. A equipe cuidou de todos os contatos com os bancos e ainda me explicou cada cláusula do acordo.'
    },
    {
      name: 'Diana Nuñes, Fortaleza/CE',
      role: 'Empreendedora digital',
      image: '/images/testimonials/joao-victor.jpg',
      content:
        'Os especialistas encontraram erros em duas cobranças e conseguiram cancelá-las. Hoje acompanho tudo pelo painel e não fico mais no escuro.'
    },
    {
      name: 'Sílvia Rocha, Porto Alegre/RS',
      role: 'Consultora financeira',
      image: '/images/testimonials/silvia-rocha.jpg',
      content:
        'Indiquei para vários clientes. O Meu Nome OK negocia com empatia e mantém a gente informado em cada etapa, sem letras miúdas.'
    },
    {
      name: 'Marcelo Lima, Recife/PE',
      role: 'Gerente comercial',
      image: '/images/testimonials/marcelo-lima.jpg',
      content:
        'Fecharam um acordo com o banco que parecia impossível. Parcelas que cabem no bolso e suporte imediato quando precisei de documentação.'
    },
    {
      name: 'Moacir Carvalho, Brasília/DF',
      role: 'Advogado',
      image: '/images/testimonials/luana-carvalho.jpg',
      content:
        'O atendimento é realmente humano. Eles entenderam meu contexto, apresentaram alternativas e só avancei quando me senti seguro.'
    },
    {
      name: 'Roberta Farias, Manaus/AM',
      role: 'Empresária',
      image: '/images/testimonials/roberto-farias.jpg',
      content:
        'Tinha dívidas em diferentes estados e não conseguia acompanhar. Centralizaram tudo, negociaram descontos altos e cuidaram da baixa do protesto.'
    },
    {
      name: 'Fernando Almeida, Goiânia/GO',
      role: 'Profissional de marketing',
      image: '/images/testimonials/fernanda-almeida.jpg',
      content:
        'Recuperei meu score e já consegui outro financiamento. O suporte pós-acordo faz toda diferença para não cair nas mesmas armadilhas.'
    },
    {
      name: 'Camila Duarte, Florianópolis/SC',
      role: 'Designer autônoma',
      image: '/images/testimonials/camila-duarte.jpg',
      content:
        'Adorei poder falar com pessoas de verdade, sem robô. Recebi relatórios claros e finalmente consegui quitar as pendências com tranquilidade.'
    }
  ]
};

export const press = {
  title: 'Estamos na mídia',
  description:
    'Veículos que já contaram as histórias e resultados do Meu Nome OK. Clique nos logos para ver.',
  logos: [
    {
      name: 'GFama',
      src: '/images/press/9dae1b15-3c6e-460b-82e7-bfe5dd09e041 (1).png',
      alt: 'Logo GFama',
      href: 'https://gfama.com.br/lawtech-auxilia-brasileiros-na-transicao-de-devedor-para-consumidor/'
    },
    {
      name: 'globo.com',
      src: '/images/press/globo.jpg',
      alt: 'Logo globo.com',
      href: 'https://revistapegn.globo.com/conteudo-de-marca/pressworks/noticia/2024/12/lawtech-reduz-dividas-de-emprestimos-consignados-assegura-indenizacoes-de-ate-6-digitos-e-tornase-a-principal-salvacao-para-consumidores-endividados.ghtml'
    },
    {
      name: 'UOL',
      src: '/images/press/logo-uol-1024 (2).png',
      alt: 'Logo UOL',
      href: 'https://brasilagoraonline.com.br/noticias/2024/08/emprestimos-consignados-saiba-como-suspender-pagamentos-por-ate-180-dias/'
    },
    {
      name: 'Valor Econômico',
      src: '/images/press/logo-valor-economico-1024 (1).png',
      alt: 'Logo Valor Econômico',
      href: 'https://valor.globo.com/patrocinado/pressworks/noticia/2024/12/24/lawtech-reduz-dividas-de-emprestimos-consignados-assegura-indenizacoes-de-ate-6-digitos-e-tornase-a-principal-salvacao-para-consumidores-endividados.ghtml'
    },
    {
      name: 'Pequenas Empresas & Grandes Negócios',
      src: '/images/press/logo-pegn.png',
      alt: 'Logo PEGN',
      href: 'https://revistapegn.globo.com/conteudo-de-marca/pressworks/noticia/2024/12/lawtech-reduz-dividas-de-emprestimos-consignados-assegura-indenizacoes-de-ate-6-digitos-e-tornase-a-principal-salvacao-para-consumidores-endividados.ghtml'
    },
    {
      name: 'Gazeta do Estado',
      src: '/images/press/1678846716GS_250x90 (1).png',
      alt: 'Logo Gazeta do Estado',
      href: 'https://gazetadasemana.com.br/coluna/12474/emprestimos-consignados-uma-armadilha-financeira-para-muitos-brasileiros'
    },
    {
      name: 'É Pop na Web',
      src: '/images/press/logo-epop-na-web.png',
      alt: 'Logo É Pop na Web',
      href: 'https://epopnaweb.com.br/se-depender-da-empresa-meu-nome-ok-seu-salario-nunca-mais-vai-sofrer-descontos-de-emprestimos-consignados/'
    },
    {
      name: 'EgoBrazil',
      src: '/images/press/logo_22 (2).png',
      alt: 'Logo EgoBrazil',
      href: 'https://egobrazil.ig.com.br/o-maior-escritorio-juridico-do-brasil-que-esta-mudando-o-jogo-para-devedores-de-consignados/'
    }
  ]
};

export const faq = {
  title: 'Perguntas frequentes',
  items: [
    {
      question: 'Quanto tempo leva para meu nome ficar limpo?',
      answer:
        'Após o pagamento do acordo, o credor tem até 5 dias úteis para retirar a negativação. Monitoramos o processo e avisamos você assim que a regularização acontecer.'
    },
    {
      question: 'Vocês garantem redução no valor da dívida?',
      answer:
        'Cada caso é analisado individualmente. Nossos especialistas usam histórico de acordos com bancos e empresas para buscar as melhores condições, sempre com transparência.'
    },
    {
      question: 'O serviço atende pessoas jurídicas?',
      answer:
        'Sim. Atuamos com CPF e CNPJ, oferecendo planos específicos para empresas que precisam normalizar o crédito rapidamente.'
    },
    {
      question: 'Existe custo para iniciar o processo?',
      answer:
        'Todos os serviços disponíveis são cobrados. Porém, os preços são acessíveis e temos condições facilitadas de pagamentos.'
    },
    {
      question: 'O que é o "plano único com desconto"?',
      answer:
        'É a forma de juntar suas pendências em um só plano, com parcela fixa que cabe no seu bolso e prazo para começar a pagar.'
    },
    {
      question: 'Preciso estar negativado para usar o serviço?',
      answer:
        'Não. O plano serve para organizar pendências e proteger seu orçamento, esteja você negativado ou não.'
    },
    {
      question: 'Tenho consignado. Posso participar?',
      answer:
        'Sim. Avaliamos seu contracheque, descontos e prazos para definir uma parcela sustentável.'
    },
    {
      question: 'Onde acompanho meu caso?',
      answer:
        'Você recebe atualizações semanais e tem histórico de etapas e documentos em um painel seguro.'
    },
    {
      question: 'Meu score vai subir?',
      answer:
        'Ao regularizar suas dívidas, seu score de crédito tende a subir, facilitando a aprovação de financiamentos com juros menores.'
    },
    {
      question: 'Vocês entram em contato com meus familiares?',
      answer:
        'Não. A comunicação é direta com você, preservando sigilo e conformidade com a LGPD.'
    },
    {
      question: 'Vocês tratam dívidas de serviços (água, luz, telefone)?',
      answer:
        'Sim. Incluímos pendências essenciais no mapeamento para evitar corte e organizar prioridades.'
    },
    {
      question: 'Tenho ação judicial. Posso aderir?',
      answer:
        'Sim. Em alguns cenários, há apoio jurídico para orientar os próximos passos.'
    },
    {
      question: 'O plano inclui educação financeira?',
      answer:
        'Sim. Você recebe auto-conteúdo e dicas práticas para manter o orçamento sob controle.'
    }
  ]
};

export const uspHighlights = [
  {
    title: 'Equipe multidisciplinar',
    description: 'Consultores financeiros, advogados e negociadores dedicados a cada caso.'
  },
  {
    title: 'Tecnologia + humano',
    description: 'Dashboard seguro para acompanhar o status e suporte via WhatsApp, telefone e e-mail.'
  },
  {
    title: 'Atendimento nacional',
    description: 'Presença em todos os estados com negociação junto aos principais credores.'
  }
];
