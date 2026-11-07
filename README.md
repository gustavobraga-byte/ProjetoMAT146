# ProjetoMAT146 — CapyCalculus

Projeto para melhorar a aprovação em **MAT 146 (Cálculo I)** na UFV: um site jogável,
com apostilas por curso, trilha de microaulas e — desde novembro de 2026 — **as quatro listas
oficiais do Departamento de Matemática** dentro do jogo.

## O que tem no site

| Bloco | Conteúdo |
|---|---|
| Cursos | 11 cursos da UFV (Agronomia, Cooperativismo, Administração, Zootecnia, Engenharias, etc.) |
| Apostilas | HTML/PDF/DOCX por curso, com 5 tópicos ligados à trilha |
| Trilha | 20 microaulas em 5 módulos + **módulo 6 com as listas oficiais em 27 fases curtas** |
| Listas | **491 questões** transcritas das Listas 1–4, uma por subitem, com resposta conferida no gabarito |
| Matemática | LaTeX renderizado pelo **KaTeX local** (`katex/`) — funciona offline, sem CDN |
| Notação | frações empilhadas nos enunciados e com barra (`3/2`) nas alternativas; `\to-` vira `\to\,-` para a seta não encostar no sinal |
| Jogo | 5 mecânicas (escolha, erro, lacuna, ordem, pares), XP, corações, liga local |

## Módulo 6 — Listas oficiais MAT 146

| Lista | Questões | Fácil | Intermediária | Avançada |
|---|---|---|---|---|
| Lista 1 — Pré-cálculo, funções e retas | 119 | 41 | 69 | 9 |
| Lista 2 — Limites, continuidade e derivada | 118 | 48 | 63 | 7 |
| Lista 3 — Regras de derivação e aplicações | 116 | 31 | 67 | 18 |
| Lista 4 — Otimização, integrais e EDO | 138 | 68 | 42 | 28 |
| **Total** | **491** | **188** | **241** | **62** |

O nível é atribuído **a cada subitem**, não à lista:

- **Fácil** — aplicação direta de uma regra ou definição em 1–2 passos, sem manipulação algébrica
  relevante (derivar polinômio, limite por substituição, antiderivada imediata, ler um gráfico simples).
- **Intermediária** — 2 a 4 passos com manipulação (fatoração, racionalização, regra da cadeia,
  quociente, classificação de pontos críticos, substituição simples, domínio com inequação).
- **Avançada** — várias etapas ou técnicas combinadas e escolha de estratégia (integração por partes,
  derivadas implícitas e de ordem superior, otimização com restrição, taxas relacionadas, EDO,
  estudo completo de sinal e concavidade).

As questões que já existiam foram mantidas e reetiquetadas como **Fácil**. A ordem das
alternativas é embaralhada de forma determinística por `id`, então a resposta não fica
sempre em A.

### Fases curtas por tema e nível (27 fases, máx. 25 questões)

Antes, cada lista era **uma fase só** (119, 118, 116 e 138 questões — 35 a 50 min),
impossível de concluir em uma sessão. Agora cada lista é dividida em fases curtas
por **tema** (blocos de questões originais) e, dentro de cada fase, as questões vêm
ordenadas **Fácil → Intermediária → Avançada** (ordem original preservada dentro
de cada nível). Cobertura completa, sem repetição, sumando 491.

| Lista | Fases | Questões por fase |
|---|---|---|
| 1 — Pré-cálculo, funções e retas | 7 (`m6-1` a `m6-7`) | 12–20 |
| 2 — Limites, continuidade e derivada | 6 (`m6-8` a `m6-13`) | 13–23 |
| 3 — Regras de derivação e aplicações | 6 (`m6-14` a `m6-19`) | 13–25 |
| 4 — Otimização, integrais e EDO | 8 (`m6-20` a `m6-27`) | 12–24 |

Exemplos de tema: Lista 1 · 4/7 é só a questão 14 (domínio avançado, 17 itens);
Lista 3 · 2/6 é só a questão 5 (regra da cadeia, 25 itens); Lista 4 · 1/8 é só
otimização (12 itens, todos Avançados); Lista 4 · 4/8 é só substituição (Q16, 22 itens).
A duração estimada de cada fase é metade do número de questões (6–13 min).
Quem já concluiu uma fase-macro antiga (`m6-1` a `m6-4`) tem o progresso migrado
automaticamente para todas as fases curtas daquela lista (`expandLegacyListProgress`
em `app.js`). O cache do PWA subiu para `capycalculus-v11`.

### Botões principais e corações

- **Ir para a próxima fase** (era “Experimentar a Regra da Cadeia”): abre a primeira fase
da trilha que o aluno ainda não fez, na ordem da trilha (`getNextLesson()` em
`app.js`). O rótulo mostra o título da próxima fase; com a trilha completa, revisa a
Regra da Cadeia.
- **Listas oficiais**: abre a próxima fase do módulo 6 ainda não feita
(`getNextListaLesson()`), com o título da fase no rótulo; com as listas completas,
revisa a Lista 1 · 1/7.
- **Três corações perdidos**: o aluno **volta ao início da fase** (tela de
explicação, `lesson.step = 0`), com novos valores (nova seed) e três corações
restaurados — botão “Recomeçar a fase”.

### Divergências do gabarito oficial (registradas no próprio jogo)

- **Lista 1 · 23(e)** — gabarito traz `4cos4x − 3cos2x`; a simplificação correta é `(cos4x + cos2x)/2`.
- **Lista 4 · 18(l)** — gabarito traz `−1/6·tg⁶x`; derivando, o correto é `+1/6·tg⁶x`.
- **Lista 4 · 23(c)** — com `y = x√(x²+5)`, a área é `(1/3)(27−5√5)`; o gabarito indica `1/8`.
- **Lista 4 · 12** — `(1/3)√52 + (5/6)√13 = 3√13/2` (valor adotado).

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Abrir por `file://` também funciona; o service worker e a instalação como PWA exigem HTTP.

## Testes

```bash
node tests/smoke.test.js
```

Cobrem os 11 cursos, as 20 microaulas, o gerador de atividades, o service worker, a
acessibilidade estrutural e o módulo das listas (491 questões, LaTeX e KaTeX local).

## Estrutura

```
index.html            app shell
app.js                motor do jogo e renderização (inclui formatMath com KaTeX)
data.js               cursos, módulos, mecânicas, badges
game-content.js       20 microaulas jogáveis
activity-generator.js gerador determinístico de atividades
course-context.js     contextualização por curso
listas-mat146.js      banco das 491 questões das listas (novo)
katex/                KaTeX 0.16.22 local (js, css e 20 fontes woff2)
biblioteca/           apostilas HTML/PDF/DOCX por curso
assets/               mascote, badges, cenários
tests/smoke.test.js   suíte de verificação
```

## Limitações

- Questões de "esboce o gráfico" viraram perguntas sobre uma característica verificável
  (assíntota, domínio, extremo), porque o jogo é de múltipla escolha.
- `assets/scenarios/module-06.png` é um cartão gráfico provisório.
- As respostas das 491 questões ainda não passaram por revisão docente.
