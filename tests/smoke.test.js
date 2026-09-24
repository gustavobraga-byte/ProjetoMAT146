"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SITE = path.resolve(__dirname, "..");
const OUTPUT_ROOT = path.resolve(SITE, "..");

function loadData() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(SITE, "data.js"), "utf8"), sandbox);
  return sandbox.window.CapyData;
}

function assertFile(relativePath, minimumBytes = 1) {
  const fullPath = path.join(SITE, relativePath);
  assert.ok(fs.existsSync(fullPath), `Arquivo ausente: ${relativePath}`);
  assert.ok(fs.statSync(fullPath).size >= minimumBytes, `Arquivo vazio: ${relativePath}`);
}

function loadCourseContexts() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(SITE, "activity-generator.js"), "utf8"), sandbox);
  vm.runInContext(fs.readFileSync(path.join(SITE, "course-context.js"), "utf8"), sandbox);
  return { contexts: sandbox.window.CapyCourseContexts, resolve: sandbox.window.resolveCourseActivities, random: sandbox.window.resolveRandomActivity };
}

function loadLessons() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(SITE, "game-content.js"), "utf8"), sandbox);
  return sandbox.window.CapyLessons;
}

const data = loadData();
const lessons = loadLessons();
const courseContext = loadCourseContexts();
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("o pacote contém onze cursos únicos", () => {
  assert.equal(data.version, "1.3.0");
  assert.equal(data.courses.length, 11);
  assert.equal(new Set(data.courses.map((course) => course.slug)).size, 11);
});

test("todos os cursos possuem apostila, questão contextualizada e capa", () => {
  for (const course of data.courses) {
    assertFile(path.join("..", course.slug, "05_APOSTILA_ACESSIVEL.pdf"), 10_000);
    assertFile(path.join("..", course.slug, "05_APOSTILA_ACESSIVEL.docx"), 5_000);
    assertFile(path.join("..", course.slug, "03_QUESTOES_CONTEXTUALIZADAS.pdf"), 10_000);
    assertFile(path.join("..", "figuras", `capa_${course.slug}.png`), 10_000);
    assertFile(path.join("biblioteca", course.slug, "05_APOSTILA_ACESSIVEL.html"), 20_000);
    assertFile(path.join("biblioteca", course.slug, "05_APOSTILA_ACESSIVEL.pdf"), 10_000);
    assertFile(path.join("biblioteca", course.slug, "05_APOSTILA_ACESSIVEL.docx"), 5_000);
    assertFile(path.join("biblioteca", course.slug, "03_QUESTOES_CONTEXTUALIZADAS.pdf"), 10_000);
    assertFile(path.join("assets", "capas", `capa_${course.slug}.png`), 10_000);
  }
});

test("cada perfil de curso contém os dados da Regra da Cadeia", () => {
  const expected = {
    administracao: "1,2t(0,2t² + 5)²",
    agronegocio: "1,2t(0,2t² + 8)²",
    agronomia: "6(2t + 1)²",
    "arquitetura-urbanismo": "−100/(0,5x + 1)³",
    "ciencia-tecnologia-laticinios": "−7,2e^(−0,15t)",
    "ciencias-biologicas-bacharelado": "−10e^(−0,05t)",
    "ciencias-biologicas-licenciatura": "−10e^(−0,05t)",
    "ciencias-contabeis": "40x(5x² − 3)³",
    cooperativismo: "1,6t(0,2t² + 10)³",
    "engenharia-florestal": "0,00031416(2t + 10)",
    zootecnia: "3t(0,5t² + 4)²"
  };
  for (const course of data.courses) {
    for (const key of ["guide", "context", "formula", "inner", "innerDerivative", "outer", "outerDerivative", "derivative", "prompt"]) {
      assert.ok(course[key] && !course[key].includes("undefined"), `${course.slug}: campo inválido ${key}`);
    }
    assert.equal(course.derivative, expected[course.slug], `Derivada incorreta para ${course.slug}`);
  }
});

test("a trilha possui cinco módulos e quatro microaulas por módulo", () => {
  assert.equal(data.modules.length, 5);
  for (const module of data.modules) {
    assert.equal(module.units.length, 4, module.title);
    for (const unit of module.units) {
      assert.ok(unit.duration >= 3 && unit.duration <= 5, `${unit.id}: duração fora do intervalo`);
    }
  }
  const featured = data.modules.flatMap((module) => module.units).find((unit) => unit.featured);
  assert.equal(featured.id, "m3-3");
  assert.equal(featured.title, "Regra da Cadeia");
});

