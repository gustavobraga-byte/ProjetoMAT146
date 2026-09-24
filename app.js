(function () {
  "use strict";

  const data = window.CapyData;
  const lessons = window.CapyLessons || [];
  const resolveCourseActivities = window.resolveCourseActivities;
  const storageKey = "capycalculus-progress-v1";
  const themeKey = "capycalculus-theme-v1";
  const leagueTiers = Object.freeze([
    { id: "cauchy", name: "Liga de Cauchy", minXp: 0, badge: "assets/badges/badge-09.png" },
    { id: "leibniz", name: "Liga de Leibniz", minXp: 200, badge: "assets/badges/badge-07.png" },
    { id: "newton", name: "Liga de Newton", minXp: 500, badge: "assets/badges/badge-06.png" },
    { id: "lagrange", name: "Liga de Lagrange", minXp: 1000, badge: "assets/badges/badge-08.png" },
    { id: "euler", name: "Liga de Euler", minXp: 1750, badge: "assets/badges/badge-10.png" }
  ]);
  const defaultState = {
    selectedCourse: null,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    hearts: 3,
    completed: [],
    demoCompleted: [],
    league: { weekKey: "", weeklyXp: 0, bestWeeklyXp: 0, completedThisWeek: 0 },
    theme: "light"
  };

  let state = loadState();
  let lesson = null;
  let restartTimer = null;
  let lastFocus = null;

  const elements = {
    courseGrid: document.getElementById("courseGrid"),
    courseSearch: document.getElementById("courseSearch"),
    searchEmpty: document.getElementById("searchEmpty"),
    courseAvatar: document.getElementById("courseAvatar"),
    courseStatus: document.getElementById("courseStatus"),
    courseSummaryTitle: document.getElementById("courseSummaryTitle"),
    courseGuide: document.getElementById("courseGuide"),
    missionTitle: document.getElementById("missionTitle"),
    xpValue: document.getElementById("xpValue"),
    streakValue: document.getElementById("streakValue"),
    heartsValue: document.getElementById("heartsValue"),
    apostilaCover: document.getElementById("apostilaCover"),
    apostilaTitle: document.getElementById("apostilaTitle"),
    apostilaDescription: document.getElementById("apostilaDescription"),
    htmlLink: document.getElementById("htmlLink"),
    pdfLink: document.getElementById("pdfLink"),
    docxLink: document.getElementById("docxLink"),
    contextQuestionsLink: document.getElementById("contextQuestionsLink"),
    gameContext: document.getElementById("gameContext"),
    skillTree: document.getElementById("skillTree"),
    trailCompleted: document.getElementById("trailCompleted"),
    mechanicsGrid: document.getElementById("mechanicsGrid"),
    badgeWall: document.getElementById("badgeWall"),
    dashboardLeague: document.getElementById("dashboardLeague"),
    leagueWeek: document.getElementById("leagueWeek"),
    leagueBadge: document.getElementById("leagueBadge"),
    leagueTier: document.getElementById("leagueTier"),
    leagueName: document.getElementById("leagueName"),
    leagueStatus: document.getElementById("leagueStatus"),
    leagueWeeklyXp: document.getElementById("leagueWeeklyXp"),
    leagueProgressTitle: document.getElementById("leagueProgressTitle"),
    leagueNext: document.getElementById("leagueNext"),
    leagueProgress: document.getElementById("leagueProgress"),
    leagueProgressBar: document.getElementById("leagueProgressBar"),
    leagueBest: document.getElementById("leagueBest"),
    leagueRemaining: document.getElementById("leagueRemaining"),
    leagueLadder: document.getElementById("leagueLadder"),
    themeToggle: document.getElementById("themeToggle"),
    resetProgress: document.getElementById("resetProgress"),
    gameOverlay: document.getElementById("gameOverlay"),
    closeGame: document.getElementById("closeGame"),
    gameKicker: document.getElementById("gameKicker"),
    gameTitle: document.getElementById("gameTitle"),
    gameHearts: document.getElementById("gameHearts"),
    gameProgress: document.getElementById("gameProgress"),
    coachMascot: document.getElementById("coachMascot"),
    coachBubble: document.getElementById("coachBubble"),
    coachFormula: document.getElementById("coachFormula"),
    questionCard: document.getElementById("questionCard"),
    feedbackCard: document.getElementById("feedbackCard"),
    gameActions: document.getElementById("gameActions"),
    hintButton: document.getElementById("hintButton"),
    checkAnswer: document.getElementById("checkAnswer"),
    nextButton: document.getElementById("nextButton"),
    toast: document.getElementById("toast")
  };

  function currentWeekKey(date = new Date()) {
    const monday = new Date(date);
    const offset = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - offset);
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, "0");
    const day = String(monday.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function normalizeLeague(candidate) {
    const value = candidate && typeof candidate === "object" ? candidate : {};
    const weekKey = currentWeekKey();
    const weeklyXp = Number(value.weeklyXp) || 0;
    const bestWeeklyXp = Math.max(Number(value.bestWeeklyXp) || 0, weeklyXp);
    if (value.weekKey !== weekKey) {
      return { weekKey, weeklyXp: 0, bestWeeklyXp, completedThisWeek: 0 };
    }
    return {
      weekKey,
      weeklyXp,
      bestWeeklyXp,
      completedThisWeek: Math.max(0, Number(value.completedThisWeek) || 0)
    };
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (!stored || typeof stored !== "object") {
        return { ...defaultState, league: normalizeLeague(defaultState.league) };
      }
      return {
        ...defaultState,
        ...stored,
        completed: Array.isArray(stored.completed) ? stored.completed : [],
        demoCompleted: Array.isArray(stored.demoCompleted) ? stored.demoCompleted : [],
        league: normalizeLeague(stored.league)
      };
    } catch (_error) {
      return { ...defaultState, league: normalizeLeague(defaultState.league) };
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function createAttemptSeed() {
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      const values = new Uint32Array(2);
      window.crypto.getRandomValues(values);
      return (values[0] ^ values[1]) >>> 0;
    }
    return (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getSelectedCourse() {
    return data.courses.find((course) => course.slug === state.selectedCourse) || null;
  }

  function courseBySlug(slug) {
    return data.courses.find((course) => course.slug === slug) || null;
  }

  function courseSlugFromName(name) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function renderCourses() {
    const query = courseSlugFromName(elements.courseSearch.value.trim());
    const visibleCourses = data.courses.filter((course) => {
      const haystack = courseSlugFromName(`${course.name} ${course.guide} ${course.context}`);
      return haystack.includes(query);
    });

    elements.courseGrid.innerHTML = visibleCourses.map((course) => {
      const selected = state.selectedCourse === course.slug;
      return `
        <button class="course-card${selected ? " is-selected" : ""}" type="button" data-course="${course.slug}" aria-pressed="${selected}">
          <span class="course-avatar" aria-hidden="true">${escapeHtml(course.iconLabel)}</span>
          <span class="course-card-copy">
            <strong>${escapeHtml(course.name)}</strong>
            <small>${escapeHtml(course.guide)}</small>
          </span>
          <span class="course-check" aria-hidden="true"></span>
        </button>`;
    }).join("");

    elements.searchEmpty.hidden = visibleCourses.length > 0;
  }

  function renderWorkspace() {
    const course = getSelectedCourse();
    if (!course) {
      elements.courseAvatar.textContent = "?";
      elements.courseStatus.textContent = "Aguardando seleção";
      elements.courseSummaryTitle.textContent = "Escolha seu curso";
      elements.courseGuide.textContent = "A apostila e os exercícios do jogo serão personalizados.";
      elements.missionTitle.textContent = "Selecione um curso para continuar";
      elements.apostilaTitle.textContent = "Sua apostila de Cálculo I";
      elements.apostilaDescription.textContent = "Escolha um curso para abrir o PDF e o DOCX correspondentes.";
      elements.apostilaCover.src = "assets/mascote/capi-neutral.png";
      elements.apostilaCover.alt = "Capi aguardando a seleção do curso";
      elements.htmlLink.hidden = true;
      elements.pdfLink.href = "docs/GAME_DESIGN.pdf";
      elements.pdfLink.textContent = "Conhecer o pacote";
      elements.docxLink.hidden = true;
      elements.contextQuestionsLink.href = "biblioteca/README.md";
      elements.gameContext.textContent = "Escolha um curso para receber exercícios contextualizados.";
      return;
    }

    elements.courseAvatar.textContent = course.iconLabel;
    elements.courseStatus.textContent = "Curso selecionado";
    elements.courseSummaryTitle.textContent = course.name;
    elements.courseGuide.textContent = `${course.guide} acompanha a trilha de Cálculo I.`;
    const nextLesson = lessons.find((item) => !state.completed.includes(item.id));
    elements.missionTitle.textContent = nextLesson
      ? `Continue: ${nextLesson.title}`
      : "Trilha completa — escolha uma microaula para revisar";
    elements.apostilaTitle.textContent = `Cálculo I · ${course.name}`;
    elements.apostilaDescription.textContent = "Exemplos do curso, exercícios comentados, figuras e trilha de estudo.";
    elements.apostilaCover.src = `assets/capas/capa_${course.slug}.png`;
    elements.apostilaCover.alt = `Capa da apostila de ${course.name}`;
    elements.htmlLink.hidden = false;
    elements.htmlLink.href = `biblioteca/${course.slug}/05_APOSTILA_ACESSIVEL.html`;
    elements.pdfLink.href = `biblioteca/${course.slug}/05_APOSTILA_ACESSIVEL.pdf`;
    elements.pdfLink.textContent = "Abrir PDF";
    elements.docxLink.hidden = false;
    elements.docxLink.href = `biblioteca/${course.slug}/05_APOSTILA_ACESSIVEL.docx`;
    elements.docxLink.textContent = "Baixar DOCX";
    elements.contextQuestionsLink.href = `biblioteca/${course.slug}/03_QUESTOES_CONTEXTUALIZADAS.pdf`;
    elements.gameContext.textContent = `${course.guide} preparou ${course.prompt}`;
    document.documentElement.style.setProperty("--course-accent", course.slug === "agronomia" ? "#f49b55" : "#2fc79a");
  }

  function renderStats() {
    elements.xpValue.textContent = String(state.xp);
    elements.streakValue.textContent = String(state.streak);
    elements.heartsValue.textContent = `${state.hearts || 0}/3`;
  }

  function renderLeague() {
    state.league = normalizeLeague(state.league);
    const weeklyXp = state.league.weeklyXp;
    let currentIndex = 0;
    leagueTiers.forEach((tier, index) => {
      if (weeklyXp >= tier.minXp) currentIndex = index;
    });
    const current = leagueTiers[currentIndex];
    const next = leagueTiers[currentIndex + 1] || null;
    const start = current.minXp;
    const end = next ? next.minXp : Math.max(weeklyXp, start + 1);
    const progress = next
      ? Math.max(0, Math.min(100, ((weeklyXp - start) / (end - start)) * 100))
      : 100;
    const remaining = next ? Math.max(0, next.minXp - weeklyXp) : 0;

    elements.leagueWeek.textContent = `Semana de ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${state.league.weekKey}T12:00:00`))}`;
    elements.leagueBadge.src = current.badge;
    elements.leagueBadge.alt = `Badge da ${current.name}`;
    elements.leagueTier.textContent = `Faixa ${currentIndex + 1} de ${leagueTiers.length}`;
    elements.leagueName.textContent = current.name;
    elements.leagueStatus.textContent = `${state.league.completedThisWeek} ${state.league.completedThisWeek === 1 ? "lição" : "lições"} concluída${state.league.completedThisWeek === 1 ? "" : "s"} nesta semana.`;

    elements.leagueWeeklyXp.textContent = String(weeklyXp);
    elements.leagueProgressTitle.textContent = next ? `Próxima faixa: ${next.name}` : "Faixa máxima alcançada";
    elements.leagueNext.textContent = next ? `${next.minXp} XP` : "Euler";
    elements.leagueProgress.setAttribute("aria-valuemax", String(next ? end - start : 1));
    elements.leagueProgress.setAttribute("aria-valuenow", String(next ? Math.max(0, weeklyXp - start) : 1));
    elements.leagueProgress.setAttribute("aria-valuetext", next ? `${Math.round(progress)}% para ${next.name}` : "Faixa máxima alcançada");
    elements.leagueProgressBar.style.width = `${progress}%`;
    elements.leagueBest.textContent = `${state.league.bestWeeklyXp} XP`;
    elements.leagueRemaining.textContent = next ? `${remaining} XP` : "0 XP";
    elements.dashboardLeague.innerHTML = `<img src="${current.badge}" alt=""> ${current.name}`;
    elements.leagueLadder.innerHTML = leagueTiers.map((tier, index) => `
      <li class="league-tier${index === currentIndex ? " is-current" : ""}${index < currentIndex ? " is-complete" : ""}">
        <img src="${tier.badge}" alt="" loading="lazy">
        <strong>${tier.name}</strong>
        <span>${tier.minXp} XP</span>
      </li>`).join("");
  }

  function renderSkillTree() {
    elements.skillTree.innerHTML = data.modules.map((module, moduleIndex) => {
      const units = module.units.map((unit) => {
        const completedUnits = new Set([...state.completed, ...state.demoCompleted]);
        const status = completedUnits.has(unit.id) ? "completed" : "featured";
        const buttonText = status === "completed" ? "Rejogar" : "Jogar";
        return `
          <button class="skill-unit status-${status}" type="button" data-unit="${unit.id}" data-start-unit="${unit.id}">
            <span class="unit-status" aria-hidden="true">${status === "completed" ? "✓" : String(Number(unit.id.split("-")[1]))}</span>
            <span class="unit-copy">
              <strong>${escapeHtml(unit.title)}</strong>
              <small>${unit.duration} min · ${escapeHtml(unit.kind)}</small>
            </span>
            <span class="unit-action">${escapeHtml(buttonText)}</span>
          </button>`;
      }).join("");

      return `
        <article class="module-card" style="--module-image: url('assets/scenarios/module-${String(moduleIndex + 1).padStart(2, "0")}.png')">
          <header>
            <span class="module-number">${module.number}</span>
            <div>
              <span>${escapeHtml(module.shortTitle)}</span>
              <h3>${escapeHtml(module.title)}</h3>
              <p>${escapeHtml(module.description)}</p>
            </div>
          </header>
          <div class="module-units">${units}</div>
        </article>`;
    }).join("");

    const completedUnits = new Set([...state.completed, ...state.demoCompleted]);
    elements.trailCompleted.textContent = String(completedUnits.size);
  }

  function renderMechanics() {
    elements.mechanicsGrid.innerHTML = data.mechanics.map((mechanic, index) => `
      <article class="mechanic-card">
        <span class="mechanic-index">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(mechanic.label)}</h3>
        <p>${escapeHtml(mechanic.description)}</p>
      </article>`).join("");
  }

  function renderBadges() {
    elements.badgeWall.innerHTML = data.badges.map((badge) => `
      <figure class="badge-card">
        <img src="assets/badges/badge-${String(badge.id).padStart(2, "0")}.png" alt="" width="320" height="320" loading="lazy">
        <figcaption>${escapeHtml(badge.label)}</figcaption>
      </figure>`).join("");
  }

  function renderTheme() {
    const storedTheme = localStorage.getItem(themeKey) || state.theme || "light";
    document.documentElement.dataset.theme = storedTheme;
    state.theme = storedTheme;
    const dark = storedTheme === "dark";
    elements.themeToggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
    elements.themeToggle.innerHTML = dark
      ? '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.4 15.1A8.5 8.5 0 0 1 8.9 3.6 8.5 8.5 0 1 0 20.4 15.1Z"/></svg>';
  }

  function selectCourse(slug, shouldScroll) {
    const course = courseBySlug(slug);
    if (!course) return;
    state.selectedCourse = slug;
    saveState();
    renderCourses();
    renderWorkspace();
    showToast(`${course.name} selecionado. Apostila e jogo personalizados.`);
    if (shouldScroll) {
      document.getElementById("painel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    requestAnimationFrame(() => elements.toast.classList.add("is-visible"));
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
      elements.toast.classList.remove("is-visible");
      window.setTimeout(() => { elements.toast.hidden = true; }, 180);
    }, 2800);
  }

  function setCoach(message, mood, formula) {
    elements.coachBubble.textContent = message;
    const mascot = mood === "retry"
      ? "assets/mascote/capi-thinking.png"
      : mood === "celebrate"
        ? "assets/mascote/capi-celebrate.png"
        : mood === "encourage"
          ? "assets/mascote/capi-encourage.png"
          : "assets/mascote/capi-hint.png";
    elements.coachMascot.src = mascot;
    elements.coachFormula.textContent = formula || "";
  }

  function replaceContextTokens(value, course) {
    if (typeof value === "string") {
      return value
        .replaceAll("{course}", course.name)
        .replaceAll("{context}", course.context)
        .replaceAll("{guide}", course.guide);
    }
    if (Array.isArray(value)) return value.map((item) => replaceContextTokens(item, course));
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceContextTokens(item, course)]));
    }
    return value;
  }

  function contextualizeActivity(activity, course) {
    const localized = replaceContextTokens({ ...activity }, course);
    if (activity.contextual && !activity.contextResolved) {
      localized.prompt = `Contexto do curso: ${course.name} — ${course.context}. ${localized.prompt}`;
    }
    return localized;
  }

  function buildChainActivities(course) {
    return [
      {
        id: "m3-3-a1",
        type: "choice",
        prompt: `No modelo ${course.formula}, qual é a função interna?`,
        options: [course.inner, course.outer, course.derivative],
        answer: 0,
        hint: "É o trecho que ainda contém diretamente a variável.",
        correct: `A função interna é ${course.inner}; a externa recebe esse resultado.`,
        retry: "A externa recebe u; o trecho com a variável é a interna.",
        contextual: true
      },
      {
        id: "m3-3-a2",
        type: "fill",
        prompt: "Complete a Regra da Cadeia usando a decomposição do modelo.",
        fields: [
          { id: "outer", label: "Derivada externa", options: [course.outerDerivative, course.innerDerivative, course.derivative], answer: 0 },
          { id: "inner", label: "Derivada interna", options: [course.innerDerivative, course.outerDerivative, course.derivative], answer: 0 },
          { id: "result", label: "Resultado", options: [course.derivative, course.outerDerivative, course.innerDerivative], answer: 0 }
        ],
        hint: `Derive ${course.outer} e depois ${course.inner}.`,
        correct: `A corrente correta é ${course.outerDerivative} × ${course.innerDerivative} = ${course.derivative}.`,
        retry: "A derivada interna não pode ser esquecida.",
        contextual: true
      },
      {
        id: "m3-3-a3",
        type: "bug",
        prompt: "1. Defina u. 2. Reescreva a função como a externa. 3. Use apenas a derivada externa. 4. Conclua. Em qual linha a corrente foi perdida?",
        options: ["linha 3", "linha 1", "linha 2", "linha 4"],
        answer: 0,
        hint: "Depois da externa ainda falta a derivada da interna.",
        correct: `Na linha 3 faltou multiplicar por ${course.innerDerivative}.`,
        retry: "A linha 3 derivou a casca, mas esqueceu o recheio.",
        contextual: true
      },
      {
        id: "m3-3-a4",
        type: "pair",
        prompt: "Associe função e derivada.",
        pairs: [
          { left: course.formula, options: [course.derivative, course.outerDerivative, course.innerDerivative], answer: 0 },
          { left: "f(x) = sin(x)", options: ["cos(x)", "−sin(x)", "1"], answer: 0 },
          { left: "g(x) = eˣ", options: ["eˣ", "1/eˣ", "x eˣ"], answer: 0 }
        ],
        hint: "O primeiro par exige cadeia; os outros usam regras básicas.",
        correct: `No contexto de ${course.name}, a corrente termina em ${course.derivative}.`,
        retry: "Confira se o primeiro par tem a corrente completa.",
        contextual: true
      }
    ];
  }

  function buildLessonActivities(definition, course, attemptSeed) {
    const activities = typeof resolveCourseActivities === "function"
      ? resolveCourseActivities(definition, course, attemptSeed)
      : null;
    return activities ? activities.map((activity) => contextualizeActivity(activity, course)) : null;
  }

  function getLesson(lessonId) {
    return lessons.find((item) => item.id === lessonId) || null;
  }

  function startGame(lessonId = "m3-3") {
    if (restartTimer) {
      window.clearTimeout(restartTimer);
      restartTimer = null;
    }
    const course = getSelectedCourse();
    if (!course) {
      showToast("Escolha um curso para contextualizar os exercícios.");
      document.getElementById("cursos").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const definition = getLesson(lessonId);
    if (!definition) {
      showToast("Esta fase ainda não está disponível.");
      return;
    }

    const attemptSeed = createAttemptSeed();
    const activities = buildLessonActivities(definition, course, attemptSeed);
    if (!activities || !activities.length) {
      showToast("Não foi possível resolver esta fase para o curso selecionado.");
      return;
    }
    lastFocus = document.activeElement;
    state.hearts = 3;
    saveState();
    renderStats();
    lesson = {
      course,
      definition,
      activities,
      attemptSeed,
      step: 0,
      startedAt: Date.now(),
      firstTry: Array(activities.length + 1).fill(null),
      errors: 0,
      hints: 0,
      hearts: 3,
      solved: false,
      completed: false,
      restartPending: false,
      orderSelection: []
    };

    elements.gameKicker.textContent = `Módulo ${definition.moduleId.replace("m", "")} · ${definition.title}`;
    elements.gameTitle.textContent = definition.title;
    elements.gameOverlay.hidden = false;
    elements.gameOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("game-open");
    renderLesson();
    window.setTimeout(() => elements.closeGame.focus(), 0);
  }

  function getApostilaTopicHref(definition, course) {
    const anchor = data.topicAnchors && data.topicAnchors[course.slug]
      ? data.topicAnchors[course.slug][definition.moduleId]
      : "";
    return `biblioteca/${course.slug}/05_APOSTILA_ACESSIVEL.html${anchor ? `#${encodeURIComponent(anchor)}` : ""}`;
  }

  function closeGame() {
    if (restartTimer) {
      window.clearTimeout(restartTimer);
      restartTimer = null;
    }
    if (!elements.gameOverlay.hidden) {
      elements.gameOverlay.hidden = true;
      elements.gameOverlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("game-open");
      lesson = null;
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    }
  }

  function setProgress(activeIndex, total) {
    const progressbar = elements.gameProgress.parentElement;
    elements.gameProgress.style.gridTemplateColumns = `repeat(${total}, minmax(0, 1fr))`;
    progressbar.setAttribute("aria-valuemax", String(total));
    progressbar.setAttribute("aria-valuenow", String(Math.min(activeIndex, total)));
    progressbar.setAttribute("aria-valuetext", activeIndex >= total ? "Lição concluída" : `Tela ${activeIndex + 1} de ${total}`);
    elements.gameProgress.innerHTML = Array.from({ length: total }, (_, index) => {
      const complete = index < activeIndex;
      const active = index === activeIndex;
      return `<span class="${complete ? "is-complete" : ""}${active ? " is-active" : ""}"></span>`;
    }).join("");
  }

  function setActions({ hint, check, next, nextLabel }) {
    elements.hintButton.hidden = !hint;
    elements.checkAnswer.hidden = !check;
    elements.nextButton.hidden = !next;
    if (nextLabel) elements.nextButton.textContent = nextLabel;
  }

  function hideFeedback() {
    elements.feedbackCard.hidden = true;
    elements.feedbackCard.className = "feedback-card";
    elements.feedbackCard.textContent = "";
  }

  function showFeedback(isCorrect, message) {
    elements.feedbackCard.hidden = false;
    elements.feedbackCard.className = `feedback-card ${isCorrect ? "is-correct" : "is-retry"}`;
    elements.feedbackCard.innerHTML = `
      <span class="feedback-icon" aria-hidden="true">${isCorrect ? "✓" : "↻"}</span>
      <div><strong>${isCorrect ? "Isso!" : "Quase!"}</strong><p>${escapeHtml(message)}</p></div>`;
  }

  function uniqueOptions(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function activityTypeLabel(type) {
    return {
      choice: "Escolha conceitual",
      bug: "Encontre o erro",
      fill: "Preencha as lacunas",
      order: "Arraste e monte",
      pair: "Associação de pares"
    }[type] || "Atividade";
  }

  function renderGenericExplanation() {
    const definition = lesson.definition;
    const course = lesson.course;
    const moduleIndex = data.modules.findIndex((module) => module.id === definition.moduleId);
    const scenario = `assets/scenarios/module-${String(Math.max(0, moduleIndex) + 1).padStart(2, "0")}.png`;
    const contextModel = lesson.activities[0] && lesson.activities[0].contextModel
      ? lesson.activities[0].contextModel
      : course.formula;
    setCoach(definition.explanation, "neutral", course.formula);
    if (definition.id === "m3-3") {
      elements.questionCard.innerHTML = `
        <span class="question-tag">Módulo 3 · Microaula</span>
        <h3>${escapeHtml(definition.title)}</h3>
        <p class="question-lead">${escapeHtml(definition.explanation)}</p>
        <div class="chain-visual" aria-label="Fluxo da regra da cadeia: a função interna recebe a variável, a função externa recebe esse resultado e a derivada é o produto das duas camadas">
          <div class="chain-node"><span>1 · interna</span><strong>${escapeHtml(course.inner)}</strong></div>
          <span class="chain-arrow" aria-hidden="true">→</span>
          <div class="chain-node"><span>2 · externa</span><strong>${escapeHtml(course.outer)}</strong></div>
          <span class="chain-arrow" aria-hidden="true">→</span>
          <div class="chain-node chain-result"><span>3 · derivada</span><strong>${escapeHtml(course.outerDerivative)} × ${escapeHtml(course.innerDerivative)}</strong></div>
        </div>
        <div class="formula-callout"><span>Modelo do curso de ${escapeHtml(course.name)}</span><strong>${escapeHtml(course.formula)}</strong></div>
        <a class="button button-ghost button-small topic-link" href="${getApostilaTopicHref(definition, course)}" target="_blank" rel="noopener">Estudar este tópico na apostila</a>`;
      setActions({ hint: false, check: false, next: true, nextLabel: "Vamos praticar" });
      return;
    }
    elements.questionCard.innerHTML = `
      <span class="question-tag">Fase ${definition.moduleId.replace("m", "")} · Microaula</span>
      <h3>${escapeHtml(definition.title)}</h3>
      <p class="question-lead">${escapeHtml(definition.explanation)}</p>
      <div class="generic-visual">
        <img src="${scenario}" alt="" loading="lazy">
        <div><strong>Objetivo da fase</strong><p>${escapeHtml(definition.objective)}</p></div>
      </div>
      <div class="formula-callout"><span>Cenário didático do curso</span><strong>${escapeHtml(course.name)} · ${escapeHtml(contextModel)}</strong></div>
      <a class="button button-ghost button-small topic-link" href="${getApostilaTopicHref(definition, course)}" target="_blank" rel="noopener">Estudar este tópico na apostila</a>`;
    setActions({ hint: false, check: false, next: true, nextLabel: "Vamos praticar" });
  }

  function renderOrderSelection() {
    const activity = lesson.activities[lesson.step - 1];
    const zone = elements.questionCard.querySelector(".order-zone");
    if (!zone || !activity) return;
    zone.innerHTML = lesson.orderSelection.length
      ? lesson.orderSelection.map((index, orderIndex) => `<button type="button" data-order-remove="${index}"><span>${orderIndex + 1}</span>${escapeHtml(activity.items[index])}</button>`).join("")
      : "<span>Selecione os passos na ordem correta.</span>";
    elements.questionCard.querySelectorAll("[data-order-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.orderRemove);
        lesson.orderSelection = lesson.orderSelection.filter((item) => item !== index);
        renderOrderSelection();
      });
    });
    elements.questionCard.querySelectorAll("[data-order-index]").forEach((button) => {
      button.disabled = lesson.orderSelection.includes(Number(button.dataset.orderIndex));
    });
  }

  function renderGenericActivity(activity) {
    const difficulty = {
      easy: "Fácil",
      medium: "Intermediária",
      hard: "Avançada",
      challenge: "Desafio final"
    }[activity.difficulty] || "";
    setCoach("Leia a instrução, tente sem olhar e depois confira.", "neutral", lesson.course.context);
    let controls = "";
    if (activity.type === "choice" || activity.type === "bug") {
      controls = `<div class="answer-options" role="radiogroup" aria-label="Alternativas">
        ${activity.options.map((option, optionIndex) => `<label class="answer-option"><input type="radio" name="activity-answer" value="${optionIndex}"><span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span><span>${escapeHtml(option)}</span></label>`).join("")}
      </div>`;
    } else if (activity.type === "fill") {
      controls = `<div class="generic-fill-grid">${activity.fields.map((field) => `<label><span>${escapeHtml(field.label)}</span><select name="field-${escapeHtml(field.id)}"><option value="">Escolha</option>${field.options.map((option, optionIndex) => `<option value="${optionIndex}">${escapeHtml(option)}</option>`).join("")}</select></label>`).join("")}</div>`;
    } else if (activity.type === "order") {
      controls = `<div class="order-board"><div class="order-zone" aria-live="polite"></div><div class="order-items">${activity.items.map((item, itemIndex) => `<button type="button" data-order-index="${itemIndex}">${escapeHtml(item)}</button>`).join("")}</div></div>`;
    } else if (activity.type === "pair") {
      controls = `<div class="pairing-list">${activity.pairs.map((pair, pairIndex) => `<div class="pair-row"><span class="pair-function">${escapeHtml(pair.left)}</span><span class="pair-line" aria-hidden="true"></span><label><span class="sr-only">Escolha o par ${pairIndex + 1}</span><select name="pair-${pairIndex}"><option value="">Escolha</option>${pair.options.map((option, optionIndex) => `<option value="${optionIndex}">${escapeHtml(option)}</option>`).join("")}</select></label></div>`).join("")}</div>`;
    }
    elements.questionCard.innerHTML = `
      <span class="question-tag">${activityTypeLabel(activity.type)}${difficulty ? ` · ${escapeHtml(difficulty)}` : ""}</span>
      <h3>${escapeHtml(activity.prompt)}</h3>
      <p class="question-lead">${activity.contextResolved ? `Questão final contextualizada — ${escapeHtml(activity.contextLabel)}. Modelo e números são fictícios; não use como recomendação.` : activity.generated ? "Atividade aleatória: os valores serão diferentes quando você iniciar esta lição novamente." : "Leia com atenção, tente e depois confira."}</p>
      ${controls}`;
    if (activity.type === "order") {
      lesson.orderSelection = [];
      elements.questionCard.querySelectorAll("[data-order-index]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.orderIndex);
          if (!lesson.orderSelection.includes(index) && lesson.orderSelection.length < activity.items.length) {
            lesson.orderSelection.push(index);
            renderOrderSelection();
          }
        });
      });
      renderOrderSelection();
    }
    setActions({ hint: true, check: true, next: false });
  }

  function getGenericAnswer(activity) {
    if (activity.type === "choice" || activity.type === "bug") {
      const value = document.querySelector('input[name="activity-answer"]:checked')?.value;
      return { answered: value !== undefined, correct: Number(value) === Number(activity.answer), message: Number(value) === Number(activity.answer) ? activity.correct : activity.retry };
    }
    if (activity.type === "fill") {
      const values = activity.fields.map((field) => document.querySelector(`select[name="field-${field.id}"]`)?.value);
      const answered = values.every((value) => value !== undefined && value !== "");
      const correct = values.every((value, index) => Number(value) === Number(activity.fields[index].answer));
      return { answered, correct, message: correct ? activity.correct : activity.retry };
    }
    if (activity.type === "order") {
      const correct = lesson.orderSelection.length === activity.answer.length && lesson.orderSelection.every((value, index) => value === activity.answer[index]);
      return { answered: lesson.orderSelection.length === activity.items.length, correct, message: correct ? activity.correct : activity.retry };
    }
    if (activity.type === "pair") {
      const values = activity.pairs.map((pair, index) => document.querySelector(`select[name="pair-${index}"]`)?.value);
      const answered = values.every((value) => value !== undefined && value !== "");
      const correct = values.every((value, index) => Number(value) === Number(activity.pairs[index].answer));
      return { answered, correct, message: correct ? activity.correct : activity.retry };
    }
    return { answered: false, correct: false, message: activity.retry };
  }

  function renderLesson() {
    if (!lesson) return;
    const step = lesson.step;
    const total = lesson.activities.length + 1;
    setProgress(step, total);
    elements.gameHearts.textContent = String(lesson.hearts);
    hideFeedback();
    lesson.solved = false;

    if (step === 0) renderGenericExplanation();
    else renderGenericActivity(lesson.activities[step - 1]);

    elements.checkAnswer.onclick = checkCurrentAnswer;
    elements.nextButton.onclick = goForward;
    elements.hintButton.onclick = showHint;
  }

  function renderExplanationStep(course) {
    setCoach("Toda função composta abre um caminho: por fora e por dentro.", "neutral", course.formula);
    elements.questionCard.innerHTML = `
      <span class="question-tag">Ideia visual</span>
      <h3>A corrente tem duas etapas</h3>
      <p class="question-lead">A Regra da Cadeia multiplica a derivada da função externa pela derivada da função interna.</p>
      <div class="chain-visual" aria-label="Fluxo da regra da cadeia: a função interna recebe a variável, a função externa recebe esse resultado e a derivada é o produto das duas camadas">
        <div class="chain-node"><span>1 · interna</span><strong>${escapeHtml(course.inner)}</strong></div>
        <span class="chain-arrow" aria-hidden="true">→</span>
        <div class="chain-node"><span>2 · externa</span><strong>${escapeHtml(course.outer)}</strong></div>
        <span class="chain-arrow" aria-hidden="true">→</span>
        <div class="chain-node chain-result"><span>3 · derivada</span><strong>${escapeHtml(course.outerDerivative)} × ${escapeHtml(course.innerDerivative)}</strong></div>
      </div>
      <div class="formula-callout">
        <span>Modelo do curso de ${escapeHtml(course.name)}</span>
        <strong>${escapeHtml(course.formula)}</strong>
      </div>`;
    setActions({ hint: false, check: false, next: true, nextLabel: "Vamos praticar" });
  }

  function renderConceptStep(course) {
    setCoach("A pergunta é simples: qual expressão trabalha por dentro?", "neutral", course.inner);
    const options = uniqueOptions([
      course.inner,
      course.outerDerivative,
      `${course.innerDerivative} responde diretamente a ${course.inner}`,
      "Toda a função é a camada interna"
    ]);
    elements.questionCard.innerHTML = `
      <span class="question-tag">Escolha conceitual</span>
      <h3>Qual é a função interna?</h3>
      <p class="question-lead">${escapeHtml(course.prompt)} Para aplicar a regra, primeiro identifique a camada que contém a variável.</p>
      <div class="formula-card"><span>Modelo</span><strong>${escapeHtml(course.formula)}</strong></div>
      <div class="answer-options" role="radiogroup" aria-label="Alternativas para a função interna">
        ${options.map((option, index) => `
          <label class="answer-option">
            <input type="radio" name="concept-answer" value="${escapeHtml(option)}">
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span>${escapeHtml(option)}</span>
          </label>`).join("")}
      </div>`;
    setActions({ hint: true, check: true, next: false });
  }

  function renderFillGapStep(course) {
    setCoach("Complete corrente por corrente: fora, dentro e produto.", "neutral", course.formula);
    const outerOptions = uniqueOptions([course.outerDerivative, "u", course.derivative, "0"]);
    const innerOptions = uniqueOptions([course.innerDerivative, course.outerDerivative, "1", "u²"]);
    const finalOptions = uniqueOptions([course.derivative, course.outerDerivative, course.innerDerivative, course.formula]);
    elements.questionCard.innerHTML = `
      <span class="question-tag">Preencha as lacunas</span>
      <h3>Monte a Regra da Cadeia</h3>
      <p class="question-lead">Escolha cada parte da derivada. A mesma estrutura será usada no contexto de ${escapeHtml(course.name)}.</p>
      <div class="formula-card"><span>Função</span><strong>${escapeHtml(course.formula)}</strong></div>
      <div class="gap-builder">
        <label><span>Derivada externa</span><select name="outer-gap"><option value="">Escolha</option>${outerOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}</select></label>
        <span class="gap-times" aria-hidden="true">×</span>
        <label><span>Derivada interna</span><select name="inner-gap"><option value="">Escolha</option>${innerOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}</select></label>
        <span class="gap-equals" aria-hidden="true">=</span>
        <label class="gap-final"><span>Resultado</span><select name="final-gap"><option value="">Escolha</option>${finalOptions.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}</select></label>
      </div>`;
    setActions({ hint: true, check: true, next: false });
  }

  function renderErrorStep(course) {
    setCoach("Um cálculo quase certo pode esconder a parte que forgot a corrente.", "neutral", course.formula);
    const lines = [
      "Defina u como a função interna.",
      `Reescreva a função como ${course.outer}.`,
      `Use apenas ${course.outerDerivative} como derivada.`,
      "Conclua a conta final."
    ];
    elements.questionCard.innerHTML = `
      <span class="question-tag">Encontre o erro</span>
      <h3>Em qual linha a corrente foi perdida?</h3>
      <p class="question-lead">A tentativa abaixo forgot derivar a função interna.</p>
      <div class="debug-card">
        <div class="debug-function">${escapeHtml(course.formula)}</div>
        ${lines.map((line, index) => `
          <label class="debug-line">
            <span>${index + 1}</span>
            <input type="radio" name="error-answer" value="line-${index + 1}">
            <code>${escapeHtml(line)}</code>
          </label>`).join("")}
      </div>`;
    setActions({ hint: true, check: true, next: false });
  }

  function renderPairingStep(course) {
    setCoach("Agora conecte cada função à sua derivada, sem esquecer a camada interna.", "neutral", course.formula);
    const pairs = [
      { left: course.formula, right: course.derivative },
      { left: "f(x) = sin(x)", right: "f′(x) = cos(x)" },
      { left: "g(x) = eˣ", right: "g′(x) = eˣ" }
    ];
    const derivatives = uniqueOptions(pairs.map((pair) => pair.right).concat([
      "−cos(x)",
      "eˣ²",
      course.innerDerivative
    ]));
    elements.questionCard.innerHTML = `
      <span class="question-tag">Associação de pares</span>
      <h3>Conecte função e derivada</h3>
      <p class="question-lead">Uma função pode passar por outra antes de ser derivada. A seleção funciona por toque, mouse ou teclado.</p>
      <div class="pairing-list">
        ${pairs.map((pair, index) => `
          <div class="pair-row">
            <span class="pair-function">${escapeHtml(pair.left)}</span>
            <span class="pair-line" aria-hidden="true"></span>
            <label>
              <span class="sr-only">Derivada do par ${index + 1}</span>
              <select name="pair-${index + 1}">
                <option value="">Escolha a derivada</option>
                ${derivatives.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
              </select>
            </label>
          </div>`).join("")}
      </div>`;
    setActions({ hint: true, check: true, next: false });
  }

  function getCurrentAnswer() {
    const step = lesson.step;
    if (step === 1) {
      const value = document.querySelector('input[name="concept-answer"]:checked')?.value;
      return {
        answered: Boolean(value),
        correct: value === lesson.course.inner,
        message: `A função interna é ${lesson.course.inner}; a externa recebe esse resultado.`
      };
    }
    if (step === 2) {
      const outer = document.querySelector('select[name="outer-gap"]')?.value;
      const inner = document.querySelector('select[name="inner-gap"]')?.value;
      const final = document.querySelector('select[name="final-gap"]')?.value;
      return {
        answered: Boolean(outer && inner && final),
        correct: outer === lesson.course.outerDerivative && inner === lesson.course.innerDerivative && final === lesson.course.derivative,
        message: `A corrente correta é ${lesson.course.outerDerivative} × ${lesson.course.innerDerivative} = ${lesson.course.derivative}.`
      };
    }
    if (step === 3) {
      const value = document.querySelector('input[name="error-answer"]:checked')?.value;
      return {
        answered: Boolean(value),
        correct: value === "line-3",
        message: `Na linha 3 faltou multiplicar por ${lesson.course.innerDerivative}.`
      };
    }
    if (step === 4) {
      const course = lesson.course;
      const values = [1, 2, 3].map((index) => document.querySelector(`select[name="pair-${index}"]`)?.value);
      const correct = values[0] === course.derivative
        && values[1] === "f′(x) = cos(x)"
        && values[2] === "g′(x) = eˣ";
      return {
        answered: values.every(Boolean),
        correct,
        message: `No contexto de ${course.name}, a corrente termina em ${course.derivative}.`
      };
    }
    return { answered: false, correct: false, message: "" };
  }

  function restartActivityWithEncouragement() {
    if (!lesson || lesson.restartPending) return;
    lesson.restartPending = true;
    state.hearts = 0;
    saveState();
    renderStats();
    elements.gameHearts.textContent = "0";
    showFeedback(false, "Você perdeu os três corações, mas seu caminho não termina aqui. A Capi believe in you: vamos reiniciar esta atividade — a lição — com uma nova sequência de valores.");
    restartTimer = window.setTimeout(() => {
      restartTimer = null;
      if (!lesson || lesson.completed) return;
      state.hearts = 3;
      saveState();
      renderStats();
      elements.gameHearts.textContent = "3";
      lesson.attemptSeed = createAttemptSeed();
      lesson.activities = buildLessonActivities(lesson.definition, lesson.course, lesson.attemptSeed);
      lesson.step = 0;
      lesson.startedAt = Date.now();
      lesson.firstTry = Array(lesson.activities.length + 1).fill(null);
      lesson.errors = 0;
      lesson.hints = 0;
      lesson.hearts = 3;
      lesson.solved = false;
      lesson.completed = false;
      lesson.restartPending = false;
      lesson.orderSelection = [];
      renderLesson();
      elements.closeGame.focus();
    }, 1800);
  }

  function checkCurrentAnswer() {
    if (!lesson || lesson.solved || lesson.restartPending) return;
    const activity = lesson.activities[lesson.step - 1];
    if (!activity) return;
    const answer = getGenericAnswer(activity);
    if (!answer.answered) {
      showFeedback(false, "Selecione uma resposta antes de verificar. Nenhum coração foi usado.");
      return;
    }
    if (lesson.firstTry[lesson.step] === null) lesson.firstTry[lesson.step] = answer.correct;

    if (answer.correct) {
      lesson.solved = true;
      showFeedback(true, answer.message);
      setCoach(data.feedback.correct[lesson.step % data.feedback.correct.length], "celebrate", lesson.course.context);
      setActions({ hint: false, check: false, next: true, nextLabel: lesson.step === lesson.activities.length ? "Concluir fase" : "Próxima tela" });
    } else {
      lesson.errors += 1;
      lesson.hearts = Math.max(0, lesson.hearts - 1);
      state.hearts = lesson.hearts;
      saveState();
      elements.gameHearts.textContent = String(lesson.hearts);
      showFeedback(false, answer.message || data.feedback.retry[lesson.errors % data.feedback.retry.length]);
      setCoach("Seu caminho não termina com uma resposta errada.", "retry", lesson.course.context);
      if (lesson.hearts === 0) restartActivityWithEncouragement();
    }
  }

  function showHint() {
    if (!lesson || lesson.restartPending) return;
    lesson.hints += 1;
    const activity = lesson.activities[lesson.step - 1];
    if (activity) showFeedback(false, activity.hint);
  }

  function goForward() {
    if (!lesson || lesson.restartPending) return;
    if (lesson.completed) {
      closeGame();
      return;
    }
    if (lesson.step < lesson.activities.length) {
      lesson.step += 1;
      renderLesson();
      return;
    }
    finishLesson();
  }

  function finishLesson() {
    const course = lesson.course;
    const definition = lesson.definition;
    const correctFirstTry = lesson.firstTry.slice(1).filter(Boolean).length;
    const accuracy = Math.round((correctFirstTry / lesson.activities.length) * 100);
    const alreadyCompleted = state.completed.includes(definition.id);
    const xp = alreadyCompleted ? 0 : 20 + correctFirstTry * 2;
    const elapsed = Math.max(1, Math.round((Date.now() - lesson.startedAt) / 1000));
    const today = new Date().toISOString().slice(0, 10);

    if (state.lastActiveDate !== today) state.streak += 1;
    state.lastActiveDate = today;
    state.xp += xp;
    state.league = normalizeLeague(state.league);
    if (!alreadyCompleted) {
      state.league.weeklyXp += xp;
      state.league.completedThisWeek += 1;
      state.league.bestWeeklyXp = Math.max(state.league.bestWeeklyXp, state.league.weeklyXp);
    }
    if (!state.completed.includes(definition.id)) state.completed.push(definition.id);
    if (definition.id === "m3-3" && !state.demoCompleted.includes(definition.id)) state.demoCompleted.push(definition.id);
    lesson.completed = true;
    saveState();

    const minutes = Math.floor(elapsed / 60);
    const seconds = String(elapsed % 60).padStart(2, "0");
    setProgress(lesson.activities.length + 1, lesson.activities.length + 1);
    elements.gameHearts.textContent = String(lesson.hearts);
    setCoach(
      accuracy === 100
        ? "Sequência forte! A fase ficou redondinha."
        : "Limite preservado, raciocínio restaurado. Você pode revisar quando quiser.",
      accuracy === 100 ? "celebrate" : "encourage",
      course.context
    );
    elements.questionCard.innerHTML = `
      <span class="question-tag">Fase concluída</span>
      <h3>${escapeHtml(definition.title)} agora tem um novo marco</h3>
      <p class="question-lead">Você concluiu as atividades de ${escapeHtml(definition.title.toLowerCase())} no contexto de ${escapeHtml(course.name)}.</p>
      <div class="result-grid">
        <div><span>XP ganho</span><strong>+${xp}</strong><small>${accuracy}% de primeira tentativa</small></div>
        <div><span>Tempo</span><strong>${minutes}:${seconds}</strong><small>tempo real da sessão</small></div>
        <div><span>Erros</span><strong>${lesson.errors}</strong><small>${lesson.hints} pistas usadas</small></div>
      </div>
      <div class="mastery-note">
        <strong>Próxima recomendação</strong>
        <span>Revise esta fase em outro contexto do curso e siga para a próxima microaula da trilha.</span>
      </div>
      <button class="button button-secondary" id="replayLesson" type="button">Jogar novamente</button>`;
    setActions({ hint: false, check: false, next: true, nextLabel: "Voltar à trilha" });
    document.getElementById("replayLesson").addEventListener("click", () => {
      const lessonId = lesson.definition.id;
      closeGame();
      window.setTimeout(() => startGame(lessonId), 0);
    });

    renderStats();
    renderLeague();
    renderSkillTree();
  }

  function handleCourseGridClick(event) {
    const button = event.target.closest("[data-course]");
    if (!button) return;
    selectCourse(button.dataset.course, true);
  }

  function handleTreeClick(event) {
    const button = event.target.closest("[data-unit]");
    if (!button) return;
    if (button.dataset.startUnit) {
      startGame(button.dataset.startUnit);
      return;
    }
    showToast("Esta fase já está disponível na trilha.");
  }

  function bindEvents() {
    elements.courseGrid.addEventListener("click", handleCourseGridClick);
    elements.skillTree.addEventListener("click", handleTreeClick);
    elements.courseSearch.addEventListener("input", renderCourses);
    elements.closeGame.addEventListener("click", closeGame);

    elements.gameOverlay.addEventListener("click", (event) => {
      if (event.target === elements.gameOverlay) closeGame();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !elements.gameOverlay.hidden) closeGame();
    });

    document.querySelectorAll("[data-start-game]").forEach((button) => {
      button.addEventListener("click", () => startGame("m3-3"));
    });

    document.querySelectorAll("[data-scroll-to]").forEach((button) => {
      button.addEventListener("click", () => {
        document.getElementById(button.dataset.scrollTo).scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    elements.themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(themeKey, nextTheme);
      state.theme = nextTheme;
      saveState();
      renderTheme();
    });

    elements.resetProgress.addEventListener("click", () => {
      if (!window.confirm("Apagar o curso selecionado e o progresso salvo neste navegador?")) return;
      localStorage.removeItem(storageKey);
      state = { ...defaultState, completed: [], demoCompleted: [], league: normalizeLeague(defaultState.league) };
      saveState();
      renderAll();
      showToast("Progresso local removido.");
    });

    window.addEventListener("hashchange", renderTheme);
  }

  function renderAll() {
    renderTheme();
    renderCourses();
    renderWorkspace();
    renderStats();
    renderLeague();
    renderSkillTree();
    renderMechanics();
    renderBadges();
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  bindEvents();
  renderAll();
  registerServiceWorker();
})();
