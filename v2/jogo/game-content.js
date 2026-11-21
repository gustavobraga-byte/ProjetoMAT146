/* Conteúdo jogável do CapyCalculus.
 * As atividades usam a ementa MAT 146 e exemplos já presentes nas apostilas.
 * Contexto de curso: os valores contextuais são didáticos, nunca dados oficiais.
 */
(function () {
  "use strict";

  const choice = (id, prompt, options, answer, hint, correct, retry, contextual = false) => ({
    id,
    type: "choice",
    prompt,
    options,
    answer,
    hint,
    correct,
    retry,
    contextual
  });

  const bug = (id, prompt, options, answer, hint, correct, retry, contextual = false) => ({
    id,
    type: "bug",
    prompt,
    options,
    answer,
    hint,
    correct,
    retry,
    contextual
  });

  const fill = (id, prompt, fields, hint, correct, retry, contextual = false) => ({
    id,
    type: "fill",
    prompt,
    fields,
    hint,
    correct,
    retry,
    contextual
  });

  const order = (id, prompt, items, answer, hint, correct, retry, contextual = false) => ({
    id,
    type: "order",
    prompt,
    items,
    answer,
    hint,
    correct,
    retry,
    contextual
  });

  const pair = (id, prompt, pairs, hint, correct, retry, contextual = false) => ({
    id,
    type: "pair",
    prompt,
    pairs,
    hint,
    correct,
    retry,
    contextual
  });

  const lesson = (id, moduleId, title, duration, objective, explanation, activities) => ({
    id,
    moduleId,
    title,
    duration,
    objective,
    explanation,
    activities
  });

  const lessons = [
    lesson("m1-1", "m1", "Álgebra que sustenta o Cálculo", 4, "Manipular frações, sinais, potências e ordem de operações.", "A álgebra transforma uma frase de campo em uma conta que pode ser conferida passo a passo.", [
      fill("m1-1-a1", "Complete: 1/2 + 1/3 = [__]; x² · x³ = x^[__]; (x²)³ = x^[__].", [
        { id: "frac", label: "Soma das frações", options: ["5/6", "2/5", "3/6"], answer: 0 },
        { id: "mult", label: "Produto de potências", options: ["x⁵", "x⁶", "x⁸"], answer: 0 },
        { id: "pot", label: "Potência de potência", options: ["x⁶", "x⁵", "x⁹"], answer: 0 }
      ], "Igale os denominadores; na multiplicação, some expoentes.", "Você separou as três regras.", "Revise a ordem: fração, produto e potência têm regras diferentes."),
      bug("m1-1-a2", "Um colega escreveu 3 + 4 × 2 = 14. Qual é a correção?", ["3 + 4 × 2 = 11", "3 + 4 × 2 = 14", "3 + 4 = 7 × 2"], 0, "A multiplicação vem antes da soma.", "A ordem das operações foi aplicada corretamente.", "O resultado 14 trata a soma como se viesse primeiro."),
      choice("m1-1-a3", "Em um modelo didático, 50 kg/ha são aplicados em 4 ha. Qual é a massa total?", ["200 kg", "54 kg", "12,5 kg"], 0, "Multiplique dose por área; ha cancela.", "A unidade cancelou e a massa total foi encontrada.", "A dose e a área precisam ser multiplicadas, não somadas.", true)
    ]),
    lesson("m1-2", "m1", "Funções, domínio e imagem", 4, "Reconhecer entrada, saída, domínio e imagem.", "Uma função é uma máquina: o domínio diz o que pode entrar e a imagem diz o que ela entrega.", [
      choice("m1-2-a1", "Qual é o domínio de g(x) = 1/(x − 3)?", ["todos os reais, exceto x = 3", "x ≥ 3", "somente x > 0"], 0, "O denominador não pode ser zero.", "Você identificou a restrição do denominador.", "Procure qual valor anula o denominador."),
      pair("m1-2-a2", "Associe função e característica.", [
        { left: "f(x) = √(x − 2)", options: ["x ≥ 2", "x ≠ 3", "todos os reais"], answer: 0 },
        { left: "g(x) = 1/(x − 3)", options: ["x ≥ 2", "x ≠ 3", "todos os reais"], answer: 1 },
        { left: "y = 3x − 1", options: ["x ≥ 2", "x ≠ 3", "reta linear"], answer: 2 }
      ], "Raiz exige radicando não negativo; denominador exige valor não nulo.", "Você relacionou as três características.", "Confira a restrição de cada expressão."),
      choice("m1-2-a3", "No modelo didático C(p) = 90p/(p + 15), com p > 0, qual é o domínio de uso?", ["p > 0; o valor p = −15 está fora do uso", "todos os reais", "p = 0 apenas"], 0, "Separe o contexto físico do domínio algébrico.", "Você preservou o domínio de uso e a restrição da fração.", "A expressão tem um limite algébrico e um intervalo de uso; não são a mesma coisa.", true)
    ]),
    lesson("m1-3", "m1", "Gráficos e transformações", 5, "Relacionar expressão, gráfico e transformações.", "A fórmula descreve a curva; o gráfico mostra forma, posição e variação.", [
      pair("m1-3-a1", "Associe a função à família do gráfico.", [
        { left: "y = x²", options: ["parábola", "reta", "hipérbole"], answer: 0 },
        { left: "y = 3x − 1", options: ["parábola", "reta", "hipérbole"], answer: 1 },
        { left: "y = 1/x", options: ["parábola", "reta", "hipérbole"], answer: 2 }
      ], "Observe o grau e o denominador.", "Você reconheceu as famílias corretamente.", "A forma da expressão antecipa o desenho do gráfico."),
      choice("m1-3-a2", "A reta y = 2x foi transformada em f(x) = 2x + 5. O que aconteceu?", ["translação vertical de 5 para cima", "translação horizontal de 5", "multiplicação da reta por 5"], 0, "O termo 5 foi somado fora da função.", "Você leu a transformação no lugar certo.", "Compare o que foi somado dentro e fora de x."),
      choice("m1-3-a3", "No modelo didático C(p) = 90p/(p + 15), C(15) = 45 e C(30) = 60. O que o gráfico sugere?", ["a curva cresce e vai se suavizando, aproximando-se de 90", "a curva é linear", "a curva decresce"], 0, "A entrada dobra, mas a saída não dobra.", "Você reconheceu a saturação pelo gráfico.", "Compare a razão entre entradas e a diferença entre saídas.", true)
    ]),
    lesson("m1-4", "m1", "Composição e funções inversas", 5, "Compor funções na ordem correta e inverter funções lineares.", "Composição é passar a saída de uma função para a entrada de outra; a inversa desfaz essa máquina.", [
      order("m1-4-a1", "Para f(x) = x + 2 e g(x) = x², calcule f(g(3)) ordenando as etapas.", ["Avaliar g(3) = 9", "Avaliar f(9) = 11", "Concluir f(g(3)) = 11"], [0, 1, 2], "A função mais interna age primeiro.", "A ordem interna → externa foi respeitada.", "Comece pela função que está dentro dos parênteses."),
      fill("m1-4-a2", "Complete a inversa de f(x) = 2x + 5: y − 5 = 2x; f⁻¹(y) = [__].", [
        { id: "inverse", label: "Função inversa", options: ["(y − 5)/2", "(y + 5)/2", "2y − 5"], answer: 0 }
      ], "Isole x e troque o papel da entrada original pela saída y.", "Você trocou entrada e saída corretamente.", "Na inversa, a equação precisa ser resolvida para x."),
      choice("m1-4-a3", "No modelo didático V(t) = (2t + 1)³, qual é V(0)?", ["1", "0", "2"], 0, "Substitua t = 0 e calcule o cubo.", "A composição foi avaliada no instante correto.", "Derive a parte que ainda contém t antes de substituir.", true)
    ]),
    lesson("m2-1", "m2", "A ideia intuitiva de limite", 4, "Interpretar limites como tendências na vizinhança.", "O limite pergunta para onde a saída se aproxima quando a entrada chega perto de um valor.", [
      choice("m2-1-a1", "Qual frase descreve lim(x→a) f(x) = L?", ["f(x) aproxima-se de L quando x aproxima-se de a, mesmo que f(a) não exista", "exige f(a) = L", "x precisa atingir a"], 0, "Substitua “chegar” por “chegar perto”.", "Você separou limite e valor da função.", "O limite observa a vizinhança, não apenas o ponto."),
      order("m2-1-a2", "Use a tabela: P(2,99) = 5,98; P(2,999) = 5,998; P(3,001) = 6,002; P(3) = 0. O que o limite sugere?", ["Observar os dois lados de 3", "Ignorar o ponto isolado P(3) = 0", "Reconhecer a tendência próxima de 6", "Concluir lim(x→3) P(x) = 6"], [0, 1, 2, 3], "Um ponto isolado não cancela o padrão dos vizinhos.", "Você leu a tendência dos dois lados.", "Leia a tabela antes do valor isolado."),
      choice("m2-1-a3", "Para C(p) = 90p/(p + 15), p > 0, qual é lim(p→5) C(p)?", ["22,5", "90", "não existe"], 0, "A função está definida e contínua perto de 5.", "O limite coincide com o valor porque não há descontinuidade nesse ponto.", "Verifique se o denominador se anula antes de dividir.", true)
    ]),
    lesson("m2-2", "m2", "Limites laterais e existência", 5, "Calcular limites pela esquerda e pela direita.", "O limite bilateral existe quando as aproximações pela esquerda e pela direita chegam ao mesmo valor.", [
      order("m2-2-a1", "Ordene a análise de f(x) = 1/x quando x→0.", ["x→0+: denominador positivo e pequeno → +∞", "x→0−: denominador negativo e pequeno → −∞", "Os lados são diferentes", "Não existe limite bilateral"], [0, 1, 2, 3], "Analise o sinal do denominador em cada lado.", "Limites laterais diferentes impedem o bilateral.", "A mesma função muda de sinal conforme o lado."),
      bug("m2-2-a2", "Para f(x) = x se x ≠ 0 e f(0) = 1, um aluno disse que a função é contínua porque o limite existe. Qual é o erro?", ["o limite é 0, mas f(0) = 1; há descontinuidade removível", "o limite não existe", "f(0) deveria ser 0 apenas se x = 1"], 0, "Compare o limite com o valor definido no ponto.", "Você comparou limite e valor no ponto.", "Existência do limite não basta para continuidade."),
      choice("m2-2-a3", "No modelo didático q(t) = 20/(t − 2), qual é o limite lateral pela esquerda de 2?", ["−∞", "+∞", "10"], 0, "O denominador fica negativo e pequeno pela esquerda.", "Você identificou a parede vertical pela esquerda.", "Verifique o sinal do denominador para t < 2.", true)
    ]),
    lesson("m2-3", "m2", "Limites notáveis e técnicas", 5, "Escolher fatoração, substituição ou grau dos termos.", "A técnica deve ser escolhida pela forma que aparece no limite; 0/0 é um sinal para simplificar.", [
      order("m2-3-a1", "Ordene o cálculo de lim(x→5) (x² − 25)/(x − 5).", ["Substituir e obter 0/0", "Fatorar x² − 25 = (x − 5)(x + 5)", "Cancelar x − 5 para x ≠ 5", "Obter 5 + 5 = 10"], [0, 1, 2, 3], "Use a diferença de quadrados.", "Você fatorou antes de substituir.", "A indeterminação pede simplificação, não uma nova conta."),
      choice("m2-3-a2", "Qual é lim(x→∞) (3x² − x)/(2x² + 1)?", ["3/2", "0", "3"], 0, "Os graus são iguais; use a razão dos coeficientes líderes.", "Você escolheu a razão dos coeficientes principais.", "Confira os graus do numerador e do denominador."),
      choice("m2-3-a3", "Qual é lim(x→0) sen(x)/x, com x em radianos?", ["1", "0", "+∞"], 0, "É o limite notável da razão seno por x.", "Você reconheceu o limite notável.", "A unidade angular precisa estar em radianos.", true)
    ]),
    lesson("m2-4", "m2", "Continuidade e descontinuidades", 4, "Aplicar as três condições de continuidade e classificar descontinuidades.", "Continuidade exige três coisas: a função existe no ponto, o limite existe e os dois valores coincidem.", [
      bug("m2-4-a1", "Para f(x) = (x² − 9)/(x − 3), com f(3) = 0, o que acontece em x = 3?", ["lim = 6 e f(3) = 0; há um buraco removível", "lim = 0 e f(3) = 6", "a função é contínua"], 0, "Compare o limite com o valor definido.", "Você separou limite, valor e continuidade.", "A existência do limite não substitui a comparação com f(a)."),
      pair("m2-4-a2", "Associe o modelo ao comportamento.", [
        { left: "C(p) = 90p/(p + 15), p > 0", options: ["contínua no uso; horizont. y = 90", "assíntota vertical", "buraco removível"], answer: 0 },
        { left: "q(t) = 20/(t − 2)", options: ["contínua no uso; horizont. y = 90", "assíntota vertical em t = 2", "buraco removível"], answer: 1 },
        { left: "f(7) = 10, lim = 14", options: ["contínua no uso; horizont. y = 90", "assíntota vertical em t = 2", "descontinuidade removível"], answer: 2 }
      ], "Procure denominador nulo e compare limite com valor definido.", "Você separou continuidade, parede vertical e buraco.", "A mesma expressão pode ter comportamentos diferentes em pontos diferentes."),
      choice("m2-4-a3", "No modelo didático C(p) = 90p/(p + 15), p > 0, a função é contínua em todo o domínio de uso?", ["sim; p = −15 fica fora do uso", "não; é descontínua em todo p", "somente em p = 0"], 0, "A fração só falha quando o denominador zera.", "Você verificou continuidade no domínio correto.", "Não confunda intervalo de uso com denominador nulo.", true)
    ]),
    lesson("m3-1", "m3", "Derivada como taxa de variação", 5, "Distinguir valor acumulado, taxa média e taxa instantânea.", "A derivada é o velocímetro da função: a média percorre um intervalo; a derivada observa o instante.", [
      choice("m3-1-a1", "Se f′(x) > 0 em todo (a, b), o que é verdade?", ["f é crescente em (a, b)", "f é decrescente em (a, b)", "f é constante em (a, b)"], 0, "Inclinação positiva indica crescimento.", "Você relacionou o sinal da derivada à monotonicidade.", "O sinal da derivada descreve o sentido da curva."),
      choice("m3-1-a2", "Para h(t) = 0,4t² + 3t, qual é h′(15)?", ["15", "90", "12"], 0, "Derive termo a termo antes de substituir.", "Você calculou a taxa instantânea no instante correto.", "Não confunda h(15) com h′(15)."),
      bug("m3-1-a3", "Em um modelo florestal didático, V(15) = 187,5 m³ foi chamado de taxa de incremento. Qual é o erro?", ["V(15) é volume acumulado; a taxa é V′(15)", "V(15) já é uma derivada", "não existe taxa nesse modelo"], 0, "A unidade e o apóstrofo revelam a diferença.", "Você separou acumulado de taxa.", "Volume acumulado responde quanto há; derivada responde quão rápido.")
    ]),
    lesson("m3-2", "m3", "Potência, soma, produto e quociente", 5, "Identificar a regra estrutural antes de derivar.", "A potência baixa o expoente; a soma deriva termo a termo; o produto tem duas parcelas; o quociente tem subtração e denominador ao quadrado.", [
      fill("m3-2-a1", "Derive f(x) = 3x⁴ − 2x + 1 completando as parcelas.", [
        { id: "first", label: "Derivada de 3x⁴", options: ["12x³", "3x³", "12x"], answer: 0 },
        { id: "second", label: "Derivada de −2x", options: ["−2", "2", "−2x"], answer: 0 },
        { id: "third", label: "Derivada da constante", options: ["0", "1", "x"], answer: 0 }
      ], "Aplique a regra da potência e suma os resultados.", "Você derivou a função completa.", "A constante tem derivada zero."),
      choice("m3-2-a2", "Qual regra é mais direta para R(x) = x(50 − 0,5x)?", ["produto", "cadeia", "logaritmo"], 0, "Há dois fatores que dependem de x.", "Você identificou a estrutura antes de calcular.", "Observe quantos fatores dependem da variável."),
      choice("m3-2-a3", "Para R(x) = x(50 − 0,5x), qual é R′(20)?", ["30", "20", "0"], 0, "Derive: R′(x) = 50 − x.", "Você encontrou a taxa marginal no ponto.", "Confira o sinal do termo que envolve x.")
    ]),
    lesson("m3-3", "m3", "Regra da Cadeia", 4, "Decompor e multiplicar as camadas de uma função composta.", "A corrente tem duas etapas: derivamos a parte externa e multiplicamos pela parte interna.", [
      choice("m3-3-a1", "Na função V(t) = (2t + 1)³, qual é a função interna?", ["u = 2t + 1", "V = u³", "V′ = 6(2t + 1)²"], 0, "É o trecho que ainda contém diretamente t.", "A função interna recebe t e entrega u para a externa.", "A externa recebe u; o trecho com t é a interna."),
      fill("m3-3-a2", "Complete V′(t) = [externa] × [interna] = [resultado].", [
        { id: "outer", label: "Derivada externa", options: ["3u²", "2", "6(2t + 1)²"], answer: 0 },
        { id: "inner", label: "Derivada interna", options: ["3u²", "2", "6(2t + 1)²"], answer: 1 },
        { id: "result", label: "Resultado", options: ["3u²", "2", "6(2t + 1)²"], answer: 2 }
      ], "Derive a casca e o recheio separadamente.", "A corrente completa foi derivada.", "A derivada interna não pode ser esquecida.", true),
      bug("m3-3-a3", "1. u = 2t + 1. 2. V = u³. 3. V′ = 3u². 4. Concluir. Em qual linha a corrente foi perdida?", ["linha 3", "linha 1", "linha 2"], 0, "Depois da externa ainda falta a derivada da interna.", "Você localizou a regra perdida.", "A linha 3 derivou a casca, mas esqueceu o recheio."),
      pair("m3-3-a4", "Associe função e derivada.", [
        { left: "V(t) = (2t + 1)³", options: ["6(2t + 1)²", "3u²", "2"], answer: 0 },
        { left: "f(x) = sin(x)", options: ["cos(x)", "−sin(x)", "1"], answer: 0 },
        { left: "g(x) = eˣ", options: ["eˣ", "1/eˣ", "x eˣ"], answer: 0 }
      ], "O primeiro par exige cadeia; os outros usam regras básicas.", "Você conectou as funções às derivadas.", "Confira se o primeiro par tem a corrente completa.", true)
    ]),
    lesson("m3-4", "m3", "Trigonometria, exponencial e logaritmo", 5, "Aplicar regras de funções especiais e combinações com a cadeia.", "As funções especiais mantêm uma regra própria, mas continuam obedecendo à cadeia.", [
      pair("m3-4-a1", "Associe função e derivada.", [
        { left: "sin(x)", options: ["cos(x)", "−sin(x)", "1/x"], answer: 0 },
        { left: "cos(x)", options: ["cos(x)", "−sin(x)", "1/x"], answer: 1 },
        { left: "eˣ", options: ["cos(x)", "−sin(x)", "eˣ"], answer: 2 },
        { left: "ln(x)", options: ["cos(x)", "−sin(x)", "1/x"], answer: 2 }
      ], "Identifique primeiro a família da função.", "Você reconheceu as quatro famílias.", "O logaritmo só vale para x > 0."),
      choice("m3-4-a2", "Qual é N′(t) para N(t) = 300e^(0,6t)?", ["180e^(0,6t)", "300e^(0,6t)", "180e^t"], 0, "A derivada de e^(0,6t) inclui o fator 0,6.", "A cadeia exponencial foi aplicada.", "Multiplique a derivada da exponencial pelo 0,6."),
      bug("m3-4-a3", "Um estudante escreveu (2ᵗ)′ = 2ᵗ. Qual é a correção?", ["(2ᵗ)′ = 2ᵗ ln 2", "é correta", "(2ᵗ)′ = 2"], 0, "Compare o caso a = e com o caso a = 2.", "A base não desaparece da derivada.", "A fórmula geral é (aᵗ)′ = aᵗ ln a.")
    ]),
    lesson("m4-1", "m4", "Taxa de variação e monotonicidade", 4, "Relacionar sinal da derivada com crescimento e decrescimento.", "f′ > 0 indica crescimento; f′ < 0 indica decrescimento. O sinal não diz sozinho a velocidade numérica.", [
      choice("m4-1-a1", "Se f′(x) > 0 em (a, b), então f é:", ["crescente", "decrescente", "constante"], 0, "Inclinação positiva indica crescimento.", "Você leu a inclinação da curva.", "Não confunda sinal com módulo da taxa."),
      choice("m4-1-a2", "Para T(t) = 22 + 48e^(−0,15t), T′(t) é:", ["negativa em todo tempo finito", "positiva em todo tempo", "sempre zero"], 0, "A exponencial é positiva; o sinal vem do −0,15.", "O modelo diminui e o resfriamento desacelera.", "Analise o sinal do expoente e do coeficiente."),
      choice("m4-1-a3", "Se N′(t) > 0 e N″(t) > 0, o modelo está:", ["crescendo e acelerando", "crescendo e desacelerando", "decrescendo e acelerando"], 0, "N′ responde cresce? N″ responde acelera?", "Você interpretou taxa e aceleração.", "Separe o sinal da primeira e da segunda derivada.")
    ]),
    lesson("m4-2", "m4", "Pontos críticos e traçado de curvas", 5, "Encontrar pontos críticos, classificar extremos e ler a curvatura.", "Ponto crítico é candidato; a troca de sinal ou o teste da segunda derivada classifica o extremo.", [
      choice("m4-2-a1", "Para f(x) = x² − 6x + 5, qual é o mínimo local?", ["(3, −4)", "(0, 5)", "(6, −13)"], 0, "f′(x) = 2x − 6 e f″(3) = 2 > 0.", "Você encontrou e classificou o mínimo.", "Derive, encontre o crítico e substitua no valor da função."),
      order("m4-2-a2", "Para f(x) = x³ − 3x, monte a leitura dos críticos.", ["f′(x) = 3x² − 3", "Críticos em x = −1 e x = 1", "Sinais: + → − → +", "Máximo em x = −1 e mínimo em x = 1"], [0, 1, 2, 3], "Teste um ponto de cada intervalo.", "A troca de sinal revelou os dois extremos.", "Derive primeiro; não pare nos candidatos."),
      bug("m4-2-a3", "Para f(x) = x⁴ − 4x³, foi dito que f″ = 0 significa máximo. Qual é a correção?", ["f″ = 0 indica candidato; a troca de sinal classifica inflexão", "zero de f″ é sempre mínimo", "não há inflexão"], 0, "Analise o sinal de f″ antes e depois do zero.", "Você diferenciou zero de inflexão.", "Zero de f″ não resolve sozinho a classificação.")
    ]),
    lesson("m4-3", "m4", "Otimização e taxas relacionadas", 5, "Modelar restrições, derivar, classificar e responder com unidade.", "O roteiro é: restrição → função objetivo → derivada → zerar → classificar → calcular o valor ótimo.", [
      order("m4-3-a1", "Um retângulo tem perímetro 40. Monte a sequência para maximizar a área.", ["2x + 2y = 40", "y = 20 − x", "A(x) = x(20 − x)", "A′(x) = 20 − 2x", "x = 10 e A = 100"], [0, 1, 2, 3, 4], "Elimine uma variável usando a restrição.", "Você respondeu à área, não apenas ao valor de x.", "Comece pela restrição e volte à pergunta original."),
      choice("m4-3-a2", "Para L(x) = −0,4x² + 16x − 50, qual é o máximo?", ["L(20) = 110", "L(0) = −50", "x = 20, sem calcular L"], 0, "Derive, zere, classifique e calcule L(x).", "Você devolveu valor e prova do extremo.", "Encontrar x* sozinho não responde ao lucro."),
      choice("m4-3-a3", "Se V = (4/3)πr³, dV/dt = 12π e r = 3, qual é dr/dt?", ["1/3", "4/3", "12π"], 0, "Derive V em relação ao tempo e não trate r como constante.", "A unidade de comprimento por tempo voltou corretamente.", "r também é função do tempo.", true)
    ]),
    lesson("m4-4", "m4", "L’Hôpital e validação de modelos", 5, "Distinguir indeterminação, verificar hipóteses e auditar um modelo.", "0/0 não é zero nem um. Primeiro simplifique; depois verifique se L’Hôpital é legítimo.", [
      order("m4-4-a1", "Para lim(x→3) (x² − 9)/(x − 3), monte a solução por fatoração.", ["Substituir e obter 0/0", "Fatorar (x − 3)(x + 3)", "Cancelar x − 3 para x ≠ 3", "Concluir o limite é 6"], [0, 1, 2, 3], "Use a diferença de quadrados.", "Você tratou 0/0 como indeterminação.", "A fatoração é a primeira tentativa."),
      bug("m4-4-a2", "Um estudante aplicou L’Hôpital a lim(x→0⁺) 1/x e escreveu 0/1 = 0. Qual é o erro?", ["não há forma 0/0; o numerador tende a 1 e o limite é +∞", "a regra está correta", "o limite é −∞"], 0, "Verifique a forma antes de diferenciar.", "Você impediu uma aplicação indevida da regra.", "L’Hôpital não converte toda fração em zero."),
      choice("m4-4-a3", "Na auditoria de T(t) = 22 + 48e^(−0,15t), qual conjunto é coerente?", ["T′ < 0, T→22, T(0)=70; números didáticos", "T′ > 0 e T→70", "T é constante"], 0, "Confira sinal, limite, valor inicial e unidade.", "Você validou sinal, limite e interpretação.", "Uma derivada correta ainda precisa ter unidade coerente.", true)
    ]),
    lesson("m5-1", "m5", "Integral como acúmulo", 4, "Distinguir taxa de total e representar a integral como soma de fatias.", "Se r(t) é uma taxa, cada fatia contribui com r(t)·Δt; a integral é o limite dessas somas.", [
      choice("m5-1-a1", "Para r(t) = 20 + 4t, qual é o total de 0 a 10?", ["∫₀¹⁰(20 + 4t)dt = 400", "r(10) = 60", "r′(t) = 4"], 0, "Some as taxas ao longo do intervalo.", "Você separou taxa instantânea de acumulado.", "O valor final da taxa não é o total."),
      order("m5-1-a2", "Ordene a construção de uma integral como soma de Riemann.", ["Delinear [a, b]", "Fatiar o intervalo", "Somar retângulos", "Afinar as fatias", "Calcular o limite"], [0, 1, 2, 3, 4], "Integral é o limite de uma soma.", "A pilha de fatias ficou correta.", "A última etapa é o limite, não o desenho."),
      fill("m5-1-a3", "Se c(t) = 8 + 0,5t, complete F(t) e F(14) − F(0).", [
        { id: "antiderivative", label: "Função acumulada", options: ["8t + 0,25t²", "8t + 0,5t²", "4t² + 0,5t"], answer: 0 },
        { id: "total", label: "Total em 14 períodos", options: ["161", "120", "15"], answer: 0 }
      ], "Integre a taxa e depois calcule a diferença.", "A taxa virou total com a unidade correta.", "A regra da potência precisa ser aplicada ao termo quadrático.", true)
    ]),
    lesson("m5-2", "m5", "Antiderivadas e substituição", 5, "Encontrar F(x) + C, usar condição inicial e resolver por u.", "A substituição escolhe u, calcula du, integra, troca de volta e confere derivando.", [
      choice("m5-2-a1", "Qual é uma antiderivada de 3x² − 4x + 5?", ["x³ − 2x² + 5x + C", "3x − 4 + C", "x⁴/4 − 2x² + 5x + C"], 0, "Derive a alternativa para recuperar a função original.", "A derivada de volta recupera a taxa.", "Cada parcela precisa ser derivada."),
      order("m5-2-a2", "Resolva ∫2t(t² + 1)³dt ordenando a substituição.", ["u = t² + 1", "du = 2t dt", "Integral vira ∫u³du", "Resultado = u⁴/4 + C", "Voltar para t: (t² + 1)⁴/4 + C"], [0, 1, 2, 3, 4], "Procure u e du juntos.", "A cadeia foi desfeita e a variável voltou corretamente.", "Não esqueça de trocar toda a integral."),
      bug("m5-2-a3", "Em ∫6t(t² + 1)²dt, a tentativa diz du = 2tdt e 6tdt = du. Qual é a correção?", ["6tdt = 3du; resultado = (t² + 1)³ + C", "6tdt = du; resultado = 3u³/2", "não há constante"], 0, "Compare 6tdt com 2tdt.", "O fator 3 foi recuperado antes de integrar.", "A constante da substituição não desaparece.", false)
    ]),
    lesson("m5-3", "m5", "Integral definida e FTC", 5, "Aplicar F(b) − F(a), respeitar limites e controlar unidades.", "A integral definida retorna um número: o +C cancela na subtração.", [
      choice("m5-3-a1", "Se F′ = f, qual expressão calcula a integral definida?", ["F(b) − F(a)", "F(a) − F(b)", "F(b) + C"], 0, "A regra é fim menos início.", "A ordem e a ausência de C ficaram explícitas.", "Confira a ordem dos limites."),
      fill("m5-3-a2", "Calcule ∫₁³4x³dx completando F(x) e a subtração.", [
        { id: "antiderivative", label: "Antiderivativa", options: ["x⁴", "4x²", "x³"], answer: 0 },
        { id: "result", label: "Resultado", options: ["80", "81", "1"], answer: 0 }
      ], "O limite inferior não é zero.", "Você aplicou o FTC nos dois limites.", "Não substitua F(0) no lugar de F(1)."),
      choice("m5-3-a3", "Se q(t) = 3 + 0,5t em kW por 6 horas, qual é a energia acumulada?", ["27 kWh", "6 kWh", "3 kWh"], 0, "Use kW·h = kWh e integre a taxa.", "A unidade mudou de taxa para energia.", "A taxa final não é a energia total.", true)
    ]),
    lesson("m5-4", "m5", "Áreas, unidades e EDO separável", 5, "Interpretar área, controlar unidades e resolver y′ = ky.", "Na EDO separável, separe y, integre e use a condição inicial para obter y = y₀e^(kx).", [
      choice("m5-4-a1", "Qual é ∫₀⁴2tdt?", ["16", "8", "32"], 0, "A curva y = 2t forma um triângulo.", "A geometria e o FTC chegam ao mesmo total.", "A taxa final não é o acumulado."),
      order("m5-4-a2", "Para dO/dt = −0,08O e O(0) = 500, monte a solução.", ["Separar dO/O = −0,08dt", "Integrar: ln|O| = −0,08t + C", "Usar O(0) = 500", "Obter O(t) = 500e^(−0,08t)"], [0, 1, 2, 3], "A condição inicial escolhe a constante.", "A solução respeita o sinal e o valor inicial.", "Não esqueça a condição inicial."),
      choice("m5-4-a3", "No modelo didático, qual é a meia-vida para k = −0,08?", ["ln(2)/0,08 ≈ 8,66 períodos", "1/0,08 = 12,5", "0,08/2 = 0,04"], 0, "Use ln(2)/|k|.", "A meia-vida usa o módulo de k.", "A unidade de k é inversa ao tempo.", true)
    ])
  ];

  window.CapyLessons = Object.freeze(lessons);
})();