test("o conteúdo jogável cobre vinte microaulas e todas as mecânicas", () => {
  assert.equal(lessons.length, 20);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 20);
  const units = data.modules.flatMap((module) => module.units);
  assert.deepEqual(units.map((unit) => unit.id).join(","), lessons.map((lesson) => lesson.id).join(","));
  for (const unit of units) {
    const lesson = lessons.find((item) => item.id === unit.id);
    assert.equal(lesson.title, unit.title, `${unit.id}: título divergente`);
    assert.equal(lesson.duration, unit.duration, `${unit.id}: duração divergente`);
  }
  for (const moduleId of ["m1", "m2", "m3", "m4", "m5"]) {
    assert.equal(lessons.filter((lesson) => lesson.moduleId === moduleId).length, 4, moduleId);
  }
  const activityTypes = new Set();
  for (const lesson of lessons) {
    assert.ok(lesson.title && lesson.objective && lesson.explanation, `${lesson.id}: conteúdo incompleto`);
    assert.ok(lesson.activities.length >= 3, `${lesson.id}: atividades insuficientes`);
    for (const activity of lesson.activities) {
      activityTypes.add(activity.type);
      assert.ok(activity.id && activity.prompt && activity.hint && activity.correct && activity.retry, `${lesson.id}/${activity.id}: feedback incompleto`);
      if (["choice", "bug"].includes(activity.type)) {
        assert.ok(Number.isInteger(activity.answer) && activity.answer >= 0 && activity.answer < activity.options.length, `${activity.id}: alternativa inválida`);
      }
      if (activity.type === "fill") {
        for (const field of activity.fields) assert.ok(field.options.length > field.answer && field.answer >= 0, `${activity.id}: lacuna inválida`);
      }
      if (activity.type === "order") {
        assert.equal([...activity.answer].sort((a, b) => a - b).join(","), activity.items.map((_, index) => index).join(","), `${activity.id}: ordem inválida`);
      }
      if (activity.type === "pair") {
        for (const pair of activity.pairs) assert.ok(pair.options.length > pair.answer && pair.answer >= 0, `${activity.id}: par inválido`);
      }
    }
  }
  for (const type of ["choice", "bug", "fill", "order", "pair"]) assert.ok(activityTypes.has(type), `mecânica ausente: ${type}`);
});

