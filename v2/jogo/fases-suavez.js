/* =============================================================================
   CapyCalculus · Módulo 7 — "SUA VEZ!" (15 exercícios + 12 check-ups da Edição Zen)
   6 fases jogáveis: 3 de exercícios do caderno (5 questões cada) e 3 de check-up
   (4 questões cada). Carregado ANTES de app.js; estende window.CapyLessons.
   ============================================================================= */
(function () {
  "use strict";

  var shuffle = function (options, id, answer) {
    var seed = 0;
    String(id).split("").forEach(function (c) { seed = (seed * 31 + c.charCodeAt(0)) | 0; });
    var arr = options.slice();
    for (var i = arr.length - 1; i > 0; i -= 1) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      var j = seed % (i + 1);
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  };

  function at(id, ref, prompt, answer, distractors, hint, ok, retry, difficulty) {
    var options = shuffle([answer].concat(distractors), id, answer);
    return {
      id: id,
      ref: ref,
      type: "choice",
      prompt: prompt,
      options: options,
      answer: answer,
      hint: hint,
      correct: ok || "Isso! Confira a resolução completa na Edição Zen.",
      retry: retry || "Ainda não. Refaça o passo intermediário e tente de novo.",
      difficulty: difficulty || "medium",
      official: false,
      suavez: true
    };
  }

  var F1 = [
    at("SV-1a", "Sua vez! · Indefinida Q1",
      "Calcule \\(\\displaystyle \\int (6x^2 - 4x + 5)\\,dx\\).",
      "\\(\\displaystyle 2x^3 - 2x^2 + 5x + C\\)",
      ["\\(\\displaystyle 2x^3 - 2x^2 + 5x\\)", "\\(\\displaystyle 3x^3 - 2x^2 + 5x + C\\)", "\\(\\displaystyle 2x^3 - 4x^2 + 5x + C\\)"],
      "Aplique a linearidade termo a termo e a regra da potência. Não esqueça a constante C.",
      "Correto! Cada termo foi integrado separadamente e o + C foi lembrado.", "easy"),
    at("SV-1b", "Sua vez! · Indefinida Q2",
      "Calcule \\(\\displaystyle \\int \\left(\\frac{3}{x} + 4\\cos x\\right)dx\\).",
      "\\(\\displaystyle 3\\ln|x| + 4\\sen x + C\\)",
      ["\\(\\displaystyle 3\\ln x + 4\\sen x + C\\)", "\\(\\displaystyle 3\\ln|x| - 4\\sen x + C\\)", "\\(\\displaystyle \\frac{3}{x^2} + 4\\sen x + C\\)"],
      "\\(\\int \\frac1x dx = \\ln|x| + C\\) e \\(\\int \\cos x\\,dx = \\sen x + C\\). O módulo é obrigatório.",
      "Isso! O valor absoluto no logaritmo e o sinal da integral do cosseno estão certos.", "easy"),
    at("SV-1c", "Sua vez! · Indefinida Q3",
      "Use substituição simples: \\(\\displaystyle \\int 3x^2(x^3+1)^5\\,dx\\).",
      "\\(\\displaystyle \\frac{(x^3+1)^6}{6} + C\\)",
      ["\\(\\displaystyle \\frac{(x^3+1)^5}{5} + C\\)", "\\(\\displaystyle \\frac{(x^3+1)^6}{6}\\)", "\\(\\displaystyle \\frac{(x^3+1)^6}{2} + C\\)"],
      "Faça u = x³ + 1: assim du = 3x² dx, que já está multiplicando. Depois divida pelo novo expoente 6.",
      "Muito bem! A substituição absorveu o fator 3x² e o expoente virou 6.", "medium"),
    at("SV-1d", "Sua vez! · Indefinida Q4",
      "Use substituição simples: \\(\\displaystyle \\int e^{3x}\\,dx\\).",
      "\\(\\displaystyle \\frac{e^{3x}}{3} + C\\)",
      ["\\(\\displaystyle 3e^{3x} + C\\)", "\\(\\displaystyle e^{3x} + C\\)", "\\(\\displaystyle \\frac{e^{x}}{3} + C\\)"],
      "Com u = 3x temos dx = du/3. Logo, o fator 1/3 acompanha a exponencial.",
      "Correto! A derivada do expoente (3) aparece dividindo." , "easy"),
    at("SV-1e", "Sua vez! · Indefinida Q5",
      "Aplique integração por partes: \\(\\displaystyle \\int x e^x\\,dx\\).",
      "\\(\\displaystyle xe^x - e^x + C\\)",
      ["\\(\\displaystyle xe^x + C\\)", "\\(\\displaystyle xe^x + e^x + C\\)", "\\(\\displaystyle xe^x - e^x\\)"],
      "Pela ordem LIATE, tome u = x (algébrica) e dv = e^x dx (exponencial): ∫u dv = uv − ∫v du.",
      "Isso! uv − ∫v du = xe^x − e^x + C.", "medium")
  ];

  var F2 = [
    at("SV-2a", "Sua vez! · Definida Q1",
      "Calcule \\(\\displaystyle \\int_0^3 (2x+1)\\,dx\\).",
      "\\(12\\)", ["\\(9\\)", "\\(10\\)", "\\(18\\)"],
      "A primitiva é F(x) = x² + x. Aplique F(3) − F(0).",
      "Correto: (9 + 3) − 0 = 12.", "easy"),
    at("SV-2b", "Sua vez! · Definida Q2",
      "Calcule \\(\\displaystyle \\int_1^2 \\left(3x^2 - \\frac{2}{x^2}\\right)dx\\).",
      "\\(6\\)", ["\\(9\\)", "\\(3\\)", "\\(7\\)"],
      "Reescreva −2/x² = −2x⁻²: a primitiva é x³ + 2/x. Avalie de 1 a 2.",
      "Isso! (8 + 1) − (1 + 2) = 6.", "medium"),
    at("SV-2c", "Sua vez! · Definida Q3",
      "Calcule \\(\\displaystyle \\int_0^{\\pi/2} \\cos x\\,dx\\).",
      "\\(1\\)", ["\\(0\\)", "\\(-1\\)", "\\(\\dfrac{\\pi}{2}\\)"],
      "A primitiva de cos x é sen x. Calcule sen(π/2) − sen(0).",
      "Correto: 1 − 0 = 1.", "easy"),
    at("SV-2d", "Sua vez! · Definida Q4",
      "Use a aditividade: \\(\\displaystyle \\int_0^3 |x-2|\\,dx\\).",
      "\\(\\dfrac{5}{2}\\)", ["\\(2\\)", "\\(3\\)", "\\(\\dfrac{1}{2}\\)"],
      "Quebre em x = 2: integre −(x−2) de 0 a 2 e +(x−2) de 2 a 3. Some as duas áreas (triângulos).",
      "Muito bem: 2 + 1/2 = 5/2.", "hard"),
    at("SV-2e", "Sua vez! · Definida Q5",
      "Troque os limites: \\(\\displaystyle \\int_0^2 2x(x^2+1)^2\\,dx\\).",
      "\\(\\dfrac{124}{3}\\)", ["\\(\\dfrac{125}{3}\\)", "\\(\\dfrac{124}{6}\\)", "\\(41\\)"],
      "Com u = x² + 1, os limites viram u(0) = 1 e u(2) = 5. Integre u² de 1 a 5.",
      "Correto! (125 − 1)/3 = 124/3.", "medium")
  ];

  var F3 = [
    at("SV-3a", "Sua vez! · Aplicações Q1",
      "Calcule a área sob \\(f(x)=3x^2\\) no intervalo \\([1,3]\\).",
      "\\(26\\)", ["\\(27\\)", "\\(1\\)", "\\(\\dfrac{26}{3}\\)"],
      "A função é não negativa no intervalo: A = ∫₁³ 3x² dx = [x³]₁³.",
      "Isso! 27 − 1 = 26.", "easy"),
    at("SV-3b", "Sua vez! · Aplicações Q2",
      "Área entre \\(f(x)=4-x^2\\) e \\(g(x)=3\\).",
      "\\(\\dfrac{4}{3}\\)", ["\\(\\dfrac{2}{3}\\)", "\\(\\dfrac{8}{3}\\)", "\\(4\\)"],
      "Interseções em x = ±1. Integre (4 − x²) − 3 = 1 − x² de −1 a 1.",
      "Correto! A área é 4/3.", "hard"),
    at("SV-3c", "Sua vez! · Aplicações Q3",
      "Valor médio de \\(f(x)=3x^2\\) em \\([0,2]\\).",
      "\\(4\\)", ["\\(8\\)", "\\(2\\)", "\\(\\dfrac{8}{3}\\)"],
      "Use f_méd = (1/(b−a))∫ₐᵇ f(x)dx = (1/2)∫₀² 3x² dx.",
      "Muito bem: (1/2)·8 = 4.", "medium"),
    at("SV-3d", "Sua vez! · Aplicações Q4",
      "A vazão é \\(Q(t)=6t+2\\) m³/h. Volume acumulado entre \\(t=0\\) e \\(t=3\\) h.",
      "\\(33\\ \\text{m}^3\\)", ["\\(30\\ \\text{m}^3\\)", "\\(27\\ \\text{m}^3\\)", "\\(\\dfrac{33}{2}\\ \\text{m}^3\\)"],
      "Integre a taxa: V = ∫₀³ (6t + 2) dt = [3t² + 2t]₀³.",
      "Correto: 27 + 6 = 33 m³.", "medium"),
    at("SV-3e", "Sua vez! · Aplicações Q5",
      "Uma cultura cresce como \\(y(t)=200e^{0,5t}\\). Qual é \\(y(4)\\)?",
      "\\(200e^{2}\\)", ["\\(200e^{0,5}\\)", "\\(100e^{2}\\)", "\\(200e^{4}\\)"],
      "Substitua t = 4: 0,5 · 4 = 2. Portanto y(4) = 200e².",
      "Isso! O expoente é 2.", "easy")
  ];

  var F4 = [
    at("CK-4a", "Check-up · Indefinida Q1",
      "Qual é \\(\\displaystyle \\int \\sen(x)\\,dx\\)?",
      "\\(\\displaystyle -\\cos(x) + C\\)",
      ["\\(\\displaystyle \\cos(x) + C\\)", "\\(\\displaystyle \\sec^2(x) + C\\)", "\\(\\displaystyle -\\sen(x) + C\\)"],
      "Cuidado com o sinal: a derivada de \\(\\cos(x)\\) é \\(-\\sen(x)\\).",
      "Isso! \\((\\cos x)' = -\\sen x\\), logo a primitiva de \\(\\sen x\\) é \\(-\\cos x\\).",
      "A resposta certa tem o sinal trocado? Lembre: derivada de cos é −sen, então ∫sen dx = −cos + C.",
      "easy"),
    at("CK-4b", "Check-up · Indefinida Q2",
      "Em \\(\\displaystyle \\int x^2\\ln(x)\\,dx\\), pelo critério LIATE, quem deve ser \\(u\\) na integração por partes?",
      "\\(u = \\ln(x)\\)",
      ["\\(u = x^2\\)", "\\(u = x^2\\ln(x)\\)", "\\(u = 1/x\\)"],
      "Observe as iniciais de LIATE: L = Logarítmica vem antes de A = Algébrica.",
      "Correto! Na ordem LIATE, o L (logarítmica) tem prioridade sobre o A (algébrica).",
      "Na palavra LIATE, o \"L\" vem antes do \"A\" — e não sabemos integrar ln(x) diretamente como dv.",
      "medium"),
    at("CK-4c", "Check-up · Indefinida Q3",
      "No PVI \\(y' = 2x\\) com \\(y(1) = 5\\), qual é a constante C em \\(y(x) = x^2 + C\\)?",
      "\\(C = 4\\)",
      ["\\(C = 5\\)", "\\(C = 1\\)", "\\(C = 6\\)"],
      "Substitua x = 1: \\(1 + C = 5\\).",
      "Isso! \\(1^2 + C = 5 \\Rightarrow C = 4\\).",
      "C só é igual a y₀ quando x₀ = 0. Aqui x₀ = 1, então 1 + C = 5.",
      "medium"),
    at("CK-4d", "Check-up · Indefinida Q4",
      "Com \\(u = 3x - 2\\) em \\(\\displaystyle \\int (3x-2)^4\\,dx\\), o que substitui \\(dx\\)?",
      "\\(\\dfrac{du}{3}\\)",
      ["\\(du\\)", "\\(3\\,du\\)", "\\(-3\\,du\\)"],
      "Calcule \\(du = 3\\,dx\\) e isole dx.",
      "Correto! \\(dx = du/3\\).",
      "Como du = 3 dx, o fator 3 passa dividindo ao isolar dx — não multiplicando.",
      "medium")
  ];

  var F5 = [
    at("CK-5a", "Check-up · Definida Q1",
      "Quanto vale \\(\\displaystyle \\int_{10}^{10} \\ln(x^2)\\,dx\\)?",
      "\\(0\\)",
      ["\\(\\ln(100)\\)", "\\(1\\)", "\\(20\\ln(10)\\)"],
      "Observe os limites inferior e superior.",
      "Isso! Limites coincidentes ⇒ intervalo de largura nula ⇒ integral zero.",
      "Sempre que a = b, a integral definida vale 0 — não importa o integrando.",
      "easy"),
    at("CK-5b", "Check-up · Definida Q2",
      "Se \\(\\displaystyle \\int_2^5 f(x)\\,dx = 9\\), quanto vale \\(\\displaystyle \\int_5^2 f(x)\\,dx\\)?",
      "\\(-9\\)",
      ["\\(9\\)", "\\(0\\)", "\\(1/9\\)"],
      "Inverter os limites troca o sinal da integral.",
      "Correto! \\(\\int_b^a f\\,dx = -\\int_a^b f\\,dx\\).",
      "A inversão de limites multiplica a integral por −1: 9 vira −9.",
      "easy"),
    at("CK-5c", "Check-up · Definida Q3",
      "Para \\(\\displaystyle \\int_{-1}^{2} |x-1|\\,dx\\), em que ponto c devemos dividir o intervalo?",
      "\\(c = 1\\)",
      ["\\(c = 0\\)", "\\(c = -1\\)", "\\(c = 2\\)"],
      "Onde a expressão dentro do módulo muda de sinal?",
      "Isso! \\(x - 1 = 0\\) em \\(x = 1\\).",
      "O módulo muda de comportamento exatamente onde x − 1 = 0, ou seja, em x = 1.",
      "medium"),
    at("CK-5d", "Check-up · Definida Q4",
      "Pelo TFC (Parte 2), com \\(F'(x) = f(x)\\) contínua, \\(\\displaystyle \\int_a^b f(x)\\,dx\\) vale:",
      "\\(F(b) - F(a)\\)",
      ["\\(F(a) - F(b)\\)", "\\(f(b) - f(a)\\)", "\\(F'(b) - F'(a)\\)"],
      "Avalie a primitiva F no limite superior menos no inferior.",
      "Correto! Encontra-se F primeiro; depois \\(F(b) - F(a)\\).",
      "Cuidado: avalia-se a primitiva F nos extremos, não a própria função f.",
      "easy")
  ];

  var F6 = [
    at("CK-6a", "Check-up · Aplicações Q1",
      "Se \\(f(x) < 0\\) em \\([1,4]\\) e \\(\\displaystyle \\int_1^4 f(x)\\,dx = -7\\), qual é a área geométrica?",
      "\\(7\\)",
      ["\\(-7\\)", "\\(0\\)", "\\(3\\)"],
      "Área geométrica nunca é negativa: \\(A = -\\int_1^4 f(x)\\,dx\\).",
      "Isso! \\(A = |-7| = 7\\).",
      "A integral deu −7 porque a curva está abaixo do eixo; a área é |−7| = 7.",
      "easy"),
    at("CK-6b", "Check-up · Aplicações Q2",
      "Área entre f (superior) e g (inferior) em \\([a,b]\\): qual integral montar?",
      "\\(\\displaystyle \\int_a^b [f(x) - g(x)]\\,dx\\)",
      ["\\(\\displaystyle \\int_a^b [f(x) + g(x)]\\,dx\\)", "\\(\\displaystyle \\int_a^b [g(x) - f(x)]\\,dx\\)", "\\(\\displaystyle \\int_a^b f(x)\\cdot g(x)\\,dx\\)"],
      "Subtraia sempre a curva de baixo da curva de cima.",
      "Correto! Assim o integrando é não negativo em todo o intervalo.",
      "Subtraindo g de f garantimos f(x) − g(x) ≥ 0: área correta.",
      "easy"),
    at("CK-6c", "Check-up · Aplicações Q3",
      "Qual é a fórmula do valor médio de f contínua em \\([a,b]\\)?",
      "\\(\\displaystyle \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx\\)",
      ["\\(\\displaystyle (b-a)\\int_a^b f(x)\\,dx\\)", "\\(\\displaystyle \\dfrac{f(b)-f(a)}{b-a}\\)", "\\(\\displaystyle \\int_a^b f(x)\\,dx\\)"],
      "Divida a integral pela largura \\((b - a)\\) da base.",
      "Isso! Área acumulada dividida pela largura do intervalo.",
      "O valor médio divide a integral por (b − a); a variante com f(b) − f(a) é a taxa média de variação.",
      "medium"),
    at("CK-6d", "Check-up · Aplicações Q4",
      "No modelo \\(y(t) = y_0 e^{kt}\\), o que indica \\(k < 0\\)?",
      "Decaimento exponencial (a quantidade diminui com o tempo)",
      ["Crescimento acelerado", "Quantidade inicial negativa", "Equilíbrio constante"],
      "Observe o sinal do expoente kt quando t > 0 aumenta.",
      "Correto! \\(e^{kt}\\) decresce continuamente para zero.",
      "Com k < 0 e t > 0, \\(e^{kt} = 1/e^{|k|t}\\) diminui — decaimento típico de populações e radioatividade.",
      "easy")
  ];

  function fase(id, numero, titulo, tema, explanation, objective, bank, imagem) {
    return {
      id: id,
      moduleId: "m7",
      title: titulo,
      duration: Math.max(4, Math.ceil(bank.length / 2)),
      explanation: explanation,
      objective: objective,
      list: {
        number: numero, total: 6, phase: numero, phases: 6,
        theme: tema, questions: [], suavez: true, imagem: imagem
      },
      bank: bank,
      imagemExplicacao: imagem
    };
  }

  var lessons = [
    fase("m7-1", 1, "Sua vez! · Integral Indefinida (5 exercícios)",
      "Primitivas, substituição e integração por partes",
      "Os cinco exercícios do bloco “Sua vez!” da Edição Zen: linearidade, tabela de integrais imediatas, substituição simples (duas questões) e integração por partes pelo critério LIATE. Todas as respostas incluem a constante C.",
      "Rever os cinco exercícios já resolvidos no caderno, agora no formato de múltipla escolha.",
      F1, "assets/explicacao-m7-1.png"),
    fase("m7-2", 2, "Sua vez! · Integral Definida (5 exercícios)",
      "TFC, propriedades e substituição com troca de limites",
      "Os cinco exercícios do bloco “Sua vez!” da Edição Zen: TFC, regra da potência com expoente negativo, integral de cosseno, aditividade com módulo e substituição com troca de limites.",
      "Conferir o valor exato de cada integral definida usando o Teorema Fundamental do Cálculo.",
      F2, "assets/explicacao-m7-2.png"),
    fase("m7-3", 3, "Sua vez! · Aplicações (5 exercícios)",
      "Área, valor médio, acumulação e modelo exponencial",
      "Os cinco exercícios do bloco “Sua vez!” da Edição Zen: área sob curva, área entre curvas, valor médio, volume a partir da vazão e crescimento bacteriano exponencial.",
      "Aplicar a integral definida a grandezas físicas e biológicas.",
      F3, "assets/explicacao-m7-3.png"),
    fase("m7-4", 4, "Check-up · Integral Indefinida (4 questões)",
      "Quatro perguntas rápidas sobre conceitos-chave",
      "O check-up de aprendizagem da Edição Zen: integral de sen(x) com o sinal correto, escolha de u pelo critério LIATE, constante C de um problema de valor inicial e a substituição dx = du/3.",
      "Conferir em minutos os conceitos essenciais da integral indefinida.",
      F4, "assets/explicacao-m7-4.png"),
    fase("m7-5", 5, "Check-up · Integral Definida (4 questões)",
      "Propriedades e Teorema Fundamental do Cálculo",
      "O check-up de aprendizagem da Edição Zen: limites coincidentes, inversão de limites trocando o sinal, quebra do módulo em x = 1 e o TFC avaliando F(b) − F(a).",
      "Conferir as propriedades da integral definida e o TFC.",
      F5, "assets/explicacao-m7-5.png"),
    fase("m7-6", 6, "Check-up · Aplicações (4 questões)",
      "Áreas, valor médio e modelo exponencial",
      "O check-up de aprendizagem da Edição Zen: área com a curva abaixo do eixo, área entre curvas pela diferença f − g, fórmula do valor médio e o significado de k < 0 no crescimento exponencial.",
      "Conferir as aplicações da integral definida.",
      F6, "assets/explicacao-m7-6.png")
  ];

  var module = {
    id: "m7",
    number: "07",
    title: "Sua vez! — exercícios da Edição Zen",
    shortTitle: "Sua vez!",
    kind: "Exercícios do caderno",
    units: lessons.map(function (l) {
      return { id: l.id, title: l.title, duration: l.duration, description: l.objective };
    })
  };

  window.CapySuavez = Object.freeze({ module: module, lessons: lessons });
  window.CapyLessons = Object.freeze((window.CapyLessons || []).concat(lessons));
})();
