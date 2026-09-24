/* Course-context resolver for CapyCalculus.
 * Every playable activity is resolved from the selected course pack.
 * The numerical values are explicitly didactic/fictitious model values; they are not official data.
 */
(function () {
  "use strict";

  const m = (story, model, point, value, extra) => Object.assign({ story, model, point, value }, extra || {});
  const contexts = {
    administracao: {
      m1: m("rateio de custos e vendas da loja", "C(x) = 50 + 10x", "x = 10", "C(10) = 150 R$", {
        algebra: "um terço da conta de luz mais um quarto da mesma conta", algebraAnswer: "7/12",
        domainModel: "C(x) = 50 + 10x", domainAnswer: "x ≥ 0", domainUse: "x ≥ 0; x mede unidades vendidas",
        shape: "reta crescente", transform: "C(x) = 50 + 10(x + 2)", transformAnswer: "translação horizontal de 2 unidades",
        affine: "C(x) = 50 + 10x", inverse: "C⁻¹(y) = (y − 50)/10", composition: "C(2) = 70 R$; depois R(x) = 2x + 5 resulta em R(C(2)) = 145 R$", compositionAnswer: "145 R$",
        source: "administracao/05_APOSTILA_ACESSIVEL.md — exemplos de custo e rateio"
      }),
      m2: m("demanda de vendas ao longo do tempo", "D(t) = 1800t/(t + 9)", "t → ∞", "D(t) → 1800 unidades/mês", {
        limit: "1800 unidades/mês", atPoint: "t = 9", pointValue: "D(9) = 900 unidades/mês",
        side: "a demanda é definida para t ≥ 0 e não salta nesse intervalo", continuity: "contínua no domínio de uso t ≥ 0",
        technique: "lim(t→∞) D(t) = 1800", techniqueAnswer: "1800 unidades/mês", longLimit: "1800 unidades/mês",
        source: "administracao/05_APOSTILA_ACESSIVEL.md — demanda e limites"
      }),
      m3: m("oscilação didática do preço de venda", "p(t) = 80 + 10 sen(t)", "t = 0", "p′(t) = 10 cos(t)", {
        derivative: "10 cos(t)", derivativePoint: "t = 0", derivativeValue: "p′(0) = 10 R$/unidade de tempo",
        secondDerivative: "p″(t) = −10 sen(t)", modelPoint: "t = π/2", modelValue: "p(π/2) = 90 R$",
        special: "e^t", specialDerivative: "e^t", related: "d q/dp = −q/(p − 20)",
        source: "administracao/05_APOSTILA_ACESSIVEL.md — preço oscilante e derivada implícita"
      }),
      m4: m("otimização do lucro de uma linha de vendas", "L(q) = −2q² + 100q − 600", "q = 25", "L(25) = 650 R$", {
        derivative: "L′(q) = −4q + 100", optimum: "q = 25", optimumValue: "650 R$", related: "d q/dp = −q/(p − 20)", inflection: "o sinal de L″ separa concavidade",
        source: "administracao/05_APOSTILA_ACESSIVEL.md — lucro e otimização"
      }),
      m5: m("fluxo de caixa mensal e reserva da loja", "F(t) = 450 − 30t", "0 ≤ t ≤ 6", "∫₀⁶ F(t)dt = 2160 mil R$", {
        rate: "F(t) = 450 − 30t mil R$/mês", total: "2160 mil R$", antiderivative: "F(t) = 450 − 30t", substitution: "u = t² + 1; 10t dt = 5 du", ode: "I′(t) = −0,08I, I(0) = 500", halfLife: "meia-vida ≈ 8,66 semanas",
        source: "administracao/05_APOSTILA_ACESSIVEL.md — fluxo, integral e EDO"
      })
    },
    agronegocio: {
      m1: m("custo e armazenagem de grãos no armazém", "C(x) = 80 + 15x", "x = 10", "C(10) = 230 R$", {
        algebra: "a taxa média de G(t) = t² + 7t para h ≠ 0", algebraAnswer: "7", domainModel: "C(x) = 80 + 15x", domainAnswer: "x ≥ 0", domainUse: "x ≥ 0; x mede quantidade armazenada",
        shape: "reta crescente", transform: "C(x) = 80 + 15(x + 2)", transformAnswer: "translação horizontal de 2 unidades", affine: "C(x) = 80 + 15x", inverse: "C⁻¹(y) = (y − 80)/15", composition: "C(2) = 110 R$; depois R(x) = 2x + 5 resulta em R(C(2)) = 225 R$", compositionAnswer: "225 R$", source: "agronegocio/05_APOSTILA_ACESSIVEL.md — armazenagem e custos"
      }),
      m2: m("massa armazenada que se aproxima de um limite", "M(t) = 500t/(t + 20)", "t → ∞", "M(t) → 500 sacas/ha", {
        limit: "500 sacas/ha", atPoint: "t = 20", pointValue: "M(20) = 250 sacas/ha", side: "a expressão é contínua para t ≥ 0", continuity: "contínua no domínio de uso t ≥ 0", technique: "lim(t→∞) 500t/(t + 20) = 500", techniqueAnswer: "500 sacas/ha", longLimit: "500 sacas/ha", source: "agronegocio/05_APOSTILA_ACESSIVEL.md — limites e armazenamento"
      }),
      m3: m("altura de biomassa em camadas", "H(t) = (0,2t² + 8)³", "t = 0", "H′(t) = 1,2t(0,2t² + 8)²", {
        derivative: "1,2t(0,2t² + 8)²", derivativePoint: "t = 0", derivativeValue: "H′(0) = 0", secondDerivative: "a segunda derivada inicia em 1,2", modelPoint: "t = 0", modelValue: "H(0) = 512", special: "e^(0,6t)", specialDerivative: "0,6e^(0,6t)", related: "H′ = H′(u)u′", source: "agronegocio/05_APOSTILA_ACESSIVEL.md — cadeia e biomassa"
      }),
      m4: m("resposta didática de uma aplicação a uma dose de manejo", "D(x) = −0,3x² + 12x + 50", "x = 20", "D(20) = 170", {
        derivative: "D′(x) = −0,6x + 12", optimum: "x = 20", optimumValue: "170", related: "D′(20) = 0", inflection: "D″(x) = −0,6 < 0 indica concavidade para baixo", source: "agronegocio/05_APOSTILA_ACESSIVEL.md — resposta e ponto ótimo"
      }),
      m5: m("chuva acumulada sobre a área de interesse", "r(t) = 12 + 2t mm/h", "0 ≤ t ≤ 6", "∫₀⁶ r(t)dt = 108 mm", {
        rate: "r(t) = 12 + 2t mm/h", total: "108 mm", antiderivative: "R(t) = 12t + t²", substitution: "u = x² + 1; 10x dx = 5 du", ode: "S′(t) = 0,08S, S(0) = 500", halfLife: "fator de crescimento e^(0,08t)", source: "agronegocio/05_APOSTILA_ACESSIVEL.md — chuva, integral e EDO"
      })
    },
    agronomia: {
      m1: m("custo e área de uma aplicação didática de campo", "C(x) = 5x² + 40x + 100", "x = 2", "C(2) = 200", {
        algebra: "1/2 + 1/3 de uma dose didática", algebraAnswer: "5/6", domainModel: "C(x) = 5x² + 40x + 100", domainAnswer: "todos os reais", domainUse: "x ∈ ℝ; no uso didático, x ≥ 0", shape: "parábola para cima", transform: "C(x) = 5(x + 4)² − 180", transformAnswer: "translação horizontal de 4 e vertical de −180", affine: "A(x) = 40 + 5x", inverse: "A⁻¹(y) = (y − 40)/5", composition: "A(C(2)) = 40 + 5·200 = 1040", compositionAnswer: "1040", source: "agronomia/05_APOSTILA_ACESSIVEL.md — frações e funções"
      }),
      m2: m("cobertura de uma área em função da dose simulada", "C(d) = 180d/(d + 40)", "d → ∞", "C(d) → 180", {
        limit: "180", atPoint: "d = 40", pointValue: "C(40) = 90", side: "a expressão é contínua para d ≥ 0", continuity: "contínua no domínio de uso d ≥ 0", technique: "lim(d→∞) 180d/(d + 40) = 180", techniqueAnswer: "180", longLimit: "180", source: "agronomia/05_APOSTILA_ACESSIVEL.md — cobertura e limites"
      }),
      m3: m("amplitude de uma curva senoidal didática", "A(t) = 10 sen(πt/2)", "t = 1", "A′(t) = 5π cos(πt/2)", {
        derivative: "5π cos(πt/2)", derivativePoint: "t = 1", derivativeValue: "A′(1) = 0", secondDerivative: "A″(1) = −5π²/2", modelPoint: "t = 1", modelValue: "A(1) = 10", special: "e^(0,15t)", specialDerivative: "0,15e^(0,15t)", related: "A″ e a curvatura da curva", source: "agronomia/05_APOSTILA_ACESSIVEL.md — trigonométrica e cadeia"
      }),
      m4: m("estoque de um produto em um modelo didático de campo", "Q(t) = 400e^(0,15t) − 120t", "t ≈ 4,62", "Q(t) tem um mínimo perto de t = 4,62", {
        derivative: "Q′(t) = 60e^(0,15t) − 120", optimum: "t ≈ 4,62", optimumValue: "Q(4,62) ≈ 245,6", related: "Q′(t) = 0", inflection: "Q″(t) = 9e^(0,15t) > 0", source: "agronomia/05_APOSTILA_ACESSIVEL.md — estoque e ponto crítico"
      }),
      m5: m("vazão e água acumulada em um intervalo didático", "q(t) = 3t + 2 mm/h", "0 ≤ t ≤ 5", "∫₀⁵ q(t)dt = 47,5 mm", {
        rate: "q(t) = 3t + 2 mm/h", total: "47,5 mm", antiderivative: "Q(t) = 1,5t² + 2t", substitution: "u = t² + 1; 6t dt = 3 du", ode: "C′(t) = −0,06C, C(0) = 100", halfLife: "meia-vida ≈ 11,55 dias", source: "agronomia/05_APOSTILA_ACESSIVEL.md — vazão e EDO"
      })
    },
    "arquitetura-urbanismo": {
      m1: m("área útil de uma solução espacial didática", "U(x) = x(12 − 0,25x)", "x = 8", "U(8) = 80 m²", {
        algebra: "4 cm em uma escala 1:50", algebraAnswer: "2 m", domainModel: "U(x) = x(12 − 0,25x)", domainAnswer: "0 ≤ x ≤ 48", domainUse: "0 ≤ x ≤ 48 no modelo didático", shape: "parábola côncava", transform: "U(x + 4) = (x + 4)(8 − 0,25x)", transformAnswer: "transformação horizontal e vertical combinadas", affine: "C(x) = 600 + 500000/x", inverse: "C⁻¹(y) = 500000/(y − 600)", composition: "C(100) = 5600 R$/m²; R(y) = 0,1y; R(C(100)) = 560 R$", compositionAnswer: "560 R$", source: "arquitetura-urbanismo/05_APOSTILA_ACESSIVEL.md — escala, área e custo"
      }),
      m2: m("variação de uma seção espacial e seu volume", "A(s) = (2s + 12)/(s + 3)", "s → ∞", "A(s) → 2 m²", {
        limit: "2 m²", atPoint: "s = 0", pointValue: "A(0) = 4 m²", side: "o volume diverge enquanto a seção tem limite", continuity: "A(s) é contínua para s ≠ −3", technique: "lim(s→∞) (2s + 12)/(s + 3) = 2", techniqueAnswer: "2 m²", longLimit: "2 m²", source: "arquitetura-urbanismo/05_APOSTILA_ACESSIVEL.md — seção e limites"
      }),
      m3: m("resfriamento de uma massa simulada na cidade", "T(t) = 20 + 70e^(−0,08t)", "t = 5", "T′(5) ≈ −3,76 °C/h", {
        derivative: "−5,6e^(−0,08t)", derivativePoint: "t = 5", derivativeValue: "T′(5) ≈ −3,76 °C/h", secondDerivative: "T″(t) = 0,448e^(−0,08t)", modelPoint: "t = 0", modelValue: "T(0) = 90 °C", special: "e^(−0,08t)", specialDerivative: "−0,08e^(−0,08t)", related: "T′ = T′(u)u′", source: "arquitetura-urbanismo/05_APOSTILA_ACESSIVEL.md — temperatura e cadeia"
      }),
      m4: m("área de um lote com uma restrição de perímetro", "A(x) = x(80 − 2x)", "x = 20", "A(20) = 800 m²", {
        derivative: "A′(x) = 80 − 4x", optimum: "x = 20", optimumValue: "800 m²", related: "A′(20) = 0", inflection: "A″(x) = −4", source: "arquitetura-urbanismo/05_APOSTILA_ACESSIVEL.md — otimização de lote"
      }),
      m5: m("volume integrado a partir de uma seção progressiva", "A(s) = 4 + 0,5s", "0 ≤ s ≤ 10", "V = ∫₀¹⁰ A(s)ds = 65 m³", {
        rate: "A(s) = 4 + 0,5s m²", total: "65 m³", antiderivative: "V(s) = 4s + 0,25s²", substitution: "u = s² + 1; 2s ds = du", ode: "D′(t) = −0,04D, D(0) = 60", halfLife: "meia-vida ≈ 17,33 h", source: "arquitetura-urbanismo/05_APOSTILA_ACESSIVEL.md — volume e EDO"
      })
    },
    "ciencia-tecnologia-laticinios": {
      m1: m("área de um lote de processo fictício", "A(x) = 20x − x²", "x = 5", "A(5) = 75 m²", {
        algebra: "(3/4) de uma forma dividida entre duas partes", algebraAnswer: "3/8", domainModel: "A(x) = 20x − x²", domainAnswer: "0 ≤ x ≤ 20", domainUse: "0 ≤ x ≤ 20 no uso didático", shape: "parábola côncava", transform: "A(x) = 20(x − 10)² + 100", transformAnswer: "translações horizontal e vertical", affine: "L(x) = 20x", inverse: "L⁻¹(y) = y/20", composition: "L(x) = 2x; A(x) = 5x − x²; L(2) = 4; A(L(2)) = 4", compositionAnswer: "4 m²", source: "ciencia-tecnologia-laticinios/05_APOSTILA_ACESSIVEL.md — frações e processos"
      }),
      m2: m("resfriamento de um lote de laticínios fictício", "T(t) = 22 + 48e^(−0,15t)", "t → ∞", "T(t) → 22 °C", {
        limit: "22 °C", atPoint: "t = 0", pointValue: "T(0) = 70 °C", side: "a curva se aproxima de 22 sem atingir o valor em tempo finito", continuity: "contínua para t ≥ 0", technique: "lim(t→∞) T(t) = 22", techniqueAnswer: "22 °C", longLimit: "22 °C", source: "ciencia-tecnologia-laticinios/05_APOSTILA_ACESSIVEL.md — resfriamento e limites"
      }),
      m3: m("sensor de temperatura em uma linha didática", "H(θ) = 30 + 40 sen(θ), θ(t) = 0,2t", "t = 1", "H′(1) ≈ 7,84 °C/min", {
        derivative: "8 cos(0,2t)", derivativePoint: "t = 1", derivativeValue: "H′(1) ≈ 7,84 °C/min", secondDerivative: "−1,6 sen(0,2t)", modelPoint: "t = 0", modelValue: "H(0) = 30 °C", special: "e^(0,35t)", specialDerivative: "0,35e^(0,35t)", related: "H′ = H′(θ)θ′", source: "ciencia-tecnologia-laticinios/05_APOSTILA_ACESSIVEL.md — sensor e cadeia"
      }),
      m4: m("área útil de uma prensa didática", "A(x) = x(2,4 − x)", "x = 1,2", "A(1,2) = 1,44 m²", {
        derivative: "A′(x) = 2,4 − 2x", optimum: "x = 1,2", optimumValue: "1,44 m²", related: "A′(1,2) = 0", inflection: "A″(x) = −2", source: "ciencia-tecnologia-laticinios/05_APOSTILA_ACESSIVEL.md — área e otimização"
      }),
      m5: m("energia acumulada em um processo de linha", "P(t) = 5 − 8t kW", "0 ≤ t ≤ 0,25", "∫₀^0,25 P(t)dt = 1 kWh", {
        rate: "P(t) = 5 − 8t kW", total: "1 kWh", antiderivative: "E(t) = 5t − 4t²", substitution: "u = t² + 1; 2t dt = du", ode: "R′(t) = −0,05R, R(0) = 400", halfLife: "meia-vida ≈ 13,86 min", source: "ciencia-tecnologia-laticinios/05_APOSTILA_ACESSIVEL.md — energia e EDO"
      })
    },
    "ciencias-biologicas-bacharelado": {
      m1: m("resposta de uma enzima a um substrato fictício", "v(S) = 4S/(2 + S)", "S = 2", "v(2) = 2 μmol/min", {
        algebra: "diluir 1/2 e depois 1/10", algebraAnswer: "1/20", domainModel: "v(S) = 4S/(2 + S)", domainAnswer: "S ≠ −2", domainUse: "S ≥ 0 no uso biológico didático", shape: "racional crescente e saturante", transform: "v(S) = 4S/(2 + S)", transformAnswer: "a saturação aparece no gráfico", affine: "L(S) = 2 + 4S", inverse: "L⁻¹(y) = (y − 2)/4", composition: "L(2) = 10; v(L(2)) = 40/12 = 10/3", compositionAnswer: "10/3 μmol/min", source: "ciencias-biologicas-bacharelado/05_APOSTILA_ACESSIVEL.md — enzima e diluições"
      }),
      m2: m("velocidade enzimática e limite de saturação", "v(S) = 4S/(2 + S)", "S → ∞", "v(S) → 4 μmol/min", {
        limit: "4 μmol/min", atPoint: "S = 2", pointValue: "v(2) = 2 μmol/min", side: "a função é contínua para S ≥ 0", continuity: "contínua no domínio biológico S ≥ 0", technique: "lim(S→∞) 4S/(2 + S) = 4", techniqueAnswer: "4 μmol/min", longLimit: "4 μmol/min", source: "ciencias-biologicas-bacharelado/05_APOSTILA_ACESSIVEL.md — limites biológicos"
      }),
      m3: m("massa de serrapilheira em um modelo fictício", "M(t) = 200e^(−0,05t)", "t = 0", "M′(t) = −10e^(−0,05t)", {
        derivative: "−10e^(−0,05t)", derivativePoint: "t = 0", derivativeValue: "M′(0) = −10 g/dia", secondDerivative: "0,5e^(−0,05t)", modelPoint: "t = 0", modelValue: "M(0) = 200 g", special: "e^(−0,05t)", specialDerivative: "−0,05e^(−0,05t)", related: "M′ = M′(u)u′", source: "ciencias-biologicas-bacharelado/05_APOSTILA_ACESSIVEL.md — serrapilheira"
      }),
      m4: m("critério didático de conservação de uma população", "g(P) = 0,3P(1 − P/100)", "P = 50", "g(50) = 7,5", {
        derivative: "g′(P) = 0,3 − 0,006P", optimum: "P = 50", optimumValue: "7,5 sob o critério fictício", related: "g′(50) = 0", inflection: "g″(P) = −0,006", source: "ciencias-biologicas-bacharelado/05_APOSTILA_ACESSIVEL.md — otimização biológica"
      }),
      m5: m("perda acumulada de um material biológico", "r(s) = 20e^(−0,1s)", "0 ≤ s ≤ 10", "∫₀¹⁰ r(s)ds ≈ 126,9", {
        rate: "r(s) = 20e^(−0,1s)", total: "≈ 126,9 mL", antiderivative: "L(s) = 200(1 − e^(−0,1s))", substitution: "u = t² + 1; 2t dt = du", ode: "Q′ = −kQ, Q(0) = 600", halfLife: "meia-vida de 5 dias", source: "ciencias-biologicas-bacharelado/05_APOSTILA_ACESSIVEL.md — perda e EDO"
      })
    },
    "ciencias-biologicas-licenciatura": {
      m1: m("resposta de uma enzima no contexto de ensino de Biologia", "v(S) = 60S/(5 + S)", "S = 5", "v(5) = 30 μmol/min", {
        algebra: "1/4 + 1/6 de uma mistura didática", algebraAnswer: "5/12", domainModel: "v(S) = 60S/(5 + S)", domainAnswer: "S ≠ −5", domainUse: "S ≥ 0 no uso didático", shape: "racional crescente e saturante", transform: "v(S) = 60 − 300/(S + 5)", transformAnswer: "a forma evidencia a saturação", affine: "L(S) = 5 + 60S", inverse: "L⁻¹(y) = (y − 5)/60", composition: "L(2) = 125; v(L(2)) = 60·125/130 = 750/13", compositionAnswer: "≈ 57,7 μmol/min", source: "ciencias-biologicas-licenciatura/05_APOSTILA_ACESSIVEL.md — enzima e frações"
      }),
      m2: m("limite de saturação de uma enzima didática", "v(S) = 60S/(5 + S)", "S → ∞", "v(S) → 60 μmol/min", {
        limit: "60 μmol/min", atPoint: "S = 5", pointValue: "v(5) = 30 μmol/min", side: "a função é contínua para S ≥ 0", continuity: "contínua no domínio didático S ≥ 0", technique: "lim(S→∞) 60S/(5 + S) = 60", techniqueAnswer: "60 μmol/min", longLimit: "60 μmol/min", source: "ciencias-biologicas-licenciatura/05_APOSTILA_ACESSIVEL.md — limites enzimáticos"
      }),
      m3: m("produção simulada de uma cultura", "O(t) = 2t² + 0,5t", "t = 3", "O′(3) = 12,5", {
        derivative: "4t + 0,5", derivativePoint: "t = 3", derivativeValue: "O′(3) = 12,5", secondDerivative: "4", modelPoint: "t = 0", modelValue: "O(0) = 0", special: "e^(−0,1t)", specialDerivative: "−0,1e^(−0,1t)", related: "O″(3) = 4", source: "ciencias-biologicas-licenciatura/05_APOSTILA_ACESSIVEL.md — produção e derivada"
      }),
      m4: m("perímetro mínimo para uma área fixa em atividade", "P(x) = 2(x + 100/x)", "x = 10", "P(10) = 40 m", {
        derivative: "P′(x) = 2 − 200/x²", optimum: "x = 10", optimumValue: "40 m", related: "P′(10) = 0", inflection: "P″(x) = 400/x³ > 0", source: "ciencias-biologicas-licenciatura/05_APOSTILA_ACESSIVEL.md — área e otimização"
      }),
      m5: m("quantidade absorvida a partir de uma taxa simulada", "A′(t) = 3 + 0,5t", "0 ≤ t ≤ 6", "∫₀⁶ A′(t)dt = 27", {
        rate: "A′(t) = 3 + 0,5t", total: "27; com A(0) = 4, A(6) = 31", antiderivative: "A(t) = 3t + 0,25t² + 4", substitution: "u = t² + 1; 2t dt = du", ode: "N′(t) = −(ln 2/4)N, N(0) = 100", halfLife: "meia-vida de 4 períodos", source: "ciencias-biologicas-licenciatura/05_APOSTILA_ACESSIVEL.md — acúmulo e EDO"
      })
    },
    "ciencias-contabeis": {
      m1: m("custo total e rateio de despesas", "C(x) = 500 + 8x", "x = 10", "C(10) = 580 R$", {
        algebra: "1/4 + 2/4 de uma despesa", algebraAnswer: "3/4", domainModel: "C(x) = 500 + 8x", domainAnswer: "x ≥ 0", domainUse: "x ≥ 0; x mede unidades", shape: "reta crescente", transform: "C(x) = 500 + 8(x + 2)", transformAnswer: "translação horizontal de 2", affine: "C(x) = 500 + 8x", inverse: "C⁻¹(y) = (y − 500)/8", composition: "C(2) = 516; R(x) = C(x)/2; R(C(2)) = 258", compositionAnswer: "258 R$", source: "ciencias-contabeis/05_APOSTILA_ACESSIVEL.md — custos e rateio"
      }),
      m2: m("recebíveis e aproximação de um limite financeiro", "G(t) = 4000 − 1200/(t + 1)", "t → ∞", "G(t) → 4000 R$", {
        limit: "4000 R$", atPoint: "t = 0", pointValue: "G(0) = 2800 R$", side: "há uma descontinuidade em t = −1 fora do uso t ≥ 0", continuity: "contínua para t ≥ 0", technique: "lim(t→∞) G(t) = 4000", techniqueAnswer: "4000 R$", longLimit: "4000 R$", source: "ciencias-contabeis/05_APOSTILA_ACESSIVEL.md — recebíveis"
      }),
      m3: m("custo marginal de uma operação didática", "C(q) = 300 + 10q + 0,2q²", "q = 20", "C′(20) = 18", {
        derivative: "C′(q) = 10 + 0,4q", derivativePoint: "q = 20", derivativeValue: "C′(20) = 18", secondDerivative: "0,4", modelPoint: "q = 20", modelValue: "C(20) = 540", special: "e^(0,1q)", specialDerivative: "0,1e^(0,1q)", related: "C′ é o custo marginal", source: "ciencias-contabeis/05_APOSTILA_ACESSIVEL.md — custo"
      }),
      m4: m("lucro máximo sob um modelo didático", "L(x) = −x² + 300x − 2000", "x = 150", "L(150) = 20500 R$", {
        derivative: "L′(x) = −2x + 300", optimum: "x = 150", optimumValue: "20500 R$", related: "L′(150) = 0", inflection: "L″(x) = −2", source: "ciencias-contabeis/05_APOSTILA_ACESSIVEL.md — lucro"
      }),
      m5: m("depreciação de um valor estimado", "V(t) = 12000 − 1200t", "0 ≤ t ≤ 5", "∫₀⁵ |V′(t)|dt = 6000 R$", {
        rate: "V′(t) = −1200 R$/ano", total: "6000 R$ em magnitude", antiderivative: "V(t) = 12000t − 600t²", substitution: "u = x² + 1; 2x dx = du", ode: "V′(t) = −0,04V, V(0) = 12000", halfLife: "meia-vida ≈ 17,33 períodos no modelo didático", source: "ciencias-contabeis/05_APOSTILA_ACESSIVEL.md — valor e integral"
      })
    },
    cooperativismo: {
      m1: m("rendimento e rateio de uma cooperativa fictícia", "F(t) = 100 + 20t", "t = 5", "F(5) = 200", {
        algebra: "1/5 das sobras mais 1/3 para o rateio", algebraAnswer: "8/15", domainModel: "F(t) = 100 + 20t", domainAnswer: "t ≥ 0", domainUse: "t ≥ 0; t mede períodos", shape: "reta crescente", transform: "F(t) = 100 + 20(t + 2)", transformAnswer: "translação horizontal de 2", affine: "F(t) = 100 + 20t", inverse: "F⁻¹(y) = (y − 100)/20", composition: "F(2) = 140; R(x) = F(x)/2; R(F(2)) = 70", compositionAnswer: "70", source: "cooperativismo/05_APOSTILA_ACESSIVEL.md — rateio e função"
      }),
      m2: m("pagamento por cota em um modelo fictício", "Q(x) = 80x/(x + 8)", "x → ∞", "Q(x) → 80 R$/cota", {
        limit: "80 R$/cota", atPoint: "x = 8", pointValue: "Q(8) = 40 R$/cota", side: "a expressão é contínua para x ≥ 0", continuity: "contínua no domínio de uso x ≥ 0", technique: "lim(x→∞) 80x/(x + 8) = 80", techniqueAnswer: "80 R$/cota", longLimit: "80 R$/cota", source: "cooperativismo/05_APOSTILA_ACESSIVEL.md — pagamento por cota"
      }),
      m3: m("crescimento patrimonial por camadas", "P(t) = (0,2t² + 10)⁴", "t = 0", "P′(t) = 1,6t(0,2t² + 10)³", {
        derivative: "1,6t(0,2t² + 10)³", derivativePoint: "t = 0", derivativeValue: "P′(0) = 0", secondDerivative: "a curvatura inicia positiva", modelPoint: "t = 0", modelValue: "P(0) = 10000", special: "e^(0,04t)", specialDerivative: "0,04e^(0,04t)", related: "P′ = P′(u)u′", source: "cooperativismo/05_APOSTILA_ACESSIVEL.md — patrimônio"
      }),
      m4: m("pagamento por pessoa sob uma restrição de participação", "p(x) = 2700/x − 3x", "x ≥ 10", "p(10) = 240 mil R$/pessoa", {
        derivative: "p′(x) = −2700/x² − 3", optimum: "x = 10 no domínio x ≥ 10", optimumValue: "240 mil R$/pessoa", related: "p′ < 0", inflection: "p″(x) = 5400/x³ > 0", source: "cooperativismo/05_APOSTILA_ACESSIVEL.md — fundo e otimização"
      }),
      m5: m("repasse mensal de uma cooperativa fictícia", "r(t) = 20 + 2t mil R$/mês", "0 ≤ t ≤ 6", "∫₀⁶ r(t)dt = 156 mil R$", {
        rate: "r(t) = 20 + 2t mil R$/mês", total: "156 mil R$", antiderivative: "R(t) = 20t + t²", substitution: "u = x² + 1; 2x dx = du", ode: "M′(t) = −0,04M, M(0) = 160", halfLife: "meia-vida ≈ 17,33 meses", source: "cooperativismo/05_APOSTILA_ACESSIVEL.md — repasse e EDO"
      })
    },
    "engenharia-florestal": {
      m1: m("área basal de uma árvore a partir do DAP", "A(d) = 3,1416(d/2)²", "d = 20", "A(20) = 314,16 cm²", {
        algebra: "1 m² = 10.000 cm²", algebraAnswer: "10.000", domainModel: "A(d) = 3,1416(d/2)²", domainAnswer: "d ≥ 0", domainUse: "d ≥ 0; d é o DAP", shape: "parábola crescente", transform: "A(2d) = 4A(d)", transformAnswer: "a área quadruplica quando o diâmetro dobra", affine: "L(d) = 10 + 2d", inverse: "L⁻¹(y) = (y − 10)/2", composition: "L(5) = 20; A(L(5)) = 3,1416·10²", compositionAnswer: "314,16 cm²", source: "engenharia-florestal/05_APOSTILA_ACESSIVEL.md — DAP e área basal"
      }),
      m2: m("área basal e comportamento por trechos", "B(d) = 0,00007854d²", "d → 10", "lim(d→10) B(d) = 0,007854 m²", {
        limit: "0,007854 m²", atPoint: "d = 10", pointValue: "B(10) = 0,007854 m²", side: "a curva por partes salta aos 10 anos", continuity: "há descontinuidade na curva por trechos", technique: "lim(d→10) 0,00007854d² = 0,007854", techniqueAnswer: "0,007854 m²", longLimit: "0,00007854d²", source: "engenharia-florestal/05_APOSTILA_ACESSIVEL.md — limites e descontinuidade"
      }),
      m3: m("crescimento do DAP e da área basal ao longo do tempo", "B(d(t)) = 0,00007854(8 + 1,5t)²", "t = 4", "dB/dt ≈ 0,003299 m²/ano", {
        derivative: "dB/dt = 0,00023562d(t)d′(t)", derivativePoint: "t = 4", derivativeValue: "≈ 0,003299 m²/ano", secondDerivative: "a taxa varia com d(t)", modelPoint: "t = 0", modelValue: "d(0) = 8", special: "e^(−0,06t)", specialDerivative: "−0,06e^(−0,06t)", related: "dB/dt = B′(d)d′(t)", source: "engenharia-florestal/05_APOSTILA_ACESSIVEL.md — crescimento e cadeia"
      }),
      m4: m("ganho de um desbaste modelado didaticamente", "L(x) = −3x² + 36x + 10", "x = 6", "L(6) = 118", {
        derivative: "L′(x) = −6x + 36", optimum: "x = 6", optimumValue: "118", related: "L′(6) = 0", inflection: "L″(x) = −6", source: "engenharia-florestal/05_APOSTILA_ACESSIVEL.md — otimização"
      }),
      m5: m("remoção de árvores e estoque restante", "r(t) = 4 − 0,2t árvores/dia", "0 ≤ t ≤ 10", "∫₀¹⁰ r(t)dt = 30 árvores", {
        rate: "r(t) = 4 − 0,2t árvores/dia", total: "30 árvores; com N(0) = 50, N(10) = 20", antiderivative: "N(t) = 4t − 0,1t² + 50", substitution: "u = x² + 1; 2x dx = du", ode: "S′(t) = −0,06S, S(0) = 120", halfLife: "meia-vida ≈ 11,55 anos", source: "engenharia-florestal/05_APOSTILA_ACESSIVEL.md — remoção e EDO"
      })
    },
    zootecnia: {
      m1: m("produção simulada de um lote de zootecnia", "P(t) = 10 + 2t", "t = 5", "P(5) = 20", {
        algebra: "1/2 + 1/3 de um cocho didático", algebraAnswer: "5/6", domainModel: "P(t) = 10 + 2t", domainAnswer: "t ≥ 0", domainUse: "t ≥ 0; t mede períodos", shape: "reta crescente", transform: "P(t) = 10 + 2(t + 2)", transformAnswer: "translação horizontal de 2", affine: "P(t) = 10 + 2t", inverse: "P⁻¹(y) = (y − 10)/2", composition: "P(2) = 14; R(x) = P(x)/2; R(P(2)) = 7", compositionAnswer: "7", source: "zootecnia/05_APOSTILA_ACESSIVEL.md — produção e frações"
      }),
      m2: m("racionamento em dois trechos de um curral fictício", "q(t) = 6t e q(t) = 4t + 20", "t = 10", "q(10) = 60 kg/dia nos dois trechos", {
        limit: "o trecho é linear; o valor límite depende do intervalo considerado", atPoint: "t = 10", pointValue: "60 kg/dia", side: "os dois trechos coincidem em t = 10", continuity: "a função por partes é contínua nesse ponto", technique: "avaliar os trechos e comparar o valor no ponto", techniqueAnswer: "60 kg/dia", longLimit: "depende do trecho", source: "zootecnia/05_APOSTILA_ACESSIVEL.md — racionamento e limites"
      }),
      m3: m("relação entre crescimento e massa de um lote", "3G + 2M = 120", "dM/dt = 5", "dG/dt = −10/3 kg/dia", {
        derivative: "3G + 2M = 120 ⇒ 3G′ + 2M′ = 0", derivativePoint: "dM/dt = 5", derivativeValue: "G′ = −10/3 kg/dia", secondDerivative: "a relação é linear", modelPoint: "d = 3", modelValue: "T(3) = 25", special: "sen(πd/6)", specialDerivative: "(5π/6)cos(πd/6)", related: "3G′ + 2M′ = 0", source: "zootecnia/05_APOSTILA_ACESSIVEL.md — taxas relacionadas"
      }),
      m4: m("área de uma cerca com restrição de perímetro", "A(x) = 120x − x²", "x = 60", "A(60) = 3600 m²", {
        derivative: "A′(x) = 120 − 2x", optimum: "x = 60", optimumValue: "3600 m²", related: "A′(60) = 0", inflection: "A″(x) = −2", source: "zootecnia/05_APOSTILA_ACESSIVEL.md — otimização"
      }),
      m5: m("produção de leite e estoque acumulado", "r(d) = 12 + 2d L/dia", "0 ≤ d ≤ 8", "∫₀⁸ r(d)dr = 160 L; com estoque inicial 6 L, total 166 L", {
        rate: "r(d) = 12 + 2d L/dia", total: "160 L acumulados; 166 L no tanque", antiderivative: "R(d) = 12d + d²", substitution: "u = d² + 1; 2d dd = du", ode: "M′(t) = −0,10M, M(0) = 800", halfLife: "meia-vida ≈ 6,93 dias", source: "zootecnia/05_APOSTILA_ACESSIVEL.md — leite e EDO"
      })
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function questionText(value) {
    const text = String(value || "").trim();
    if (text.endsWith(":")) return `${text.slice(0, -1)}?`;
    if (text.endsWith(".")) return `${text.slice(0, -1)}?`;
    return text.endsWith("?") ? text : `${text}?`;
  }

  function attach(base, course, ctx, changes) {
    const resolved = Object.assign(clone(base), changes || {});
    if (resolved.prompt) resolved.prompt = questionText(resolved.prompt);
    return Object.assign(resolved, {
      contextual: true,
      contextResolved: true,
      difficulty: "challenge",
      courseSlug: course.slug,
      contextLabel: ctx.story,
      contextModel: ctx.model,
      contextPoint: ctx.point,
      contextValue: ctx.value,
      dataStatus: "fictitious",
      sourceRef: ctx.source || `outputs-aula-mat146-calculo1/${course.slug}/05_APOSTILA_ACESSIVEL.md`
    });
  }

  function choice(base, course, ctx, prompt, options, hint, correct, retry) {
    return attach(base, course, ctx, { prompt, options, hint, correct, retry });
  }

  function fill(base, course, ctx, prompt, fields, hint, correct, retry) {
    const baseFields = base.fields || [];
    return attach(base, course, ctx, {
      prompt,
      fields: fields.map((field, index) => Object.assign({}, baseFields[index] || {}, field)),
      hint,
      correct,
      retry
    });
  }

  function order(base, course, ctx, prompt, items, hint, correct, retry) {
    return attach(base, course, ctx, { prompt, items, hint, correct, retry });
  }

  function pair(base, course, ctx, prompt, pairs, hint, correct, retry) {
    return attach(base, course, ctx, { prompt, pairs, hint, correct, retry });
  }

  function lead(course, ctx) {
    return `No modelo didático de ${course.name} — ${ctx.story}:`;
  }

  function resolveActivity(definition, course, base, index) {
    const pack = contexts[course.slug];
    const ctx = definition.id === "m4-4"
      ? pack && pack.m2
      : definition.id === "m3-3"
        ? pack && Object.assign({}, pack.m3, { story: course.context, model: course.formula, value: course.formula })
        : pack && pack[definition.moduleId];
    if (!ctx) return null;
    const p = lead(course, ctx);

    if (definition.id === "m1-1") {
      if (index === 0) return fill(base, course, ctx, `${p} complete o procedimento e o resultado para: ${ctx.algebra}. Escolha os dois passos e a resposta final.`, [
        { label: "primeiro passo", options: ["Identificar a operação e os dados", "Derivar antes de calcular", "Usar limite no infinito"] },
        { label: "segundo passo", options: ["Aplicar a regra de frações, taxa ou conversão", "Somar denominadores", "Confundir valor com derivada"] },
        { label: "resultado", options: [ctx.algebraAnswer, "2/5", "3/5"] }
      ], "Identifique a operação, aplique a regra correspondente e confira a unidade.", `A sequência correta termina em ${ctx.algebraAnswer}.`, "Releia o enunciado e separe o procedimento do resultado.");
      if (index === 1) return choice(base, course, ctx, `${p} um colega somou as parcelas na ordem errada. Qual é a correção conceitual?`, ["Somar as frações antes de escolher a unidade", "Multiplicar os denominadores", "Substituir a soma por uma potência"], "Volte à ordem das operações.", "A ordem das operações foi respeitada.", "A resposta correta separa a soma da multiplicação.");
      return choice(base, course, ctx, `${p} no modelo ${ctx.model}, em ${ctx.point}, qual é o valor?`, [ctx.value, "depende de uma medida externa", "não há valor no domínio"], `Substitua ${ctx.point} em ${ctx.model}.`, `O modelo retorna ${ctx.value}.`, "Confira a substituição e a unidade do resultado.");
    }

    if (definition.id === "m1-2") {
      if (index === 0) return choice(base, course, ctx, `${p} qual é o domínio algébrico de ${ctx.domainModel}?`, [ctx.domainAnswer, "todos os reais sem restrição", "somente valores positivos"], "Identifique denominadores, radicandos ou restrições do modelo.", `O domínio algébrico é ${ctx.domainAnswer}.`, "Procure o valor que anula um denominador ou torna um radicando negativo.");
      if (index === 1) return pair(base, course, ctx, `${p} associe o modelo do curso à característica correspondente.`, [
        { left: ctx.model, options: [ctx.shape, "reta sem inclinação", "função descontínua em todo domínio"], answer: 0 },
        { left: ctx.domainModel, options: [ctx.domainAnswer, "todos os reais", "x = 0 sempre"], answer: 1 },
        { left: "f(x) = x²", options: ["parábola", "hipérbole", "exponencial"], answer: 2 }
      ], "Leia a expressão antes de escolher a característica.", "As três relações foram identificadas.", "Compare a forma da expressão e sua restrição.");
      return choice(base, course, ctx, `${p} qual é o domínio de uso do modelo ${ctx.domainModel}?`, [ctx.domainUse, "qualquer valor real, inclusive fora da situação", "apenas o valor de x = 0"], "Separe o domínio algébrico do intervalo de uso.", `O uso didático é ${ctx.domainUse}.`, "Não confunda limite algébrico com condição de uso.");
    }

    if (definition.id === "m1-3") {
      if (index === 0) return pair(base, course, ctx, `${p} associe a expressão do curso à família do gráfico.`, [
        { left: ctx.model, options: [ctx.shape, "reta crescente", "curva decrescente"], answer: 0 },
        { left: "f(x) = 2x + 1", options: [ctx.shape, "parábola", "hipérbole"], answer: 1 },
        { left: "g(x) = 1/x", options: ["parábola", "hipérbole", "reta"], answer: 2 }
      ], "Observe o grau, o denominador e o sinal do coeficiente.", "A forma de cada gráfico foi identificada.", "A estrutura da expressão antecipa a família do gráfico.");
      if (index === 1) return choice(base, course, ctx, `${p} a transformação ${ctx.transform} foi aplicada a ${ctx.model}. O que mudou?`, [ctx.transformAnswer, "mudou apenas o nome da função", "a função ficou constante"], "Compare o que foi somado dentro e fora da variável.", `A transformação correta é ${ctx.transformAnswer}.`, "Observe a posição do parêntese e o termo somado.");
      return choice(base, course, ctx, `${p} no modelo ${ctx.model}, em ${ctx.point}, o gráfico sugere qual comportamento?`, [ctx.value, "a curva decresce sem limite", "a função perde o domínio imediatamente"], "Compare entradas, saídas e a tendência do gráfico.", `A leitura contextual é ${ctx.value}.`, "Leia a tendência antes de escolher uma opção.");
    }

    if (definition.id === "m1-4") {
      if (index === 0) return order(base, course, ctx, `${p} para ${ctx.composition.split(";")[0]}, complete a composição em duas etapas.`, ["avaliar a função interna", "entregar o resultado à função externa", "comparar com o domínio de uso"], "A função mais interna age primeiro.", "A ordem interna → externa foi respeitada.", "Comece pelo trecho dentro dos parênteses.");
      if (index === 1) return fill(base, course, ctx, `${p} a função affine do curso é ${ctx.affine}; complete a inversa.`, [{ label: "função inversa", options: [ctx.inverse, "a função original", "o domínio sem restrições"] }], "Isole a entrada e troque o papel de x e y.", `A inversa do modelo é ${ctx.inverse}.`, "Resolva a equação para a entrada original.");
      return choice(base, course, ctx, `${p} no exemplo ${ctx.composition}, qual é o resultado?`, [ctx.compositionAnswer, "o valor não pode ser calculado", "a inversa troca a ordem das operações"], "Avalie primeiro a função interna.", `O resultado contextual é ${ctx.compositionAnswer}.`, "Não derive quando a tarefa pede apenas composição ou substituição.");
    }

    if (definition.id === "m2-1") {
      if (index === 0) return choice(base, course, ctx, `${p} o que significa olhar o limite de ${ctx.model}?`, ["observar a tendência quando a entrada se aproxima do ponto, mesmo que o valor no ponto falte", "substituir o ponto e obter exatamente o valor", "esperar que a entrada atinja o ponto"], "Troque “chegar” por “chegar perto”.", "Você separou limite e valor no ponto.", "O limite observa a vizinhança.");
      if (index === 1) return order(base, course, ctx, `${p} para ${ctx.model}, ordene a leitura do limite ${ctx.technique}.`, ["observar o modelo de perto", "reconhecer a tendência", "comparar com o valor no ponto", "concluir o limite contextual"], "Leia a tendência antes do valor isolado.", "A tendência foi separada do valor no ponto.", "Um ponto isolado não cancela o padrão dos vizinhos.");
      return choice(base, course, ctx, `${p} no modelo ${ctx.model}, qual é o limite indicado em ${ctx.point}?`, [ctx.limit, "o valor de uma medição", "zero por definição"], "Verifique se há descontinuidade antes de dividir.", `O limite do modelo é ${ctx.limit}.`, "Confira a existência do limite e a unidade.");
    }

    if (definition.id === "m2-2") {
      if (index === 0) return order(base, course, ctx, `${p} ordene a análise lateral do modelo ${ctx.model}.`, ["avaliar o trecho pela esquerda", "avaliar o trecho pela direita", "comparar os dois resultados", "concluir sobre o limite bilateral"], "O sinal do denominador ou da expressão muda conforme o lado.", "Os limites laterais foram comparados.", "Analise a mesma grandeza nos dois lados do ponto.");
      if (index === 1) return choice(base, course, ctx, `${p} em ${ctx.model}, um colega confundiu o limite com o valor no ponto. Qual é a correção?`, [`${ctx.pointValue} é o valor no ponto; ${ctx.limit} é o comportamento de vizinhança`, "o limite é sempre igual ao valor no ponto", "o valor no ponto elimina o limite"], "Compare o valor no ponto com a tendência.", "A distinção entre limite e valor ficou explícita.", "A existência de um limite não prova continuidade.");
      return choice(base, course, ctx, `${p} para ${ctx.model}, em ${ctx.atPoint}, qual é a leitura contextual?`, [ctx.pointValue, "a função é automaticamente contínua em todo real", "o limite lateral é zero"], "Confira o sinal e o domínio de uso.", `A leitura correta é ${ctx.pointValue}.`, "Não troque o valor no ponto pelo limite.");
    }

    if (definition.id === "m2-3") {
      if (index === 0) return order(base, course, ctx, `${p} escolha uma técnica para ${ctx.technique}.`, ["identificar a indeterminação", "fatorar ou separar potências", "cancelar somente no limite", "conferir o valor final"], "A técnica deve corresponder à forma que apareceu.", "A técnica foi escolhida pela estrutura do modelo.", "Não substitua antes de simplificar quando surge 0/0.");
      if (index === 1) return choice(base, course, ctx, `${p} qual é o limite de longo prazo do modelo contextual?`, [ctx.longLimit, "zero por padrão", "o valor de entrada inicial"], "Compare os graus ou divida por t para o modelo do curso.", `O limite de longo prazo é ${ctx.longLimit}.`, "O comportamento de longo prazo depende da estrutura do modelo.");
      return choice(base, course, ctx, `${p} ao registrar o resultado contextual ${ctx.technique}, qual procedimento deve ser preservado?`, ["simplificar, conferir o domínio e somente então usar uma técnica", "dividir 0/0 e declarar zero", "substituir o limite pelo valor em um ponto que não pertence ao domínio"], "A forma 0/0 não é um resultado; a técnica deve respeitar as hipóteses.", "A técnica e suas hipóteses foram separadas.", "Confirme a simplificação e o domínio.");
    }

    if (definition.id === "m2-4") {
      if (index === 0) return choice(base, course, ctx, `${p} no modelo ${ctx.model}, o que acontece em ${ctx.atPoint}?`, [`${ctx.pointValue}; o limite e o valor no ponto precisam ser comparados`, "o limite e o valor no ponto são sempre iguais", "a descontinuidade desaparece por definição"], "Compare limite, domínio e valor definido.", "A descontinuidade foi localizada no modelo.", "A existência do limite não substitui a comparação do valor.");
      if (index === 1) return pair(base, course, ctx, `${p} associe o modelo do curso ao comportamento no ponto.`, [
        { left: ctx.model, options: [ctx.continuity, "descontinuidade por salto em todos os pontos", "função constante"], answer: 0 },
        { left: "f(x) = 1/x", options: [ctx.continuity, "assíntota vertical em x = 0", "buraco removível em x = 1"], answer: 1 },
        { left: "f(a) ≠ lim(x→a) f(x)", options: [ctx.continuity, "descontinuidade removível", "continuidade automática"], answer: 2 }
      ], "Procure domínio, salto e igualdade entre limite e valor.", "Os comportamentos foram separados.", "A mesma expressão pode ter comportamentos diferentes em pontos diferentes.");
      return choice(base, course, ctx, `${p} no domínio de uso do curso, ${ctx.model} é contínua?`, [ctx.continuity, "não, porque todo racional tem salto", "sim, sem verificar o denominador"], "A continuidade só falha onde a expressão não está definida ou há salto.", `A leitura correta é ${ctx.continuity}.`, "Não confunda intervalo de uso com denominador nulo.");
    }

    if (definition.id === "m3-1") {
      if (index === 0) return choice(base, course, ctx, `${p} para ${ctx.model}, o que ${ctx.derivative} permite interpretar?`, ["a taxa instantânea do modelo no instante considerado", "o valor acumulado em todo o período", "a unidade do recurso sem derivada"], "A derivada mede taxa local.", "A taxa foi separada do acumulado.", "Não confunda valor da função e sua derivada.");
      if (index === 1) return fill(base, course, ctx, `${p} complete a leitura de ${ctx.model}.`, [
        { label: "derivada", options: [ctx.derivative, "a função original", "o valor inicial"] },
        { label: "ponto", options: [ctx.derivativePoint, "o limite no infinito", "o domínio inteiro"] },
        { label: "taxa no ponto", options: [ctx.derivativeValue, "zero por padrão", "a unidade do tempo"] }
      ], "Derive ou use a cadeia e substitua o ponto.", `A leitura correta é ${ctx.derivativeValue}.`, "A taxa deve ser avaliada no instante solicitado.");
      return choice(base, course, ctx, `${p} no modelo ${ctx.model}, ${ctx.modelValue} é o valor acumulado ou a taxa?`, ["é o valor da função no instante; a taxa é a derivada", "é a taxa instantânea", "não é informação do modelo"], "A unidade e o apóstrofo revelam a diferença.", "O valor acumulado foi separado da taxa.", "Resposta sem derivada não é taxa.");
    }

    if (definition.id === "m3-2") {
      if (index === 0) return fill(base, course, ctx, `${p} diferencie a expressão contextual ${ctx.model} e complete a estrutura.`, [
        { label: "regra principal", options: [ctx.derivative, "a função original", "o valor no ponto"] },
        { label: "ponto de leitura", options: [ctx.derivativePoint, "o limite no infinito", "o domínio completo"] },
        { label: "taxa no ponto", options: [ctx.derivativeValue, "zero sem cálculo", "a unidade do tempo"] }
      ], "Identifique a regra estrutural antes de derivar.", `A derivada contextual resulta em ${ctx.derivative}.`, "Não pare antes de substituir o ponto quando a pergunta pede a taxa.");
      if (index === 1) return choice(base, course, ctx, `${p} qual regra é mais direta para ${ctx.model}?`, ["cadeia, porque a função tem camadas", "soma, porque todos os termos são independentes", "logaritmo, porque aparece uma variável"], "Observe a composição antes de calcular.", "A estrutura da função foi identificada.", "A regra depende da forma, não do nome do curso.");
      return choice(base, course, ctx, `${p} para ${ctx.model}, qual é o valor de ${ctx.derivative} em ${ctx.derivativePoint}?`, [ctx.derivativeValue, "o valor acumulado no período", "zero por definição"], "Derive e substitua o ponto.", `A taxa contextual é ${ctx.derivativeValue}.`, "Confira a unidade e a expressão da derivada.");
    }

    if (definition.id === "m3-3") {
      const model = course.formula;
      if (index === 0) return choice(base, course, ctx, `${p} no modelo ${model}, qual é a função interna?`, [course.inner, course.outer, course.derivative], "Procure o trecho que contém diretamente a variável.", `A função interna é ${course.inner}.`, "A externa recebe o resultado da interna.");
      if (index === 1) return fill(base, course, ctx, `${p} complete a regra da cadeia para ${model}.`, [
        { label: "derivada externa", options: [course.outerDerivative, course.innerDerivative, course.derivative] },
        { label: "derivada interna", options: [course.innerDerivative, course.outerDerivative, course.derivative] },
        { label: "resultado", options: [course.derivative, course.outerDerivative, course.innerDerivative] }
      ], `Derive ${course.outer} e depois ${course.inner}.`, `A corrente correta é ${course.outerDerivative} × ${course.innerDerivative} = ${course.derivative}.`, "A derivada interna não pode ser esquecida.");
      if (index === 2) return choice(base, course, ctx, `${p} um colega derivou ${course.outer} e parou. Em qual etapa a corrente foi perdida?`, ["na multiplicação pela derivada interna", "na definição da função interna", "na escolha do contexto"], "A corrente tem duas etapas.", `Falta multiplicar por ${course.innerDerivative}.`, "A linha que deriva a externa precisa ser multiplicada pela interna.");
      return pair(base, course, ctx, `${p} associe funções e derivadas no contexto do curso.`, [
        { left: model, options: [course.derivative, course.outerDerivative, course.innerDerivative], answer: 0 },
        { left: "f(x) = sen(x)", options: ["cos(x)", "−sen(x)", "1"], answer: 0 },
        { left: "g(x) = e^x", options: ["e^x", "1/e^x", "x e^x"], answer: 0 }
      ], "O primeiro par exige cadeia; os demais usam regras básicas.", `No contexto de ${course.name}, a corrente termina em ${course.derivative}.`, "Confira o primeiro par e não esqueça a camada interna.");
    }

    if (definition.id === "m3-4") {
      if (index === 0) return pair(base, course, ctx, `${p} associe o modelo do curso e as funções especiais às derivadas.`, [
        { left: ctx.model, options: [ctx.derivative, "a derivada oposta", "a função original"], answer: 0 },
        { left: "sen(x)", options: ["−sen(x)", "cos(x)", "1/x"], answer: 1 },
        { left: "cos(x)", options: ["cos(x)", "−sen(x)", "1/x"], answer: 1 },
        { left: "ln(x)", options: ["cos(x)", "−sen(x)", "1/x"], answer: 2 }
      ], "Identifique primeiro a família da função e confira a cadeia no modelo do curso.", "As quatro famílias foram reconhecidas.", "O logaritmo exige x > 0.");
      if (index === 1) return choice(base, course, ctx, `${p} para o modelo especial ${ctx.special}, qual é a derivada?`, [ctx.specialDerivative, ctx.special, "a própria função sem constante"], "A regra da cadeia inclui o expoente ou a base.", `A derivada contextual é ${ctx.specialDerivative}.`, "Não esqueça o fator da variável interna.");
      return choice(base, course, ctx, `${p} qual operação matemática é representada pela relação ${ctx.related}?`, ["uma taxa relacionada que exige derivada implícita ou cadeia", "a definição de limite", "uma integral indefinida"], "Identifique a relação entre as variáveis antes de derivar.", "A estrutura da taxa relacionada foi identificada.", "Derive a relação e depois isole a taxa pedida.");
    }

    if (definition.id === "m4-1") {
      if (index === 0) return choice(base, course, ctx, `${p} se ${ctx.derivative} > 0 no intervalo, o modelo ${ctx.model} está:`, ["crescendo", "decrescendo", "constante"], "O sinal da derivada descreve a inclinação.", "O sinal foi ligado à monotonicidade.", "Não confunda sinal com módulo da taxa.");
      if (index === 1) return choice(base, course, ctx, `${p} no modelo ${ctx.model}, ${ctx.derivative} tem o sinal esperado para ${ctx.story}?`, [ctx.derivative, "sempre positivo por definição", "sempre zero"], "Analise o sinal e a unidade da taxa.", `A leitura contextual é ${ctx.derivative}.`, "Leia o sinal da expressão no intervalo considerado.");
      return choice(base, course, ctx, `${p} se a primeira derivada é positiva e a segunda é negativa, o que isso indica para ${ctx.model}?`, ["a curva está crescendo e desacelerando", "a curva está crescendo e acelerando", "a curva está decrescendo e acelerando"], "A primeira derivada responde cresce? A segunda responde acelera?", "Sinal positivo com concavidade para baixo indica crescimento desacelerado.", "Verifique os sinais antes de interpretar.");
    }

    if (definition.id === "m4-2") {
      if (index === 0) return choice(base, course, ctx, `${p} para ${ctx.model}, qual é o ponto crítico destacado pelo modelo?`, [ctx.optimum, "qualquer ponto do gráfico", "o valor do eixo vertical sem derivar"], "Derive e procure onde a taxa muda de sinal.", `O ponto crítico contextual é ${ctx.optimum}.`, "Um candidato só é extremo quando o sinal ou a segunda derivada confirma.");
      if (index === 1) return order(base, course, ctx, `${p} monte a leitura de ${ctx.model} para classificar seu extremo.`, ["calcular a derivada", "encontrar o crítico", "classificar com sinal ou segunda derivada", "avaliar a função no ponto"], "Teste um ponto de cada intervalo.", "A classificação do extremo foi construída.", "Não pare nos candidatos sem classificação.");
      return choice(base, course, ctx, `${p} qual afirmação é correta sobre a curvatura do modelo ${ctx.model}?`, ["um zero da segunda derivada é candidato; o sinal da função ou da segunda derivada confirma a natureza", "zero da segunda derivada sempre é mínimo", "o valor da função no ponto basta"], "Não confunda candidato com conclusão.", "O teste de curvatura foi separado do ponto crítico.", "Analise o que ocorre antes e depois do ponto.");
    }

    if (definition.id === "m4-3") {
      if (index === 0) return order(base, course, ctx, `${p} para ${ctx.model}, monte a sequência de otimização do curso.`, ["escrever a restrição", "definir a função objetivo", "derivar e zerar", "classificar", "calcular o valor extremo"], "A restrição vem antes do cálculo.", `A sequência termina em ${ctx.optimumValue}.`, "Volte sempre à pergunta original.");
      if (index === 1) return choice(base, course, ctx, `${p} qual é o valor extremo do modelo ${ctx.model}?`, [ctx.optimumValue, "o domínio inteiro", "apenas o valor inicial"], "Derive, classifique e substitua no objetivo.", `O valor contextual é ${ctx.optimumValue}.`, "Encontrar o ponto crítico sem calcular o valor não responde à otimização.");
      return choice(base, course, ctx, `${p} qual condição identifica o extremo do modelo ${ctx.model}?`, [ctx.related, "a segunda derivada do objetivo", "o limite no infinito"], "Derive a relação e mantenha as unidades.", "A condição contextual foi identificada.", "Não trate a variável dependente como constante.");
    }

    if (definition.id === "m4-4") {
      if (index === 0) return order(base, course, ctx, `${p} audite ${ctx.technique} antes de escolher uma técnica.`, ["verificar a forma 0/0", "fatorar o modelo", "cancelar com a hipótese correta", "conferir limite e valor"], "L’Hôpital não é uma autorização automática.", "A hipótese foi verificada antes da técnica.", "Primeiro simplifique quando a forma permitir.");
      if (index === 1) return choice(base, course, ctx, `${p} um estudante aplicou L’Hôpital a ${ctx.model}, que não tinha forma 0/0. Qual é o erro?`, ["a regra exige verificar a forma e as hipóteses antes de diferenciar", "a regra sempre converte frações em zero", "a derivada de uma constante é a própria constante"], "Leia a forma do limite primeiro.", "A aplicação indevida foi identificada.", "Não use a regra sem confirmar a hipótese.");
      return choice(base, course, ctx, `${p} no modelo ${ctx.model}, qual conjunto é coerente para a auditoria?`, [`${ctx.limit}; ${ctx.pointValue}`, `${ctx.pointValue}; ${ctx.limit}`, "todos os valores são iguais por definição"], "Confira limite, valor no ponto, sinal e unidade.", `O conjunto coerente usa ${ctx.limit} e ${ctx.pointValue}.`, "A consistência do modelo precisa ser verificada.");
    }

    if (definition.id === "m5-1") {
      if (index === 0) return choice(base, course, ctx, `${p} qual é o total da taxa contextual ${ctx.rate} no intervalo ${ctx.point}?`, [ctx.total, "o valor da taxa no instante final", "a derivada da taxa no instante final"], "Some taxas ao longo do intervalo.", `O acumulado contextual é ${ctx.total}.`, "O valor final de uma taxa não é o total.");
      if (index === 1) return order(base, course, ctx, `${p} ordene a construção da integral de Riemann para ${ctx.model}.`, ["delinear o intervalo", "fatiar", "somar", "afinar", "calcular o limite"], "A integral é o limite de somas.", "A construção da soma ficou correta.", "A última etapa é o limite, não o desenho.");
      return fill(base, course, ctx, `${p} quais são a antiderivativa e o total de ${ctx.rate} em ${ctx.point}?`, [
        { label: "função acumulada", options: [ctx.antiderivative, "a taxa original", "o valor final da taxa"] },
        { label: "total no intervalo", options: [ctx.total, "a taxa no instante final", "o limite da função"] }
      ], "Integre a taxa e calcule a diferença entre os limites.", `A antiderivativa é ${ctx.antiderivative} e o total é ${ctx.total}.`, "A taxa virou acumulado com a unidade correta.");
    }

    if (definition.id === "m5-2") {
      if (index === 0) return choice(base, course, ctx, `${p} qual antiderivativa representa a taxa contextual do curso?`, [ctx.antiderivative, ctx.rate, "a própria taxa sem derivar"], "Derive a alternativa para recuperar a taxa.", `A antiderivativa contextual é ${ctx.antiderivative}.`, "A constante de integração não elimina a verificação por derivação.");
      if (index === 1) return order(base, course, ctx, `${p} use a substituição ${ctx.substitution} na expressão do curso.`, ["escolher u", "calcular du", "integrar", "voltar para a variável original", "derivar para conferir"], "Procure u e du juntos.", "A cadeia foi desfeita e a variável voltou corretamente.", "Troque toda a integral, não apenas um termo.");
      return choice(base, course, ctx, `${p} ao usar a substituição ${ctx.substitution}, qual procedimento deve ser preservado?`, ["preservar o fator de du e adicionar a constante de integração", "descartar o coeficiente e omitir a constante", "trocar a integral por um limite"], "Compare o coeficiente de du antes de integrar.", "O procedimento de substituição foi preservado.", "A constante de integração deve ser adicionada ao final.");
    }

    if (definition.id === "m5-3") {
      if (index === 0) return choice(base, course, ctx, `${p} se F′ = f, qual expressão calcula a integral definida do modelo?`, ["F(b) − F(a)", "F(a) − F(b)", "F(b) + C"], "A regra é fim menos início.", "A ordem dos limites ficou explícita.", "Confira a ordem e a unidade do acumulado.");
      if (index === 1) return fill(base, course, ctx, `${p} calcule o total de ${ctx.rate} no intervalo ${ctx.point} usando o FTC.`, [
        { label: "antiderivativa", options: [ctx.antiderivative, "a taxa original", "o limite no infinito"] },
        { label: "resultado", options: [ctx.total, "a taxa no ponto final", "zero por omissão"] }
      ], "Aplique F(b) − F(a) e não substitua o limite inferior por outro ponto.", `O total contextual é ${ctx.total}.`, "Confira os limites antes de subtrair.");
      return choice(base, course, ctx, `${p} o que o valor contextual ${ctx.total} representa?`, ["um acumulado no intervalo, não a taxa em um instante", "a taxa instantânea final", "a imagem da função sem integral"], "Unidade e sentido revelam o papel da integral.", "O acumulado foi interpretado corretamente.", "Integral definida retorna um total do intervalo.");
    }

    if (definition.id === "m5-4") {
      if (index === 0) return choice(base, course, ctx, `${p} no modelo ${ctx.model}, no intervalo ${ctx.point}, o que a integral representa no contexto do curso?`, [ctx.total, "a taxa no instante final", "o valor de uma variável sem intervalo"], "A área ou o total é acumulado no intervalo.", `O resultado contextual é ${ctx.total}.`, "Não confunda a taxa instantânea com o total.");
      if (index === 1) return order(base, course, ctx, `${p} resolva a EDO contextual ${ctx.ode}.`, ["separar as variáveis", "integrar", "usar a condição inicial", "obter a solução do curso"], "A condição inicial escolhe a constante.", `A solução contextual é ${ctx.ode}.`, "Não esqueça a condição inicial.");
      return choice(base, course, ctx, `${p} qual informação contextual é compatível com ${ctx.ode}?`, [ctx.halfLife, "a meia-vida é sempre o valor inicial dividido por dois", "a solução não depende da condição inicial"], "Use a solução e a constante do modelo.", `A leitura coerente é ${ctx.halfLife}.`, "A condição inicial é indispensável para a solução.");
    }

    return attach(base, course, ctx, {
      prompt: `${p} ${base.prompt}`,
      contextual: true
    });
  }

  function resolveLesson(definition, course, attemptSeed) {
    const pack = contexts[course.slug];
    if (!pack || !pack[definition.moduleId] || typeof window.resolveRandomActivity !== "function") return null;
    const personalizedIndex = definition.activities.length - 1;
    const activities = definition.activities.map((activity, index) => {
      if (index === personalizedIndex) return resolveActivity(definition, course, activity, index);
      return window.resolveRandomActivity(definition, index, attemptSeed);
    });
    if (activities.some((activity) => !activity)) return null;
    return activities;
  }

  window.CapyCourseContexts = Object.freeze(contexts);
  window.resolveCourseActivities = resolveLesson;
})();
