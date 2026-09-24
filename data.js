/* CapyCalculus — dados versionados do protótipo.
 * Conteúdo matemático: exemplos didáticos já presentes nas apostilas MAT 146.
 * Os modelos contextuais usam números fictícios e não são recomendações técnicas.
 */
(function () {
  "use strict";

  const courses = [
    {
      slug: "administracao",
      name: "Administração",
      shortName: "ADM",
      guide: "Marina, a gerente",
      context: "vendas por camadas",
      iconLabel: "A",
      formula: "V(t) = (0,2t² + 5)³",
      derivative: "1,2t(0,2t² + 5)²",
      inner: "u = 0,2t² + 5",
      innerDerivative: "u′ = 0,4t",
      outer: "V = u³",
      outerDerivative: "3u²",
      prompt: "O modelo fictício de vendas do curso é V(t) = (0,2t² + 5)³. Qual é V′(t)?"
    },
    {
      slug: "agronegocio",
      name: "Agronegócio",
      shortName: "AGR",
      guide: "Seu Tonho, do armazém",
      context: "biomassa por camadas",
      iconLabel: "A",
      formula: "H(t) = (0,2t² + 8)³",
      derivative: "1,2t(0,2t² + 8)²",
      inner: "u = 0,2t² + 8",
      innerDerivative: "u′ = 0,4t",
      outer: "H = u³",
      outerDerivative: "3u²",
      prompt: "O modelo fictício de altura da biomassa é H(t) = (0,2t² + 8)³. Qual é H′(t)?"
    },
    {
      slug: "agronomia",
      name: "Agronomia",
      shortName: "AGR",
      guide: "Zé, o agrônomo",
      context: "volume de água no tanque",
      iconLabel: "A",
      formula: "V(t) = (2t + 1)³",
      derivative: "6(2t + 1)²",
      inner: "u = 2t + 1",
      innerDerivative: "u′ = 2",
      outer: "V = u³",
      outerDerivative: "3u²",
      prompt: "O volume didático do tanque é V(t) = (2t + 1)³. Qual é V′(t)?"
    },
    {
      slug: "arquitetura-urbanismo",
      name: "Arquitetura e Urbanismo",
      shortName: "ARQ",
      guide: "Lina, a arquiteta",
      context: "variação da iluminação",
      iconLabel: "A",
      formula: "L(x) = 100/(0,5x + 1)²",
      derivative: "−100/(0,5x + 1)³",
      inner: "u = 0,5x + 1",
      innerDerivative: "u′ = 0,5",
      outer: "L = 100u⁻²",
      outerDerivative: "−200u⁻³",
      prompt: "A iluminação é modelada por L(x) = 100/(0,5x + 1)². Qual é L′(x)?"
    },
    {
      slug: "ciencia-tecnologia-laticinios",
      name: "Ciência e Tecnologia de Laticínios",
      shortName: "LAC",
      guide: "Dona Cida, do Laticínio fictício",
      context: "resfriamento de um lote",
      iconLabel: "L",
      formula: "T(t) = 22 + 48e^(−0,15t)",
      derivative: "−7,2e^(−0,15t)",
      inner: "u = −0,15t",
      innerDerivative: "u′ = −0,15",
      outer: "T = 22 + 48e^u",
      outerDerivative: "48e^u",
      prompt: "O modelo didático de resfriamento é T(t) = 22 + 48e^(−0,15t). Qual é T′(t)?"
    },
    {
      slug: "ciencias-biologicas-bacharelado",
      name: "Ciências Biológicas — Bacharelado",
      shortName: "BIO",
      guide: "Bia, a bióloga de campo",
      context: "decaimento de serrapilheira",
      iconLabel: "B",
      formula: "M(t) = 200e^(−0,05t)",
      derivative: "−10e^(−0,05t)",
      inner: "u = −0,05t",
      innerDerivative: "u′ = −0,05",
      outer: "M = 200e^u",
      outerDerivative: "200e^u",
      prompt: "A massa de uma serrapilheira segue o modelo fictício M(t) = 200e^(−0,05t). Qual é M′(t)?"
    },
    {
      slug: "ciencias-biologicas-licenciatura",
      name: "Ciências Biológicas — Licenciatura",
      shortName: "LIC",
      guide: "Prof. Bio",
      context: "decaimento de massa",
      iconLabel: "L",
      formula: "M(t) = 200e^(−0,05t)",
      derivative: "−10e^(−0,05t)",
      inner: "u = −0,05t",
      innerDerivative: "u′ = −0,05",
      outer: "M = 200e^u",
      outerDerivative: "200e^u",
      prompt: "O modelo fictício de massa é M(t) = 200e^(−0,05t). Qual é M′(t)?"
    },
    {
      slug: "ciencias-contabeis",
      name: "Ciências Contábeis",
      shortName: "CON",
      guide: "Contador Paulo",
      context: "despesa por camadas",
      iconLabel: "C",
      formula: "D(x) = (5x² − 3)⁴",
      derivative: "40x(5x² − 3)³",
      inner: "u = 5x² − 3",
      innerDerivative: "u′ = 10x",
      outer: "D = u⁴",
      outerDerivative: "4u³",
      prompt: "A despesa é descrita pelo modelo fictício D(x) = (5x² − 3)⁴. Qual é D′(x)?"
    },
    {
      slug: "cooperativismo",
      name: "Cooperativismo",
      shortName: "COO",
      guide: "Assembleia da cooperativa fictícia",
      context: "crescimento patrimonial por camadas",
      iconLabel: "C",
      formula: "P(t) = (0,2t² + 10)⁴",
      derivative: "1,6t(0,2t² + 10)³",
      inner: "u = 0,2t² + 10",
      innerDerivative: "u′ = 0,4t",
      outer: "P = u⁴",
      outerDerivative: "4u³",
      prompt: "O patrimônio é modelado didaticamente por P(t) = (0,2t² + 10)⁴. Qual é P′(t)?"
    },
    {
      slug: "engenharia-florestal",
      name: "Engenharia Florestal",
      shortName: "ENF",
      guide: "Guarda Rafa da Mata fictícia",
      context: "DAP e área basal",
      iconLabel: "E",
      formula: "A(d) = 0,00007854d², com d = 2t + 10",
      derivative: "0,00031416(2t + 10)",
      inner: "u = d = 2t + 10",
      innerDerivative: "u′ = 2",
      outer: "A = 0,00007854u²",
      outerDerivative: "0,00015708u",
      prompt: "Se A(d) = 0,00007854d² e d = 2t + 10, qual é dA/dt?"
    },
    {
      slug: "zootecnia",
      name: "Zootecnia",
      shortName: "ZOO",
      guide: "Vaquera Ana, do curral fictício",
      context: "consumo por camadas",
      iconLabel: "Z",
      formula: "C(t) = (0,5t² + 4)³",
      derivative: "3t(0,5t² + 4)²",
      inner: "u = 0,5t² + 4",
      innerDerivative: "u′ = t",
      outer: "C = u³",
      outerDerivative: "3u²",
      prompt: "O consumo segue o modelo didático C(t) = (0,5t² + 4)³. Qual é C′(t)?"
    }
  ];

  const topicAnchors = {
    administracao: { m1: "3-cap-0-kit-de-fundo-expandido", m2: "4-unidade-1-limites-e-continuidade", m3: "5-unidade-2-derivadas", m4: "6-unidade-3-aplicações-da-derivada", m5: "7-unidade-4-integrais" },
    agronegocio: { m1: "2-cap-0-kit-de-fundo-sua-caixa-de-ferramentas", m2: "3-unidade-1-limites-e-continuidade", m3: "4-unidade-2-derivadas", m4: "5-unidade-3-aplicações-da-derivada", m5: "6-unidade-4-integrais" },
    agronomia: { m1: "cap-0-kit-de-fundo-o-básico-que-a-escola-deixou-passar", m2: "unidade-1-limites-o-que-acontece-perto-de-um-ponto", m3: "unidade-2-derivadas-a-taxa-instantânea", m4: "unidade-3-aplicações-da-derivada-crescer-diminuir-e-otimizar", m5: "unidade-4-integrais-somar-fatias-e-somar-totais" },
    "arquitetura-urbanismo": { m1: "2-kit-de-fundo-o-básico-que-a-escola-deixou-passar", m2: "3-unidade-1-limites-o-que-acontece-perto-de-um-ponto", m3: "4-unidade-2-derivadas-a-taxa-instantânea", m4: "5-unidade-3-aplicações-da-derivada-crescer-diminuir-e-otimizar", m5: "6-unidade-4-integrais-somar-fatias-e-somar-totais" },
    "ciencia-tecnologia-laticinios": { m1: "capítulo-0-kit-de-fundo-os-4-remendos-que-resolvem-80-dos-travamentos", m2: "unidade-1-limites-o-que-acontece-perto-de-um-ponto-e-para-sempre", m3: "unidade-2-derivadas-a-taxa-instantânea-quão-rápido-agora", m4: "unidade-3-aplicações-da-derivada-crescer-diminuir-melhorar", m5: "unidade-4-integrais-somar-fatias-de-taxa-a-total" },
    "ciencias-biologicas-bacharelado": { m1: "capítulo-0-kit-de-fundo-os-4-remendos-que-resolvem-80-dos-travamentos", m2: "unidade-1-limites-o-que-acontece-perto-de-um-ponto-e-para-sempre", m3: "unidade-2-derivadas-a-taxa-instantânea-quão-rápido-agora", m4: "unidade-3-aplicações-da-derivada-crescer-diminuir-melhorar", m5: "unidade-4-integrais-somar-fatias-de-taxa-a-total" },
    "ciencias-biologicas-licenciatura": { m1: "capítulo-0-kit-de-fundo-os-4-remendos-que-resolvem-80-dos-travamentos", m2: "unidade-1-limites-o-que-acontece-perto-de-um-ponto-e-para-sempre", m3: "unidade-2-derivadas-a-taxa-instantânea-quão-rápido-agora", m4: "unidade-3-aplicações-da-derivada-crescer-diminuir-melhorar", m5: "unidade-4-integrais-somar-fatias-de-taxa-a-total" },
    "ciencias-contabeis": { m1: "capítulo-0-kit-de-fundo", m2: "unidade-1-limites-e-continuidade", m3: "unidade-2-derivadas", m4: "unidade-3-aplicações-da-derivada", m5: "unidade-4-integrais" },
    cooperativismo: { m1: "capítulo-0-kit-de-fundo-o-que-você-precisa-antes-do-limite", m2: "unidade-1-limites-e-continuidade", m3: "unidade-2-derivadas", m4: "unidade-3-aplicações-da-derivada", m5: "unidade-4-integrais" },
    "engenharia-florestal": { m1: "2-kit-de-fundo-o-básico-que-a-escola-deixou-passar", m2: "3-unidade-1-limites-o-que-acontece-perto-de-um-ponto", m3: "4-unidade-2-derivadas-a-taxa-instantânea", m4: "5-unidade-3-aplicações-da-derivada-crescer-diminuir-e-otimizar", m5: "6-unidade-4-integrais-somar-fatias-e-somar-totais" },
    zootecnia: { m1: "capítulo-0-kit-de-fundo-antes-do-cálculo", m2: "unidade-1-limites-e-continuidade", m3: "unidade-2-derivadas", m4: "unidade-3-aplicações-da-derivada", m5: "unidade-4-integrais" }
  };

  const modules = [
    {
      id: "m1",
      number: "01",
      title: "Pré-Cálculo & Funções Fundamentais",
      shortTitle: "Pré-Cálculo",
      description: "Ponte de entrada para ler, manipular e interpretar funções antes do limite.",
      units: [
        { id: "m1-1", title: "Álgebra que sustenta o Cálculo", duration: 4, kind: "Base" },
        { id: "m1-2", title: "Funções, domínio e imagem", duration: 4, kind: "Conceito" },
        { id: "m1-3", title: "Gráficos e transformações", duration: 5, kind: "Visual" },
        { id: "m1-4", title: "Composição e funções inversas", duration: 5, kind: "Aplicação" }
      ]
    },
    {
      id: "m2",
      number: "02",
      title: "Limites e Continuidade",
      shortTitle: "Limites",
      description: "Do movimento que se aproxima ao comportamento formal da função.",
      units: [
        { id: "m2-1", title: "A ideia intuitiva de limite", duration: 4, kind: "Visual" },
        { id: "m2-2", title: "Limites laterais e existência", duration: 5, kind: "Conceito" },
        { id: "m2-3", title: "Limites notáveis e técnicas", duration: 5, kind: "Prática" },
        { id: "m2-4", title: "Continuidade e descontinuidades", duration: 4, kind: "Conceito" }
      ]
    },
    {
      id: "m3",
      number: "03",
      title: "Derivadas e Regras de Derivação",
      shortTitle: "Derivadas",
      description: "Taxa instantânea, notação e regras que encadeiam processos.",
      units: [
        { id: "m3-1", title: "Derivada como taxa de variação", duration: 5, kind: "Visual" },
        { id: "m3-2", title: "Potência, soma, produto e quociente", duration: 5, kind: "Prática" },
        { id: "m3-3", title: "Regra da Cadeia", duration: 4, kind: "Missão jogável", featured: true },
        { id: "m3-4", title: "Trigonometria, exponencial e logaritmo", duration: 5, kind: "Prática" }
      ]
    },
    {
      id: "m4",
      number: "04",
      title: "Aplicações da Derivada",
      shortTitle: "Aplicações",
      description: "Interpretar, comparar, otimizar e prever taxas em modelos do curso.",
      units: [
        { id: "m4-1", title: "Taxa de variação e monotonicidade", duration: 4, kind: "Interpretação" },
        { id: "m4-2", title: "Pontos críticos e traçado de curvas", duration: 5, kind: "Aplicação" },
        { id: "m4-3", title: "Otimização e taxas relacionadas", duration: 5, kind: "Missão" },
        { id: "m4-4", title: "L’Hôpital e validação de modelos", duration: 5, kind: "Integração" }
      ]
    },
    {
      id: "m5",
      number: "05",
      title: "Integrais e Teorema Fundamental do Cálculo",
      shortTitle: "Integrais",
      description: "Acúmulo, antiderivadas e a ponte entre áreas, grandezas e variação.",
      units: [
        { id: "m5-1", title: "Integral como acúmulo", duration: 4, kind: "Visual" },
        { id: "m5-2", title: "Antiderivadas e substituição", duration: 5, kind: "Prática" },
        { id: "m5-3", title: "Integral definida e FTC", duration: 5, kind: "Conceito" },
        { id: "m5-4", title: "Áreas, unidades e EDO separável", duration: 5, kind: "Aplicação" }
      ]
    }
  ];

  const mechanics = [
    {
      id: "multiple-choice",
      label: "Escolha conceitual",
      description: "Reconhece gráficos, teoremas, propriedades e a função interna em uma composição."
    },
    {
      id: "order-build",
      label: "Arraste e monte",
      description: "Ordena os passos de uma demonstração, de um limite ou de uma solução."
    },
    {
      id: "find-error",
      label: "Encontre o erro",
      description: "Localiza a linha problemática, nomeia o tipo de erro e corrige."
    },
    {
      id: "pairing",
      label: "Associe pares",
      description: "Conecta funções às derivadas e funções aos gráficos."
    },
    {
      id: "fill-gap",
      label: "Preencha as lacunas",
      description: "Completa a Regra da Cadeia, substituição u e outras regras."
    },
    {
      id: "transfer",
      label: "Modele no curso",
      description: "Usa o mesmo conceito em uma situação contextual do curso selecionado."
    }
  ];

  const badges = [
    { id: 1, label: "Explorador de funções" },
    { id: 2, label: "Rastreador de limites" },
    { id: 3, label: "Corrente da cadeia" },
    { id: 4, label: "Arquiteto de derivadas" },
    { id: 5, label: "Acumulador de integrais" },
    { id: 6, label: "Liga de Newton" },
    { id: 7, label: "Mestre das integrais" },
    { id: 8, label: "Liga de Lagrange" },
    { id: 9, label: "Liga de Leibniz" },
    { id: 10, label: "Otimizador semanal" },
    { id: 11, label: "Revisor de erros" },
    { id: 12, label: "Escudo do time" }
  ];

  const feedback = {
    correct: [
      "Boa! O caminho matemático ficou claro.",
      "Isso! A corrente foi derivada por completo.",
      "Mandou bem — seu raciocínio está ganhando ritmo.",
      "Exato! Você conectou as duas camadas da função.",
      "Show! A derivada está no caminho certo.",
      "Isso! Uma vitória pequena e muito útil."
    ],
    retry: [
      "Quase! O Capivara sugere olhar a função interna.",
      "Ainda não — revise onde a variável externa muda.",
      "Boa tentativa. A pista é considerar u antes de derivar.",
      "Não tem problema. Tente mais uma vez sem perder XP."
    ],
    streak: [
      "A sequência ficou forte! A Capivara GP está acordada.",
      "Sua consistência virou ritmo matemático.",
      "Capivara em modo turbo, mas sem perder o controle."
    ]
  };

  window.CapyData = Object.freeze({
    version: "1.3.0",
    courses,
    topicAnchors,
    modules,
    mechanics,
    badges,
    feedback,
    lessonTitle: "Regra da Cadeia"
  });
})();
