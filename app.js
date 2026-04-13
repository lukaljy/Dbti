(() => {
  const data = window.DBTI_DATA;
  const tone = data.config.defaultTone;
  const dimensionKeys = data.internalDimensions.map((dimension) => dimension.key);

  const state = {
    currentQuestionIndex: 0,
    answers: {},
    selectedOptionIndex: null,
    result: null
  };

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    startScreen: $("#start-screen"),
    quizScreen: $("#quiz-screen"),
    resultScreen: $("#result-screen"),
    startButton: $("#start-btn"),
    nextButton: $("#next-btn"),
    restartButton: $("#restart-btn"),
    copyButton: $("#copy-btn"),
    questionTitle: $("#question-title"),
    questionText: $("#question-text"),
    optionList: $("#option-list"),
    choiceHint: $("#choice-hint"),
    progressCount: $("#progress-count"),
    progressFill: $("#progress-fill"),
    resultCode: $("#result-code"),
    resultName: $("#result-name"),
    resultTagline: $("#result-tagline"),
    resultDescription: $("#result-desc"),
    resultMatch: $("#result-match"),
    resultSecondary: $("#result-secondary"),
    radarChart: $("#radar-chart"),
    dimensionList: $("#dimension-list"),
    shareText: $("#share-text")
  };

  function init() {
    elements.startButton.addEventListener("click", startTest);
    elements.nextButton.addEventListener("click", goNext);
    elements.restartButton.addEventListener("click", restartTest);
    elements.copyButton.addEventListener("click", copyShareText);
    window.addEventListener("resize", () => {
      if (state.result) drawRadarChart(state.result.displayScores);
    });
  }

  function showScreen(screenName) {
    const target = elements[`${screenName}Screen`];
    [elements.startScreen, elements.quizScreen, elements.resultScreen].forEach((screen) => {
      screen.classList.toggle("is-active", screen === target);
    });
  }

  function startTest() {
    state.currentQuestionIndex = 0;
    state.answers = {};
    state.selectedOptionIndex = null;
    state.result = null;
    renderQuestion();
    showScreen("quiz");
  }

  function restartTest() {
    startTest();
  }

  function renderQuestion() {
    const question = data.questions[state.currentQuestionIndex];
    const questionNumber = state.currentQuestionIndex + 1;
    const total = data.questions.length;
    const answered = state.answers[question.id] !== undefined;
    const progress = answered ? questionNumber / total : state.currentQuestionIndex / total;

    elements.questionTitle.textContent = `第 ${String(questionNumber).padStart(2, "0")} 题`;
    elements.questionText.textContent = question.text;
    elements.progressCount.textContent = `${String(questionNumber).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    elements.progressFill.style.width = `${Math.round(progress * 100)}%`;
    elements.nextButton.disabled = state.selectedOptionIndex === null;
    elements.nextButton.textContent = questionNumber === total ? "查看结果" : "下一题";
    elements.choiceHint.textContent = state.selectedOptionIndex === null
      ? "选择一个最像你的反应。"
      : `已选择 ${question.options[state.selectedOptionIndex].label}，可以交卷。`;

    elements.optionList.innerHTML = question.options.map((option, index) => {
      const selected = index === state.selectedOptionIndex ? " is-selected" : "";
      return `
        <button class="option-button${selected}" type="button" data-option-index="${index}">
          <span class="option-label">${option.label}</span>
          <span class="option-text">${option.text}</span>
        </button>
      `;
    }).join("");

    elements.optionList.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => selectOption(Number(button.dataset.optionIndex)));
    });
  }

  function selectOption(optionIndex) {
    const question = data.questions[state.currentQuestionIndex];
    state.selectedOptionIndex = optionIndex;
    state.answers[question.id] = optionIndex;
    renderQuestion();
  }

  function goNext() {
    if (state.selectedOptionIndex === null) return;

    const isLastQuestion = state.currentQuestionIndex === data.questions.length - 1;
    if (!isLastQuestion) {
      state.currentQuestionIndex += 1;
      state.selectedOptionIndex = state.answers[data.questions[state.currentQuestionIndex].id] ?? null;
      renderQuestion();
      return;
    }

    state.result = computeResult();
    renderResult(state.result);
    showScreen("result");
    requestAnimationFrame(() => drawRadarChart(state.result.displayScores));
  }

  function computeResult() {
    const scores = Object.fromEntries(dimensionKeys.map((key) => [key, 50]));
    const touched = Object.fromEntries(dimensionKeys.map((key) => [key, 0]));

    data.questions.forEach((question) => {
      const selectedIndex = state.answers[question.id];
      if (selectedIndex === undefined) return;

      const option = question.options[selectedIndex];
      Object.entries(option.effects).forEach(([dimensionKey, delta]) => {
        if (!(dimensionKey in scores)) return;
        scores[dimensionKey] = clamp(scores[dimensionKey] + delta, 0, 100);
        touched[dimensionKey] += 1;
      });
    });

    normalizeScores(scores);

    const matches = data.personalityTypes
      .map((type) => scoreTypeMatch(type, scores, touched))
      .sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return b.similarity - a.similarity;
      });

    return {
      scores,
      touched,
      primary: matches[0],
      secondary: matches[1],
      displayScores: computeDisplayScores(scores)
    };
  }

  function scoreTypeMatch(type, scores, touched) {
    let distance = 0;
    let weightTotal = 0;

    dimensionKeys.forEach((key) => {
      const weight = touched[key] > 0 ? 1 : 0.15;
      const target = type.profile[key] ?? 50;
      distance += Math.abs(scores[key] - target) * weight;
      weightTotal += 100 * weight;
    });

    const similarity = Math.max(0, Math.round((1 - distance / weightTotal) * 100));
    return { ...type, distance, similarity };
  }

  function normalizeScores(scores) {
    const mean = dimensionKeys.reduce((sum, key) => sum + scores[key], 0) / dimensionKeys.length;

    dimensionKeys.forEach((key) => {
      scores[key] = clamp(50 + (scores[key] - mean) * 1.45, 0, 100);
    });
  }

  function computeDisplayScores(scores) {
    const primaryWeight = data.config.displayPrimaryWeight;
    const secondaryWeight = 1 - primaryWeight;
    const displayScores = {};

    data.displayDimensions.forEach((dimension) => {
      const primaryValue = scores[dimension.primary] ?? 50;
      const secondaryValue = scores[dimension.secondary] ?? 50;
      displayScores[dimension.key] = Math.round(
        primaryValue * primaryWeight + secondaryValue * secondaryWeight
      );
    });

    return displayScores;
  }

  function renderResult(result) {
    const primary = result.primary;
    const secondary = result.secondary;
    const description = primary.copy[tone] || primary.copy.normal;
    const shareText = primary.share[tone] || primary.share.normal;

    elements.resultCode.textContent = primary.code;
    elements.resultName.textContent = primary.name;
    elements.resultTagline.textContent = primary.tagline;
    elements.resultDescription.textContent = description;
    elements.resultMatch.textContent = `${primary.similarity}%`;
    elements.resultSecondary.textContent = secondary
      ? `相似人格：${secondary.name} · ${secondary.similarity}%`
      : "";
    elements.shareText.textContent = shareText;
    elements.copyButton.textContent = "复制分享文案";

    elements.dimensionList.innerHTML = data.displayDimensions.map((dimension) => {
      const score = result.displayScores[dimension.key];
      return `
        <div class="dimension-row">
          <span>${dimension.label}</span>
          <strong>${score}</strong>
        </div>
      `;
    }).join("");
  }

  function drawRadarChart(displayScores) {
    const canvas = elements.radarChart;
    const ctx = canvas.getContext("2d");
    const holderWidth = canvas.parentElement.clientWidth || 360;
    const size = Math.min(holderWidth, 360);
    const dpr = window.devicePixelRatio || 1;
    const dimensions = data.displayDimensions;
    const center = size / 2;
    const radius = size * 0.32;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.lineJoin = "round";

    drawRadarGrid(ctx, dimensions, center, radius);
    drawRadarShape(ctx, dimensions, displayScores, center, radius);
    drawRadarLabels(ctx, dimensions, displayScores, center, radius);
  }

  function drawRadarGrid(ctx, dimensions, center, radius) {
    ctx.strokeStyle = "rgba(230, 238, 255, 0.18)";
    ctx.lineWidth = 1;

    for (let ring = 1; ring <= 5; ring += 1) {
      const ringRadius = (radius / 5) * ring;
      ctx.beginPath();
      dimensions.forEach((dimension, index) => {
        const point = getRadarPoint(index, dimensions.length, center, ringRadius);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();
    }

    dimensions.forEach((dimension, index) => {
      const point = getRadarPoint(index, dimensions.length, center, radius);
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
  }

  function drawRadarShape(ctx, dimensions, displayScores, center, radius) {
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, "rgba(255, 231, 122, 0.56)");
    gradient.addColorStop(1, "rgba(232, 64, 64, 0.36)");

    ctx.beginPath();
    dimensions.forEach((dimension, index) => {
      const value = (displayScores[dimension.key] ?? 0) / 100;
      const point = getRadarPoint(index, dimensions.length, center, radius * value);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 231, 122, 0.92)";
    ctx.lineWidth = 2;
    ctx.stroke();

    dimensions.forEach((dimension, index) => {
      const value = (displayScores[dimension.key] ?? 0) / 100;
      const point = getRadarPoint(index, dimensions.length, center, radius * value);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe77a";
      ctx.fill();
    });
  }

  function drawRadarLabels(ctx, dimensions, displayScores, center, radius) {
    ctx.fillStyle = "rgba(246, 239, 222, 0.92)";
    ctx.font = "12px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    dimensions.forEach((dimension, index) => {
      const point = getRadarPoint(index, dimensions.length, center, radius + 34);
      ctx.fillText(dimension.label, point.x, point.y - 7);
      ctx.fillStyle = "rgba(255, 231, 122, 0.9)";
      ctx.fillText(String(displayScores[dimension.key] ?? 0), point.x, point.y + 10);
      ctx.fillStyle = "rgba(246, 239, 222, 0.92)";
    });
  }

  function getRadarPoint(index, total, center, radius) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  }

  async function copyShareText() {
    const text = elements.shareText.textContent.trim();
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      elements.copyButton.textContent = "已复制";
    } catch (error) {
      fallbackCopy(text);
      elements.copyButton.textContent = "已复制";
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  init();
})();