test("cada lição tem uma só questão final contextual e atividades aleatórias completas", () => {
  let resolvedCount = 0;
  const courseNames = data.courses.map((course) => course.name);
  for (const course of data.courses) {
    assert.ok(courseContext.contexts[course.slug], `${course.slug}: pacote contextual ausente`);
    for (const lesson of lessons) {
      const first = courseContext.resolve(lesson, course, 101);
      const second = courseContext.resolve(lesson, course, 202);
      assert.ok(first && second, `${course.slug}/${lesson.id}: resolução ausente`);
      assert.equal(first.length, lesson.activities.length, `${course.slug}/${lesson.id}: sequência alterada`);
      assert.equal(first.map((item) => item.type).join(","), lesson.activities.map((item) => item.type).join(","), `${course.slug}/${lesson.id}: ordem alterada`);
      assert.notEqual(JSON.stringify(first.slice(0, -1)), JSON.stringify(second.slice(0, -1)), `${course.slug}/${lesson.id}: valores não mudaram`);
      assert.equal(JSON.stringify(first.at(-1)), JSON.stringify(second.at(-1)), `${course.slug}/${lesson.id}: questão final variou`);
      for (let index = 0; index < first.length; index += 1) {
        const activity = first[index];
        resolvedCount += 1;
        assert.ok(activity.prompt.trim().endsWith("?"), `${course.slug}/${activity.id}: pergunta incompleta`);
        assert.ok(!/undefined|null/u.test(JSON.stringify(activity)), `${course.slug}/${activity.id}: placeholder`);
        const expectedDifficulty = index === 0 ? "easy" : index === first.length - 1 ? "challenge" : index === 1 ? "medium" : "hard";
        assert.equal(activity.difficulty, expectedDifficulty, `${course.slug}/${activity.id}: dificuldade fora da sequência`);
        if (index === first.length - 1) {
          assert.equal(activity.contextResolved, true, `${course.slug}/${activity.id}: final não contextual`);
          assert.equal(activity.courseSlug, course.slug, `${course.slug}/${activity.id}: curso incorreto`);
          assert.ok(activity.prompt.includes(course.name), `${course.slug}/${activity.id}: nome do curso ausente`);
          assert.ok(activity.prompt.includes(activity.contextLabel), `${course.slug}/${activity.id}: cenário ausente`);
          assert.ok(activity.contextModel && activity.contextPoint, `${course.slug}/${activity.id}: modelo contextual ausente`);
        } else {
          const firstAttempt = JSON.parse(JSON.stringify(first[index]));
          const secondAttempt = JSON.parse(JSON.stringify(second[index]));
          delete firstAttempt.attemptSeed;
          delete secondAttempt.attemptSeed;
          assert.notEqual(JSON.stringify(firstAttempt), JSON.stringify(secondAttempt), `${course.slug}/${activity.id}: números não mudaram`);
          assert.equal(activity.generated, true, `${course.slug}/${activity.id}: atividade não aleatória`);
          assert.equal(activity.contextResolved, false, `${course.slug}/${activity.id}: contexto incorreto antes do final`);
          assert.ok(!activity.prompt.includes(course.name), `${course.slug}/${activity.id}: atividade aleatória usa nome do curso`);
        }
        for (const otherName of courseNames) {
          if (otherName !== course.name) assert.ok(!activity.prompt.includes(otherName), `${course.slug}/${activity.id}: contexto de outro curso`);
        }
        if (["choice", "bug"].includes(activity.type)) {
          assert.equal(new Set(activity.options).size, activity.options.length, `${course.slug}/${activity.id}: alternativas repetidas`);
          assert.ok(activity.options[activity.answer], `${course.slug}/${activity.id}: resposta ausente`);
        }
        if (activity.type === "fill") {
          for (const field of activity.fields) {
            assert.equal(new Set(field.options).size, field.options.length, `${course.slug}/${activity.id}: lacunas repetidas`);
            assert.ok(Number.isInteger(field.answer) && field.options[field.answer], `${course.slug}/${activity.id}: resposta de lacuna ausente`);
          }
        }
        if (activity.type === "pair") {
          for (const pair of activity.pairs) {
            assert.equal(new Set(pair.options).size, pair.options.length, `${course.slug}/${activity.id}: pares repetidos`);
            assert.ok(Number.isInteger(pair.answer) && pair.options[pair.answer], `${course.slug}/${activity.id}: resposta de par ausente`);
          }
        }
        if (activity.type === "order") {
          assert.equal(activity.items.length, activity.answer.length, `${course.slug}/${activity.id}: sequência incompleta`);
        }
      }
      assert.equal(first.filter((item) => item.contextResolved).length, 1, `${course.slug}/${lesson.id}: mais de uma questão contextual`);
    }
  }
  assert.equal(resolvedCount, 671);
});

test("o gerador conserva fórmulas e evita erros de cálculo conhecidos", () => {
  const removable = courseContext.random(lessons.find((lesson) => lesson.id === "m2-2"), 1, 12345);
  const quadratic = courseContext.random(lessons.find((lesson) => lesson.id === "m3-2"), 2, 12345);
  const substitution = courseContext.random(lessons.find((lesson) => lesson.id === "m5-2"), 2, 12345);
  const halfLife = courseContext.random(lessons.find((lesson) => lesson.id === "m5-4"), 2, 12345);
  assert.match(removable.prompt, /f\(x\) = x − \d+ se x ≠ \d+/u);
  assert.match(quadratic.correct, /·\(\d+ − 2·\d+\)/u);
  assert.match(substitution.options[substitution.answer], /\/3\)/u);
  const chainPairs = courseContext.random(lessons.find((lesson) => lesson.id === "m3-3"), 3, 12345).pairs;
  assert.match(chainPairs[0].options[chainPairs[0].answer], /^\d+\(.+\)\^\d+$/u);
  assert.equal(chainPairs[1].options[chainPairs[1].answer], "cos(x)");
  assert.equal(chainPairs[2].options[chainPairs[2].answer], "e^x");
  assert.doesNotMatch(JSON.stringify(halfLife), /\d+\.\d+/u);
});

