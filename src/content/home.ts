export const hero = {
  eyebrow: 'Renegociação humanizada',
  title: 'Limpe seu nome com especialistas que negociam por você',
  description:
    'Unimos tecnologia e atendimento personalizado para reduzir dívidas e recuperar seu crédito em poucos dias.',
  primaryCta: { label: 'Quero negociar minhas dívidas', href: '#formulario' },
  secondaryCta: { label: 'Entenda como funciona', href: '#como-funciona' },
  highlights: [
    { label: 'Casos atendidos', value: '35 mil+' },
    { label: 'Índice médio de redução', value: '62%' },
    { label: 'Tempo médio de resposta', value: '24h' }
  ]
};

export const trustSection = {
  title: 'Parceiros que confiam no Meu Nome OK',
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

export const benefits = {
  title: 'Você resolve em uma jornada desenhada para reduzir suas dívidas',
  description:
    'Mapeamos suas restrições, negociamos com credores e acompanhamos cada etapa até a atualização no seu CPF ou CNPJ.',
  items: [
    {
      title: 'Diagnóstico gratuito',
      description: 'Levantamos todas as pendências e priorizamos as negociações com maior impacto na sua pontuação.'
    },
    {
      title: 'Negociação ativa',
      description: 'Nossa equipe fala diretamente com bancos e empresas credoras para chegar ao acordo mais vantajoso.'
    },
    {
      title: 'Acompanhamento total',
      description: 'Você recebe atualizações semanais e apoio jurídico caso precise contestar cobranças indevidas.'
    }
  ]
};

export const steps = {
  title: 'Como funciona na prática',
  description: 'Processo transparente em quatro etapas com comunicação clara em cada passo.',
  items: [
    {
      step: 1,
      title: 'Cadastro e análise',
      description: 'Você envia seus dados no formulário seguro e autorizamos a consulta nos órgãos de proteção ao crédito.'
    },
    {
      step: 2,
      title: 'Estratégia personalizada',
      description: 'Montamos um plano priorizando créditos com maior urgência e simulações de pagamento.'
    },
    {
      step: 3,
      title: 'Negociação assistida',
      description: 'Especialistas negociam diretamente com credores buscando reduções agressivas e novas condições.'
    },
    {
      step: 4,
      title: 'Quitação e comprovação',
      description: 'Você recebe o acordo final, realiza o pagamento e acompanhamos a baixa até o nome limpo.'
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
        'Não. O diagnóstico inicial é gratuito. Somente após aceitarmos o acordo negociado é que as condições de pagamento são apresentadas.'
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
