/* Random didactic activity generator for CapyCalculus.
 * Each new seed produces different numbers and results while preserving the canonical activity sequence.
 * Generated values are fictional teaching values, not empirical or professional recommendations.
 */
(function () {
  "use strict";

  function rng(seed) {
    let state = (Number(seed) ^ 0x9e3779b9) >>> 0;
    return function () {
      state += 0x6D2B79F5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function int(random, min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  function pick(random, values) {
    return values[int(random, 0, values.length - 1)];
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a || 1;
  }

  function fraction(n, d) {
    const divisor = gcd(n, d);
    const numerator = n / divisor;
    const denominator = d / divisor;
    return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
  }

  function coefficient(n, d = 1) {
    if (n % d === 0) return String(n / d);
    return `${n}/${d}`;
  }

  function decimal(value) {
    return Number(value.toFixed(3)).toString().replace(".", ",");
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function optionList(correct, distractors, answer = 0) {
    const values = [String(correct)];
    for (const item of distractors) {
      const value = String(item);
      if (!values.includes(value)) values.push(value);
    }
    let suffix = 1;
    while (values.length < 3) values.push(`valor auxiliar ${suffix++}`);
    const current = values.shift();
    values.splice(answer, 0, current);
    return values;
  }

  function fieldsFrom(base, specs) {
    return base.fields.map((field, index) => Object.assign({}, field, {
      options: optionList(specs[index].correct, specs[index].wrong, field.answer)
    }));
  }

  function pairsFrom(base, specs) {
    return base.pairs.map((pair, index) => Object.assign({}, pair, {
      left: specs[index].left || pair.left,
      options: optionList(specs[index].correct, specs[index].wrong, pair.answer)
    }));
  }

  function questionText(value) {
    const text = String(value || "").trim();
    if (text.endsWith(":")) return `${text.slice(0, -1)}?`;
    if (text.endsWith(".")) return `${text.slice(0, -1)}?`;
    return text.endsWith("?") ? text : `${text}?`;
  }

  function make(canonicalBase, seed, changes) {
    const resolved = Object.assign(clone(canonicalBase), changes || {});
    if (resolved.prompt) resolved.prompt = questionText(resolved.prompt);
    return Object.assign(resolved, {
      generated: true,
      contextual: false,
      contextResolved: false,
      dataStatus: "generated-didactic",
      attemptSeed: Number(seed) >>> 0,
      sourceRef: "site/activity-generator.js"
    });
  }

  function resolveRandomActivity(definition, index, seed) {
    const base = definition.activities[index];
    const canonicalBase = Object.assign({}, base, {
      difficulty: index === 0 ? "easy" : index === 1 ? "medium" : "hard"
    });
    const random = rng(seed + index * 7919 + definition.id.split("-")[1] * 104729);
    const a = int(random, 2, 9);
    const b = int(random, 2, 9);
    const c = int(random, 2, 9);
    const d = int(random, 2, 9);
    const p = int(random, 1, 6);
    const q = int(random, 2, 8);

    if (definition.id === "m1-1") {
      if (index === 0) {
        const num = a * d + c * b;
        const den = b * d;
        return make(canonicalBase, seed, {
          prompt: `Complete: ${a}/${b} + ${c}/${d} = [__]; x^${a} · x^${c} = x^[__]; (x^${a})^${c} = x^[__].`,
          fields: fieldsFrom(base, [
            { correct: fraction(num, den), wrong: [fraction(num + 1, den), fraction(num, den + 1)] },
            { correct: `x^${a + c}`, wrong: [`x^${a + c + 1}`, `x^${a + c - 1}`] },
            { correct: `x^${a * c}`, wrong: [`x^${a * c + 1}`, `x^${a * c - 1}`] }
          ]),
          hint: "Use denominadores comuns; some expoentes na multiplicação e multiplique na potência de potência.",
          correct: `As três respostas são ${fraction(num, den)}, x^${a + c} e x^${a * c}.`,
          retry: "Confira cada regra separadamente antes de escolher as lacunas."
        });
      }
      if (index === 1) {
        const result = a + b * c;
        return make(canonicalBase, seed, {
          prompt: `Um colega escreveu ${a} + ${b} × ${c} = ${result}. Essa igualdade está correta?`,
          options: optionList(`Sim, porque ${b} × ${c} = ${b * c} e ${a} + ${b * c} = ${result}`, [`Não, porque ${a} + ${b} × ${c} = (${a} + ${b}) × ${c}`, `Não, porque ${a} + ${b} × ${c} = ${a} + ${b * c + 1}`], base.answer),
          hint: "A multiplicação tem precedência sobre a adição.",
          correct: `Sim: ${a} + ${b} × ${c} = ${a} + ${b * c} = ${result}.`,
          retry: `A precedência indica primeiro ${b} × ${c} = ${b * c}.`
        });
      }
      const result = a * b;
      return make(canonicalBase, seed, {
        prompt: `Um reservatório didático recebe ${a} litros por hora durante ${b} horas. Quantos litros recebe?`,
        options: optionList(`${result} L`, [`${result + a} L`, `${Math.max(1, result - a)} L`], base.answer),
        hint: "Multiplique a taxa constante pelo tempo.",
        correct: `${a} L/h × ${b} h = ${result} L.`,
        retry: "A unidade L/h multiplicada por h resulta em L."
      });
    }

    if (definition.id === "m1-2") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Qual é o domínio de g(x) = ${a}/(x − ${b})?`,
          options: optionList(`todos os reais, exceto x = ${b}`, [`x ≥ ${b}`, `somente x > 0`], base.answer),
          hint: "O denominador não pode ser zero.",
          correct: `O domínio é ℝ \\ {${b}}.`,
          retry: `Encontre o valor que anula x − ${b}.`
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: "Associe cada função à característica do domínio.",
          pairs: pairsFrom(base, [
            { left: `f(x) = √(x − ${a})`, correct: `x ≥ ${a}`, wrong: [`x ≠ ${a}`, "todos os reais"] },
            { left: `g(x) = 1/(x − ${b})`, correct: `x ≠ ${b}`, wrong: [`x ≥ ${b}`, "todos os reais"] },
            { left: `h(x) = ${a}x − ${b}`, correct: "todos os reais", wrong: [`x ≥ ${a}`, `x ≠ ${b}`] }
          ]),
          hint: "Raiz exige radicando não negativo; denominador exige valor não nulo.",
          correct: "Os três domínios foram associados corretamente.",
          retry: "Confira a restrição específica de cada expressão."
        });
      }
      return make(canonicalBase, seed, {
        prompt: `No modelo C(p) = ${a * 100}p/(p + ${b}), com p > 0, qual é o domínio de uso?`,
        options: optionList(`p > 0; o valor p = −${b} está fora do uso`, ["todos os reais", "somente p = 0"], base.answer),
        hint: "Separe a restrição de uso p > 0 do domínio algébrico.",
          correct: `O uso didático exige p > 0, e p = −${b} também anula o denominador.`,
        retry: "Contexto físico e domínio algébrico não são o mesmo conjunto."
      });
    }

    if (definition.id === "m1-3") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: "Associe cada expressão à família correta do gráfico.",
          pairs: pairsFrom(base, [
            { left: `f(x) = ${a}x² + ${b}`, correct: "parábola", wrong: ["reta", "hipérbole"] },
            { left: `g(x) = ${b}x + ${a}`, correct: "reta", wrong: ["parábola", "hipérbole"] },
            { left: `h(x) = ${a}/(x + ${b})`, correct: "hipérbole", wrong: ["parábola", "reta"] }
          ]),
          hint: "Observe o grau, o termo constante e o denominador de cada expressão.",
          correct: "As três famílias foram identificadas corretamente.",
          retry: "O grau e o denominador ajudam a identificar a família."
        });
      }
      if (index === 1) {
        const shift = int(random, 1, 5);
        return make(canonicalBase, seed, {
          prompt: `A função f(x) = ${a}x + ${b} foi transformada em F(x) = f(x + ${shift}). Qual é a transformação?`,
          options: optionList(`translação horizontal de ${shift} ${shift === 1 ? "unidade" : "unidades"} para a esquerda`, [`translação horizontal de ${shift} ${shift === 1 ? "unidade" : "unidades"} para a direita`, `translação vertical de ${shift} ${shift === 1 ? "unidade" : "unidades"}`], base.answer),
          hint: "x + c move o gráfico para a esquerda.",
          correct: `Substituir x por x + ${shift} desloca o gráfico ${shift} unidades para a esquerda.`,
          retry: "O sinal dentro do parêntese determina o sentido do deslocamento."
        });
      }
      const value = a * b + c;
      return make(canonicalBase, seed, {
        prompt: `Para h(x) = ${a}x² + ${c}, qual é h(${b})?`,
        options: optionList(`${value}`, [`${value + a}`, `${value - a}`], base.answer),
        hint: `Substitua x = ${b} e eleve ${b} ao quadrado.`,
        correct: `h(${b}) = ${a}·${b}² + ${c} = ${value}.`,
        retry: "A potência deve ser calculada antes da multiplicação."
      });
    }

    if (definition.id === "m1-4") {
      if (index === 0) {
        const inner = c * c;
        const outer = a * inner + b;
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = ${a}x + ${b} e g(x) = ${c}x², calcule f(g(${c})) ordenando as etapas.`,
          items: [`Avaliar g(${c}) = ${inner}`, `Avaliar f(${inner}) = ${outer}`, `Concluir f(g(${c})) = ${outer}`],
          hint: "A função interna age primeiro.",
          correct: `A ordem correta termina em f(g(${c})) = ${outer}.`,
          retry: "Comece pela função dentro dos parênteses."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Complete a inversa de f(x) = ${a}x + ${b}: y − ${b} = ${a}x; f⁻¹(y) = [__].`,
          fields: fieldsFrom(base, [{ correct: `(y − ${b})/${a}`, wrong: [`(y + ${b})/${a}`, `${a}y − ${b}`] }]),
          hint: "Isole x e troque o papel da entrada original pela saída y.",
          correct: `A inversa é f⁻¹(y) = (y − ${b})/${a}.`,
          retry: "Resolva a equação para x."
        });
      }
      const inner = c * c;
      const outer = a * inner + b;
      return make(canonicalBase, seed, {
        prompt: `Para f(x) = ${a}x + ${b} e g(x) = ${c}x², qual é f(g(${c}))?`,
        options: optionList(`${outer}`, [`${inner + b}`, `${a * c + b + 1}`], base.answer),
        hint: "Avalie g primeiro e entregue o resultado a f.",
        correct: `g(${c}) = ${inner}; portanto f(g(${c})) = ${outer}.`,
        retry: "Não some as parcelas antes de aplicar a composição."
      });
    }

    if (definition.id === "m2-1") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Se lim(x→${a}) f(x) = ${b}, mas f(${a}) = ${c}, qual afirmação é correta?`,
          options: optionList("O limite observa a vizinhança; o valor no ponto pode ser diferente", ["O limite deve ser igual a f(a)", "O limite só existe se x atingir a"], base.answer),
          hint: "Troque “chegar” por “chegar perto”.",
          correct: "Limite e valor no ponto são conceitos diferentes.",
          retry: "A definição de limite usa valores próximos de a."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = ${b} + ${c}(x − ${a}), a tabela fornece f(${a - 1}) = ${b - c}; f(${a + 1}) = ${b + c}; f(${a}) = ${b}. Como determinar lim(x→${a}) f(x)?`,
          items: [`Observar f(${a - 1}) = ${b - c}`, `Observar f(${a + 1}) = ${b + c}`, `Reconhecer a tendência próxima de ${b}`, `Concluir lim(x→${a}) f(x) = ${b}`],
          hint: "A fórmula linear confirma a tendência dos dois lados.",
          correct: `Como f(x) = ${b} + ${c}(x − ${a}), o limite é ${b}.`,
          retry: "Leia a fórmula e compare os dois lados antes de concluir."
        });
      }
      const sign = a % 2 === 0 ? 1 : -1;
      return make(canonicalBase, seed, {
        prompt: `Qual é lim(x→+∞) (${a}x + ${b})?`,
        options: optionList(sign > 0 ? `+∞` : `−∞`, ["0", `${b}`], base.answer),
        hint: `O coeficiente principal de x é ${sign > 0 ? "positivo" : "negativo"}.`,
        correct: `Como o coeficiente de x é ${sign > 0 ? "positivo" : "negativo"}, o limite é ${sign > 0 ? "+∞" : "−∞"}.`,
        retry: "O termo de maior grau determina o comportamento no infinito."
      });
    }

    if (definition.id === "m2-2") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Ordene a análise de f(x) = 1/(x − ${a}) quando x→${a}.`,
          items: [`x→${a}+: denominador positivo e pequeno → +∞`, `x→${a}−: denominador negativo e pequeno → −∞`, "Os lados são diferentes", "Não existe limite bilateral"],
          hint: "Analise o sinal do denominador em cada lado.",
          correct: "Os limites laterais são +∞ e −∞; o bilateral não existe.",
          retry: "A mesma função muda de sinal conforme o lado."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = x − ${a} se x ≠ ${a} e f(${a}) = ${b}, um colega disse que a função é contínua porque o limite existe. Qual é o erro?`,
          options: optionList(`O limite é 0, mas f(${a}) = ${b}; há descontinuidade removível`, ["O limite não existe", `f(${a}) deveria ser 0 apenas se ${a} = 1`], base.answer),
          hint: "Compare o limite com o valor definido no ponto.",
          correct: "Existência do limite não basta para continuidade.",
          retry: "A continuidade também exige igualdade entre limite e valor no ponto."
        });
      }
      return make(canonicalBase, seed, {
        prompt: `Para f(x) = ${a}/(x − ${b}), qual é o limite lateral pela esquerda de x = ${b}?`,
        options: optionList(`−∞`, ["+∞", `${a}`], base.answer),
          hint: `Para x < ${b}, o denominador é negativo e tende a zero.`,
          correct: `Pela esquerda, ${a}/(x − ${b}) tende a −∞.`,
          retry: "Confira o sinal do denominador antes do ponto."
      });
    }

    if (definition.id === "m2-3") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Ordene o cálculo de lim(x→${a}) (x² − ${a * a})/(x − ${a}).`,
          items: [`Substituir e obter 0/0`, `Fatorar x² − ${a * a} = (x − ${a})(x + ${a})`, `Cancelar x − ${a} para x ≠ ${a}`, `Obter ${a} + ${a} = ${a * 2}`],
          hint: "Use a diferença de quadrados.",
          correct: `A fatoração conduz ao limite ${a * 2}.`,
          retry: "A indeterminação pede simplificação antes da substituição."
        });
      }
      if (index === 1) {
        const leading = fraction(a, c);
        return make(canonicalBase, seed, {
          prompt: `Qual é lim(x→∞) (${a}x² − ${b}x)/(${c}x² + ${d})?`,
          options: optionList(leading, ["0", decimal((a + 1) / c)], base.answer),
          hint: "Os graus são iguais; use a razão dos coeficientes líderes.",
          correct: `O limite é ${a}/${c} = ${leading}.`,
          retry: "Confira o grau do numerador e do denominador."
        });
      }
      return make(canonicalBase, seed, {
        prompt: "Qual é lim(x→0) sen(x)/x, com x em radianos?",
        options: optionList("1", ["0", "+∞"], base.answer),
        hint: "É o limite notável da razão seno por x.",
        correct: "lim(x→0) sen(x)/x = 1, com x em radianos.",
        retry: "A unidade angular precisa estar em radianos."
      });
    }

    if (definition.id === "m2-4") {
      if (index === 0) {
        let pointValue = int(random, 2, 9);
        while (pointValue === a * 2) pointValue = int(random, 2, 9);
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = (x² − ${a * a})/(x − ${a}), com f(${a}) = ${pointValue}, o que acontece em x = ${a}?`,
          options: optionList(`lim = ${a * 2} e f(${a}) = ${pointValue}; há um buraco removível`, [`lim = ${pointValue} e f(${a}) = ${a * 2}`, "a função é contínua"], base.answer),
          hint: "Compare o limite com o valor definido.",
          correct: `O limite é ${a * 2}, mas o valor no ponto é ${pointValue}.`,
          retry: "A existência do limite não substitui a comparação com f(a)."
        });
      }
      if (index === 1) {
        let pointValue = int(random, 2, 9);
        while (pointValue === a * 2) pointValue = int(random, 2, 9);
        return make(canonicalBase, seed, {
          prompt: "Associe cada função ao comportamento no ponto indicado.",
          pairs: pairsFrom(base, [
            { left: "f(x) = x²", correct: "contínua em todos os reais", wrong: ["assíntota vertical", "buraco removível"] },
            { left: `g(x) = ${a}/(x − ${b})`, correct: `assíntota vertical em x = ${b}`, wrong: ["contínua em todos os reais", "buraco removível"] },
            { left: `h(x) = (x² − ${a * a})/(x − ${a}), h(${a}) = ${pointValue}`, correct: `descontinuidade removível em x = ${a}`, wrong: ["contínua em todos os reais", "assíntota vertical"] }
          ]),
          hint: "Procure domínio, salto e igualdade entre limite e valor.",
          correct: "Os três comportamentos foram separados.",
          retry: "A mesma expressão pode ter comportamentos diferentes em pontos diferentes."
        });
      }
      return make(canonicalBase, seed, {
        prompt: `Para p(x) = ${a}x² + ${b}x + ${c}, qual é o domínio?`,
        options: optionList("todos os reais", [`x ≥ ${a}`, `x ≠ ${c}`], base.answer),
        hint: "O polinômio não possui radical nem denominador.",
        correct: "O domínio de um polinômio é todos os reais.",
        retry: "Procure restrições na expressão; o polinômio não tem nenhuma."
      });
    }

    if (definition.id === "m3-1") {
      if (index === 0) {
        const lo = Math.min(a, b);
        const hi = Math.max(a, b) + (a === b ? 1 : 0);
        return make(canonicalBase, seed, {
          prompt: `Se f′(x) > 0 em (${lo}, ${hi}), o que é verdade sobre f?`,
          options: optionList(`f é crescente em (${lo}, ${hi})`, [`f é decrescente em (${lo}, ${hi})`, `f é constante em (${lo}, ${hi})`], base.answer),
          hint: "Inclinação positiva indica crescimento.",
          correct: "f′ > 0 indica que f é crescente no intervalo.",
          retry: "O sinal da derivada descreve o sentido da curva."
        });
      }
      if (index === 1) {
        const derivative = 2 * a * p + b;
        const functionValue = a * p * p + b * p;
        let distractor = 2 * a * p + 1;
        if (distractor === derivative) distractor += 1;
        if (distractor === functionValue) distractor += 1;
        return make(canonicalBase, seed, {
          prompt: `Para h(x) = ${a}x² + ${b}x, qual é h′(${p})?`,
          options: optionList(`${derivative}`, [`${functionValue}`, `${distractor}`], base.answer),
          hint: "Derive termo a termo antes de substituir.",
          correct: `h′(x) = ${2 * a}x + ${b}; logo h′(${p}) = ${derivative}.`,
          retry: "Não confunda h(p) com h′(p)."
        });
      }
      return make(canonicalBase, seed, {
        prompt: `Em um modelo didático de quantidade, S(t) = ${a}t unidades, com t em horas; S(${p}) = ${a * p} foi chamado de taxa de incremento. Qual é o erro?`,
        options: optionList("S(p) é valor acumulado; a taxa é S′(p) em unidades por hora", ["S(p) já é uma derivada", "não existe taxa nesse modelo"], base.answer),
        hint: "A unidade e o apóstrofo revelam a diferença.",
        correct: "A função informa o acumulado; sua derivada informa a taxa por hora.",
        retry: "Responde quanto há; derivada responde quão rápido."
      });
    }

    if (definition.id === "m3-2") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Derive f(x) = ${a}x⁴ − ${b}x + ${c}, completando as parcelas.`,
          fields: fieldsFrom(base, [
            { correct: `${4 * a}x³`, wrong: [`${a}x³`, `${4 * a}x`] },
            { correct: `−${b}`, wrong: [`${b}`, `−${b}x`] },
            { correct: "0", wrong: ["1", "x"] }
          ]),
          hint: "Aplique a regra da potência e derive a constante como zero.",
          correct: `f′(x) = ${4 * a}x³ − ${b}.`,
          retry: "A constante tem derivada zero."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Qual regra é mais direta para R(x) = ${a}x(${b} − x)?`,
          options: optionList("produto", ["cadeia", "logaritmo"], base.answer),
          hint: "Há dois fatores que dependem de x.",
          correct: "R é um produto de dois fatores dependentes de x.",
          retry: "Observe quantos fatores dependem da variável."
        });
      }
      const value = a * b - 2 * a * p;
      return make(canonicalBase, seed, {
        prompt: `Para R(x) = ${a}x(${b} − x), qual é R′(${p})?`,
        options: optionList(`${value}`, [`${a * b}`, `${a * b + 1}`], base.answer),
        hint: `Derive: R′(x) = ${a}·(${b} − 2x).`,
        correct: `R′(${p}) = ${a}·(${b} − 2·${p}) = ${value}.`,
        retry: "Confira o sinal do termo que envolve x."
      });
    }

    if (definition.id === "m3-3") {
      const n = int(random, 2, 4);
      const inner = `${a}x + ${b}`;
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Na função F(x) = (${inner})^${n}, qual é a função interna?`,
          options: optionList(`u = ${inner}`, [`F = u^${n}`, `F′ = ${n * a}(${inner})^${n - 1}`], base.answer),
          hint: "É o trecho que contém diretamente x.",
          correct: `A função interna é u = ${inner}.`,
          retry: "A externa recebe u; o trecho com x é a interna."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Complete F′(x) = [externa] × [interna] = [resultado] para F(x) = (${inner})^${n}.`,
          fields: fieldsFrom(base, [
            { correct: `${n}u^${n - 1}`, wrong: [`u^${n - 1}`, `${n * a + 1}u^${n - 1}`] },
            { correct: `${a}`, wrong: [`${a + 1}`, `${n * a + 1}`] },
            { correct: `${n * a}(${inner})^${n - 1}`, wrong: [`${n}u^${n - 1}`, `${(n + 1)}u^${n - 1}`] }
          ]),
          hint: `Derive a casca e depois a parte ${inner}.`,
          correct: `A corrente correta é ${n}u^${n - 1} × ${a} = ${n * a}(${inner})^${n - 1}.`,
          retry: "A derivada interna não pode ser esquecida."
        });
      }
      if (index === 2) {
        return make(canonicalBase, seed, {
          prompt: `Um colega escreveu: 1. Defina u = ${inner}. 2. Escreva F = u^${n}. 3. Concluiu F′ = ${n}u^${n - 1}. 4. Usou esse resultado. Em qual etapa a corrente foi perdida?`,
          options: optionList("etapa 3, ao omitir a multiplicação por u′", ["etapa 1", "etapa 2", "etapa 4"], base.answer),
          hint: `Depois da derivada externa falta multiplicar por ${a}.`,
          correct: `Na etapa 3 faltou multiplicar por u′ = ${a}.`,
          retry: "A derivada da casca não é a derivada final."
        });
      }
      return make(canonicalBase, seed, {
        prompt: "Associe função e derivada básica.",
        pairs: pairsFrom(base, [
          { left: `F(x) = (${inner})^${n}`, correct: `${n * a}(${inner})^${n - 1}`, wrong: [`${n}u^${n - 1}`, `${a}(${inner})^${n - 1}`] },
          { left: "sen(x)", correct: "cos(x)", wrong: ["−sen(x)", "1/x"] },
          { left: "e^x", correct: "e^x", wrong: ["1/e^x", "x e^x"] }
        ]),
        hint: "Identifique a família de cada função.",
        correct: "As três derivadas básicas foram associadas.",
        retry: "Confira seno, exponencial e potência negativa."
      });
    }

    if (definition.id === "m3-4") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: "Associe cada função especial à sua derivada.",
          pairs: pairsFrom(base, [
            { left: `${a} sen(x)`, correct: `${a} cos(x)`, wrong: [`−${a} sen(x)`, `${a}/x`] },
            { left: `${b} cos(x)`, correct: `−${b} sen(x)`, wrong: [`${b} cos(x)`, `${b}/x`] },
            { left: `e^(${c}x)`, correct: `${c}e^(${c}x)`, wrong: [`e^x`, `e^(${c}x)/${c}`] },
            { left: `ln(x)/${a}`, correct: `1/(${a}x)`, wrong: [`1/x`, `${a}/x`] }
          ]),
          hint: "Identifique primeiro a família da função.",
          correct: "As quatro derivadas foram associadas.",
          retry: "O logaritmo só vale para x > 0."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Qual é N′(x) para N(x) = ${a * 10}e^(${b}x)?`,
          options: optionList(`${a * b * 10}e^(${b}x)`, [`${a * 10}e^(${b}x)`, `${a * b * 10}e^x`], base.answer),
          hint: "A derivada de e^(bx) inclui o fator b.",
          correct: `N′(x) = ${a * b * 10}e^(${b}x).`,
          retry: "Multiplique a derivada da exponencial pelo coeficiente de x."
        });
      }
      return make(canonicalBase, seed, {
        prompt: `Um estudante escreveu (${a}^x)′ = ${a}^x. Qual é a correção?`,
        options: optionList(`(${a}^x)′ = ${a}^x ln(${a})`, ["é correta", `(${a}^x)′ = ${a}`], base.answer),
        hint: "Compare o caso a = e com o caso a > 1 diferente de e.",
        correct: `A base aparece multiplicada por ln(${a}).`,
        retry: "A fórmula geral é (a^x)′ = a^x ln(a)."
      });
    }

    if (definition.id === "m4-1") {
      if (index === 0) {
        const threshold = coefficient(-b, 2 * a);
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = ${a}x² + ${b}, em que intervalo f′(x) > 0?`,
          options: optionList(`x > ${threshold}`, [`x < ${threshold}`, "em todos os reais"], base.answer),
          hint: "Derive a função e resolva a desigualdade f′(x) > 0.",
          correct: `f′(x) = ${2 * a}x + ${b}; portanto f′ > 0 quando x > ${coefficient(-b, 2 * a)}.`,
          retry: "A primeira derivada é uma nova desigualdade."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Para T(t) = ${a} + ${b}e^(−${c}t), qual é o sinal de T′(t) para t ≥ 0?`,
          options: optionList("negativo em todo tempo finito", ["positivo em todo tempo", "sempre zero"], base.answer),
          hint: "A exponencial é positiva; analise o expoente e o coeficiente.",
          correct: `T′(t) = −${b * c}e^(−${c}t) < 0.`,
          retry: "O sinal vem do coeficiente negativo."
      });
      }
      return make(canonicalBase, seed, {
        prompt: "Se f′(x) > 0 e f″(x) < 0, a curva está:",
        options: optionList("crescendo e desacelerando", ["crescendo e acelerando", "decrescendo e acelerando"], base.answer),
        hint: "f′ responde cresce? f″ responde acelera?",
        correct: "Sinal positivo com concavidade para baixo indica crescimento desacelerado.",
        retry: "Separe o sinal da primeira e da segunda derivada."
      });
    }

    if (definition.id === "m4-2") {
      if (index === 0) {
        const vertex = fraction(-b, 2 * a);
        const value = fraction(c * 4 * a - b * b, 4 * a);
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = ${a}x² + ${b}x + ${c}, qual é o mínimo global?`,
          options: optionList(`(${vertex}, ${value})`, [`(0, ${c})`, `(${a}, ${a * a * a + b * a + c})`], base.answer),
          hint: `O vértice ocorre em x = ${vertex}.`,
          correct: `Como o coeficiente de x² é positivo, o vértice é o mínimo: (${vertex}, ${value}).`,
          retry: "Derive, encontre o crítico e substitua no valor da função."
      });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Para f(x) = x³ − ${3 * a * a}x, monte a leitura dos pontos críticos.`,
          items: [`f′(x) = 3x² − ${3 * a * a}`, `Críticos em x = −${a} e x = ${a}`, "Sinais: + → − → +", `Máximo em x = −${a} e mínimo em x = ${a}`],
          hint: "Derive primeiro; teste um ponto de cada intervalo.",
          correct: "A troca de sinal revelou um máximo e um mínimo.",
          retry: "Não pare nos candidatos sem classificar."
        });
      }
      return make(canonicalBase, seed, {
        prompt: `Para f(x) = x⁴ − ${a}x³, foi dito que f″ = 0 sempre indica máximo. Qual é a correção?`,
        options: optionList("f″ = 0 indica candidato; f′ classifica extremo e a variação de f″ pode indicar inflexão", ["zero de f″ é sempre mínimo", "não há inflexão"], base.answer),
        hint: "Use f′ para classificar máximo e mínimo; use a variação de f″ para investigar inflexão.",
        correct: "Zero da segunda derivada, isoladamente, não classifica o ponto: f′ classifica extremos e a mudança de sinal de f″ pode identificar inflexão.",
        retry: "Separe a classificação de extremo da investigação de inflexão."
      });
    }

    if (definition.id === "m4-3") {
      if (index === 0) {
        const side = a;
        const area = side * side;
        return make(canonicalBase, seed, {
          prompt: `Um retângulo tem perímetro ${a * 4} m, com x e y medidos em metros. Monte a sequência para maximizar a área.`,
          items: [`2x + 2y = ${a * 4} m`, `y = ${a * 2} m − x`, `A(x) = x(${a * 2} m − x)`, `A′(x) = ${a * 2} m − 2x`, `x = ${side} m, y = ${side} m e A = ${area} m²`],
          hint: "Elimine uma variável usando a restrição de perímetro.",
          correct: `O máximo é x = y = ${side} m, com área ${area} m².`,
          retry: "Comece pela restrição e volte à área."
        });
      }
      if (index === 1) {
        const vertex = fraction(-b, 2 * a);
        const value = fraction(c * 4 * a - b * b, 4 * a);
        return make(canonicalBase, seed, {
          prompt: `Para L(x) = ${a}x² + ${b}x + ${c}, qual é o valor mínimo? O coeficiente de x² é positivo.`,
          options: optionList(`${value}`, ["o valor inicial", "a abscissa do vértice"], base.answer),
          hint: "Derive, zere, classifique e substitua no objetivo.",
          correct: `O mínimo ocorre em x = ${vertex} e vale L(${vertex}) = ${value}.`,
          retry: "Encontrar x sem calcular L não responde ao valor mínimo."
      });
      }
      const radius = int(random, 2, 5);
      const dV = int(random, 2, 9);
      const dr = fraction(dV, 4 * radius * radius);
      return make(canonicalBase, seed, {
        prompt: `Se V = (4/3)πr³ em m³, dV/dt = ${dV}π m³/h e r = ${radius} m, qual é dr/dt?`,
          options: optionList(`${dr} m/h`, [`${fraction(dV, radius)} m/h`, `${fraction(dV, radius + 1)} m/h`], base.answer),
        hint: "Derive V em relação ao tempo; r também é função do tempo.",
        correct: `dr/dt = (dV/dt)/(4πr²) = ${dr} m/h.`,
        retry: "A unidade de comprimento por tempo deve ser preservada."
      });
    }

    if (definition.id === "m4-4") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Para lim(x→${a}) (x² − ${a * a})/(x − ${a}), monte a solução por fatoração.`,
          items: [`Substituir e obter 0/0`, `Fatorar (x − ${a})(x + ${a})`, `Cancelar x − ${a} para x ≠ ${a}`, `Concluir o limite é ${a * 2}`],
          hint: "Use a diferença de quadrados.",
          correct: `A fatoração fornece o limite ${a * 2}.`,
          retry: "0/0 é uma indeterminação, não um resultado."
        });
      }
      if (index === 1) {
        const point = int(random, 2, 9);
        const numerator = int(random, 2, 9);
        return make(canonicalBase, seed, {
          prompt: `Um estudante aplicou L’Hôpital a lim(x→${point}−) ${numerator}/(x − ${point}) e escreveu 0/1 = 0. Qual é o erro?`,
          options: optionList(`não há forma 0/0; o numerador tende a ${numerator} e o limite é −∞`, ["a regra está correta", `o limite é ${numerator}`], base.answer),
          hint: "Verifique a forma antes de diferenciar e o sinal pela esquerda.",
          correct: `L’Hôpital não se aplica: o numerador tende a ${numerator} e o denominador a 0 pela esquerda.`,
          retry: "Confira numerador, denominador e o lado do limite."
        });
      }
      const floor = int(random, 2, 6);
      const amplitude = int(random, 2, 9);
      const decay = int(random, 1, 4);
      return make(canonicalBase, seed, {
        prompt: `Na auditoria de T(t) = ${floor} + ${amplitude}e^(−${decay}t), qual conjunto é coerente?`,
        options: optionList(`T′ < 0, T→${floor}, T(0)=${floor + amplitude}`, [`T′ > 0 e T→${floor + amplitude}`, "T é constante"], base.answer),
        hint: "Confira sinal, limite, valor inicial e unidade.",
        correct: `A derivada é negativa, o limite é ${floor} e T(0) = ${floor + amplitude}.`,
        retry: "Valide separadamente sinal, limite e condição inicial."
      });
    }

    if (definition.id === "m5-1") {
      const end = int(random, 3, 8);
      const total = fraction(a * end * 2 + c * end * end, 2);
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Para r(t) = ${a} + ${c}t, qual é ∫ de 0 a ${end} r(t)dt?`,
          options: optionList(`${total}`, [`r(${end}) = ${a + c * end}`, `${c * end}`], base.answer),
          hint: "Some a taxa ao longo do intervalo.",
          correct: `∫ de 0 a ${end} (${a} + ${c}t)dt = ${a * end} + ${fraction(c * end * end, 2)} = ${total}.`,
          retry: "O valor final da taxa não é o total."
        });
      }
      if (index === 1) {
        return make(canonicalBase, seed, {
          prompt: `Ordene a construção de ∫ de 0 a ${end} (${a} + ${c}t)dt como soma de Riemann.`,
          items: [`Delinear [0, ${end}]`, "Fatiar o intervalo", `Somar retângulos de altura ${a} + ${c}t`, "Afinar as fatias", "Calcular o limite das somas"],
          hint: "Integral é o limite de uma soma.",
          correct: "A pilha de fatias deve terminar no limite das somas.",
          retry: "A última etapa é o limite, não o desenho."
        });
      }
      const antiderivative = `${a}t + ${coefficient(c, 2)}t²`;
      return make(canonicalBase, seed, {
        prompt: `Se r(t) = ${a} + ${c}t, complete uma antiderivativa R(t) e R(${end}) − R(0).`,
        fields: fieldsFrom(base, [
          { correct: antiderivative, wrong: [`${a}t + ${c}t²`, `${a}t + t²`] },
          { correct: `${total}`, wrong: [`${a + c * end}`, `${a * end}`] }
        ]),
        hint: "Integre a taxa e calcule a diferença.",
        correct: `R(t) = ${antiderivative}; R(${end}) − R(0) = ${total}.`,
        retry: "A regra da potência precisa ser aplicada ao termo quadrático."
      });
    }

    if (definition.id === "m5-2") {
      if (index === 0) {
        return make(canonicalBase, seed, {
          prompt: `Qual é uma antiderivativa de ${a}x² − ${b}x + ${c}?`,
          options: optionList(`${coefficient(a, 3)}x³ − ${coefficient(b, 2)}x² + ${c}x + C`, [`${a}x − ${b} + C`, `${coefficient(a, 4)}x⁴ − ${b}x² + ${c}x + C`], base.answer),
          hint: "Derive a alternativa para recuperar a função original.",
          correct: "A derivada da alternativa retorna a taxa dada.",
          retry: "Cada parcela precisa ser derivada."
        });
      }
      if (index === 1) {
        const power = int(random, 2, 4);
        return make(canonicalBase, seed, {
          prompt: `Resolva ∫2x(x² + ${b})^${power}dx ordenando a substituição.`,
          items: [`u = x² + ${b}`, "du = 2x dx", `Integral vira ∫u^${power}du`, `Resultado = u^${power + 1}/${power + 1} + C`, `Voltar para x: (x² + ${b})^${power + 1}/${power + 1} + C`],
          hint: "Procure u e du juntos.",
          correct: "A cadeia foi desfeita e a variável voltou corretamente.",
          retry: "Troque toda a integral, não apenas um termo."
        });
      }
      const factor = int(random, 2, 4);
      return make(canonicalBase, seed, {
        prompt: `Em ∫${2 * factor}x(x² + ${b})²dx, a tentativa diz du = 2x dx e ${2 * factor}x dx = du. Qual é a correção?`,
          options: optionList(`${2 * factor}x dx = ${factor}du; resultado = (${factor}/3)(x² + ${b})³ + C`, [`${2 * factor}x dx = du; resultado = 3u³/2`, "não há constante"], base.answer),
        hint: `Compare ${2 * factor}x dx com 2x dx.`,
        correct: `O fator ${factor} deve ser preservado antes de integrar.`,
        retry: "A constante da substituição não desaparece."
      });
    }

    if (definition.id === "m5-3") {
      if (index === 0) {
        const result = a * (b * b - 1);
        return make(canonicalBase, seed, {
          prompt: `Qual é ∫ de 1 a ${b} ${a}x dx?`,
          options: optionList(`${result}`, [`${a * b}`, `${a * b * b}`], base.answer),
          hint: `Use F(x) = ${fraction(a, 2)}x² e calcule F(${b}) − F(1).`,
          correct: `∫ de 1 a ${b} ${a}x dx = ${fraction(a, 2)}(${b}² − 1) = ${result}.`,
          retry: "Aplique o FTC nos dois limites."
      });
      }
      if (index === 1) {
        const result = fraction(a * (b ** 3 - 1), 4);
        return make(canonicalBase, seed, {
          prompt: `Calcule ∫ de 1 a ${b} ${a}x³dx completando F(x) e a subtração.`,
          fields: fieldsFrom(base, [
            { correct: `${coefficient(a, 4)}x⁴`, wrong: [`${a}x²`, `${a}x³`] },
            { correct: `${result}`, wrong: [`${a * b ** 3}`, `${a * b}`] }
          ]),
          hint: "O limite inferior é 1; não use F(0).",
          correct: `F(x) = ${coefficient(a, 4)}x⁴ e o resultado é ${result}.`,
          retry: "Substitua F(b) menos F(1)."
      });
      }
      const hours = int(random, 2, 8);
      const energy = fraction(a * hours * 2 + b * hours * hours, 2);
      return make(canonicalBase, seed, {
        prompt: `Se q(t) = ${a} + ${b}t em kW, qual é a energia E = ∫ de 0 a ${hours} q(t)dt, em kWh?`,
        options: optionList(`${energy} kWh`, [`${a + b * hours} kWh`, `${b * hours} kWh`], base.answer),
        hint: "Use kW·h = kWh e integre a taxa desde o instante inicial.",
        correct: `E = ${a * hours} + ${fraction(b * hours * hours, 2)} = ${energy} kWh.`,
        retry: "A taxa final não é a energia total."
      });
    }

    if (definition.id === "m5-4") {
      if (index === 0) {
        const total = fraction(a * b * b, 2);
        const firstDistractor = a * b + 1;
        let secondDistractor = b * b + 3;
        while (secondDistractor === total || secondDistractor === firstDistractor) secondDistractor += 1;
        return make(canonicalBase, seed, {
          prompt: `Qual é ∫ de 0 a ${b} ${a}t dt?`,
          options: optionList(`${total}`, [`${firstDistractor}`, `${secondDistractor}`], base.answer),
          hint: `A curva y = ${a}t forma um triângulo no intervalo.`,
          correct: `∫ de 0 a ${b} ${a}t dt = ${coefficient(a, 2)}·${b}² = ${total}.`,
          retry: "A taxa final não é o acumulado."
      });
      }
      if (index === 1) {
        const rate = int(random, 1, 4);
        return make(canonicalBase, seed, {
          prompt: `Para dO/dt = −${rate}O e O(0) = ${a * 100}, monte a solução.`,
          items: [`Separar dO/O = −${rate}dt`, `Integrar: ln|O| = −${rate}t + C`, `Usar O(0) = ${a * 100}`, `Obter O(t) = ${a * 100}e^(−${rate}t)`],
          hint: "A condição inicial escolhe a constante.",
          correct: `A solução é O(t) = ${a * 100}e^(−${rate}t).`,
          retry: "Não esqueça a condição inicial."
        });
      }
      const rate = int(random, 1, 4);
      const halfLife = Math.log(2) / rate;
      const halfLifeApprox = halfLife.toFixed(2).replace(".", ",");
      return make(canonicalBase, seed, {
        prompt: `Para O′ = −${rate}O, com O(t) > 0 e k = ${rate} em unidades inversas ao tempo, qual é a meia-vida?`,
        options: optionList(`ln(2)/${rate} ≈ ${halfLifeApprox} unidades de tempo`, [`1/${rate} = ${fraction(1, rate)}`, `${rate}/2`], base.answer),
        hint: "Use ln(2)/|k| e a unidade de k.",
        correct: `A meia-vida é ln(2)/${rate} ≈ ${halfLifeApprox} unidades de tempo.`,
        retry: "A unidade de k é inversa ao tempo."
      });
    }

    throw new Error(`Gerador sem caso para ${definition.id}/${index}`);
  }

  window.resolveRandomActivity = resolveRandomActivity;
})();