test("as onze apostilas limpas navegam para os cinco tópicos", () => {
  let totalLinks = 0;
  for (const course of data.courses) {
    const html = fs.readFileSync(path.join(SITE, "biblioteca", course.slug, "05_APOSTILA_ACESSIVEL.html"), "utf8");
    const strip = html.match(/<div class="apostila-module-strip"[\s\S]*?<\/div>/);
    assert.ok(strip, `${course.slug}: faixa de módulos ausente`);
    const links = [...strip[0].matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
    assert.equal(links.length, 5, `${course.slug}: links de tópico incompletos`);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    for (const link of links) assert.ok(ids.has(link), `${course.slug}: destino ausente ${link}`);
    for (const label of ["Pré-Cálculo", "Limites", "Derivadas", "Aplicações", "Integrais"]) {
      assert.ok(strip[0].includes(`<figcaption>${label}</figcaption>`), `${course.slug}: rótulo ausente ${label}`);
    }
    const expectedAnchors = data.topicAnchors[course.slug];
    assert.ok(expectedAnchors, `${course.slug}: âncoras do jogo ausentes`);
    for (const anchor of Object.values(expectedAnchors)) assert.ok(ids.has(anchor), `${course.slug}: âncora do jogo ausente ${anchor}`);
    totalLinks += links.length;
  }
  assert.equal(totalLinks, 55);
});

test("o jogo abre o tópico da apostila e possui liga local funcional", () => {
  const html = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(SITE, "app.js"), "utf8");
  for (const id of ["liga", "leagueName", "leagueWeeklyXp", "leagueProgress", "leagueLadder"]) {
    assert.ok(html.includes(`id="${id}"`), `Elemento da liga ausente: ${id}`);
  }
  assert.ok(app.includes("function getApostilaTopicHref"));
  assert.ok(app.includes("renderLeague()"));
  assert.ok(app.includes("weeklyXp"));
  assert.ok(app.includes("currentWeekKey"));
});

test("zerar os corações reinicia a lição com mensagem motivacional", () => {
  const app = fs.readFileSync(path.join(SITE, "app.js"), "utf8");
  assert.ok(app.includes("function restartActivityWithEncouragement"));
  assert.ok(app.includes("Você perdeu os três corações"));
  assert.ok(app.includes("lesson.restartPending"));
  assert.ok(app.includes("lesson.attemptSeed = createAttemptSeed()"));
  assert.ok(app.includes("lesson.hearts = 3"));
  assert.ok(app.includes("lesson.step = 0"));
});

test("o app consome a trilha completa e mantém fallback contextual", () => {
  const app = fs.readFileSync(path.join(SITE, "app.js"), "utf8");
  assert.ok(app.includes("window.CapyLessons"));
  assert.ok(app.includes("window.resolveCourseActivities"));
  assert.ok(app.includes("createAttemptSeed"));
  assert.ok(app.includes("function startGame(lessonId"));
  assert.ok(app.includes("buildLessonActivities"));
  assert.ok(app.includes("getGenericAnswer"));
  assert.ok(!app.includes('definition.id === "m3-3" ? buildChainActivities'));
  assert.ok(app.includes("new Set([...state.completed, ...state.demoCompleted])"));
});

test("o catálogo cobre as mecânicas solicitadas", () => {
  const ids = new Set(data.mechanics.map((mechanic) => mechanic.id));
  for (const id of ["multiple-choice", "order-build", "find-error", "pairing", "fill-gap", "transfer"]) {
    assert.ok(ids.has(id), `Mecânica ausente: ${id}`);
  }
});

test("o catálogo visual contém doze conquistas únicas", () => {
  assert.equal(data.badges.length, 12);
  assert.equal(new Set(data.badges.map((badge) => badge.id)).size, 12);
  for (let id = 1; id <= 12; id += 1) {
    assert.ok(data.badges.some((badge) => badge.id === id), `Badge ausente: ${id}`);
  }
});

test("o shell e seus recursos principais existem", () => {
  for (const file of [
    "index.html",
    "styles.css",
    "data.js",
    "game-content.js",
    "activity-generator.js",
    "course-context.js",
    "app.js",
    "manifest.webmanifest",
    "sw.js",
    "docs/GAME_DESIGN.md",
    "docs/GAME_DESIGN.pdf",
    "biblioteca/README.md",
    "biblioteca/README.pdf",
    "biblioteca/README.docx",
    "assets/mascote/capi-neutral.png",
    "assets/mascote/capi-thinking.png",
    "assets/mascote/capi-hint.png",
    "assets/mascote/capi-happy.png",
    "assets/mascote/capi-celebrate.png",
    "assets/mascote/capi-encourage.png",
    "assets/mascote/capi-review.png",
    "assets/mascote/capi-focus.png",
    "assets/illustrations/chain-rule.png",
    "assets/badges/badge-01.png",
    "assets/badges/badge-02.png",
    "assets/badges/badge-03.png",
    "assets/badges/badge-04.png",
    "assets/badges/badge-05.png",
    "assets/badges/badge-06.png",
    "assets/badges/badge-07.png",
    "assets/badges/badge-08.png",
    "assets/badges/badge-09.png",
    "assets/badges/badge-10.png",
    "assets/badges/badge-11.png",
    "assets/badges/badge-12.png",
    "assets/scenarios/module-01.png",
    "assets/scenarios/module-02.png",
    "assets/scenarios/module-03.png",
    "assets/scenarios/module-04.png",
    "assets/scenarios/module-05.png",
    "assets/icon-192.png",
    "assets/icon-512.png"
  ]) {
    assertFile(file, file.endsWith(".md") ? 1_000 : 100);
  }
});

test("o cache do service worker aponta para recursos existentes", () => {
  const sw = fs.readFileSync(path.join(SITE, "sw.js"), "utf8");
  const resources = [...sw.matchAll(/"\.\/([^"?]+)"/g)].map((match) => match[1]).filter(Boolean);
  for (const resource of resources) assertFile(resource, 20);
  assert.ok(sw.includes("capycalculus-v7"));
  assert.ok(sw.includes("assets/mascote/capi-happy.png"));
  assert.ok(sw.includes("assets/scenarios/module-05.png"));
  assert.ok(sw.includes("assets/badges/badge-12.png"));
});

test("os links de recursos não dependem da raiz do pacote MAT 146", () => {
  const html = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(SITE, "app.js"), "utf8");
  assert.ok(!html.includes('href="../'));
  assert.ok(!app.includes('`../'));
  assert.ok(html.includes("biblioteca/administracao/05_APOSTILA_ACESSIVEL.html"));
  assert.ok(html.includes("biblioteca/administracao/05_APOSTILA_ACESSIVEL.pdf"));
  assert.ok(app.includes("biblioteca/${course.slug}/05_APOSTILA_ACESSIVEL.html"));
  assert.ok(app.includes("biblioteca/${course.slug}/05_APOSTILA_ACESSIVEL.pdf"));
  assert.ok(app.includes("assets/capas/capa_${course.slug}.png"));
});

test("o manifesto declara os ícones e o modo standalone", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(SITE, "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.lang, "pt-BR");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.icons.length, 2);
  for (const icon of manifest.icons) assertFile(icon.src, 100);
});

test("o site contém acessibilidade estrutural e não contém artefatos de texto", () => {
  const html = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
  const js = fs.readFileSync(path.join(SITE, "app.js"), "utf8");
  assert.ok(html.includes('class="skip-link"'));
  assert.ok(html.includes('aria-modal="true"'));
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes("manifest.webmanifest"));
  assert.ok(html.includes("course-context.js"));
  assert.ok(html.includes("activity-generator.js"));
  assert.ok(js.includes('localStorage.getItem'));
  assert.ok(js.includes('prefers-reduced-motion') || html.includes("styles.css"));
  assert.ok(!/[\u4e00-\u9fff]/u.test(html + js), "Texto com caracteres CJK inesperado");
});

test("a documentação contém a aula completa e os prompts de ativos", () => {
  const doc = fs.readFileSync(path.join(SITE, "docs/GAME_DESIGN.md"), "utf8");
  for (const term of [
    "Tela 1 — Explicação visual",
    "Tela 2 — Escolha conceitual",
    "Tela 3 — Preenchimento de lacunas",
    "Tela 4 — Encontre o erro",
    "Tela 5 — Associação de pares",
    "Prompt 1 — sprite mestre da Capi",
    "Prompt 4 — badges e ligas"
  ]) {
    assert.ok(doc.includes(term), `Seção ausente: ${term}`);
  }
  assert.ok(!/[\u4e00-\u9fff]/u.test(doc), "Documento contém caracteres CJK inesperados");
});

let passed = 0;
for (const item of tests) {
  try {
    item.fn();
    passed += 1;
    console.log(`PASS ${item.name}`);
  } catch (error) {
    console.error(`FAIL ${item.name}`);
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

console.log(`\n${passed}/${tests.length} testes aprovados.`);
