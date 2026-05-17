const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const menu = document.getElementById('menu');
const gameShell = document.getElementById('gameShell');
const quizModal = document.getElementById('quizModal');
const victory = document.getElementById('victory');
const characterGrid = document.getElementById('characterGrid');
const howButton = document.getElementById('howButton');
const howTo = document.getElementById('howTo');

const hud = {
  heroName: document.getElementById('heroName'),
  score: document.getElementById('score'),
  health: document.getElementById('health'),
  ammo: document.getElementById('ammo'),
  bossName: document.getElementById('bossName'),
  bossHp: document.getElementById('bossHp'),
  benchmarkName: document.getElementById('benchmarkName'),
  toast: document.getElementById('toast'),
};

const quizEls = {
  benchmark: document.getElementById('quizBenchmark'),
  title: document.getElementById('quizTitle'),
  prompt: document.getElementById('quizPrompt'),
  answers: document.getElementById('answers'),
  feedback: document.getElementById('quizFeedback'),
};

const heroes = [
  {
    id: 'zuck', name: 'Mark Zuckercode', emoji: '🕶️', accent: '#53f5ff',
    blurb: 'Ships social graph shurikens and quietly copies the boss mechanics better than the boss.',
    weapon: 'Metaverse Rail-Pitch', speed: 3.2, accuracy: 1.08, value: 220,
  },
  {
    id: 'elon', name: 'Elon Musket', emoji: '🚀', accent: '#ffd166',
    blurb: 'Fires reusable rockets of hype. Sometimes the reload is a tweetstorm.',
    weapon: 'X-Terminator Blaster', speed: 3.7, accuracy: 0.94, value: 260,
  },
  {
    id: 'sam', name: 'Sam Altmanifold', emoji: '🧠', accent: '#9dff72',
    blurb: 'Turns alignment memos into laser shields and negotiates with the final boss mid-fight.',
    weapon: 'AGI SAFE-ty Shotgun', speed: 3.0, accuracy: 1.18, value: 300,
  },
  {
    id: 'joe', name: 'Joe Rogun', emoji: '🎙️', accent: '#ff4fd8', locked: true,
    blurb: 'Bonus unlock. Asks the boss if it has tried elk meat, sauna, and a 14-hour podcast.',
    weapon: 'Podcast Shockwave', speed: 3.5, accuracy: 1.0, value: 420,
  },
];

const quizBank = [
  {
    benchmark: 'AIME-style math',
    title: 'Runway Arithmetic',
    prompt: 'A startup burns $7M per quarter. Revenue starts at $2M in quarter 1 and grows by $1M each quarter. What is cumulative net burn after 4 quarters?',
    answers: ['$10M', '$12M', '$14M', '$16M'], correct: 2,
    explain: 'Burn is 7×4 = 28. Revenue is 2+3+4+5 = 14. Net burn is 28 - 14 = $14M.',
  },
  {
    benchmark: 'GPQA-style science',
    title: 'Cooling the GPU Furnace',
    prompt: 'Which change most directly increases heat transfer from a hot chip to a liquid cold plate, assuming the coolant remains below boiling?',
    answers: ['Lowering contact pressure', 'Using a thicker insulating pad', 'Increasing thermal interface conductivity', 'Painting the server rack matte black'], correct: 2,
    explain: 'Higher thermal interface conductivity lowers thermal resistance between chip and cold plate.',
  },
  {
    benchmark: 'LiveCodeBench-style coding',
    title: 'Patch the Valuation Counter',
    prompt: 'A function should return true when every character in a string appears the same number of times. Which map check is sufficient?',
    answers: ['All frequency values are equal', 'The string length is prime', 'The first and last characters match', 'There are more vowels than consonants'], correct: 0,
    explain: 'Counting characters and verifying one shared frequency solves the requirement.',
  },
  {
    benchmark: 'SWE-bench-style debugging',
    title: 'Regression in the Demo',
    prompt: 'A UI button submits twice after a refactor. The handler is attached during every render. What is the best fix?',
    answers: ['Add more logging only', 'Register the handler once and clean it up on unmount', 'Increase the server timeout', 'Rename the button'], correct: 1,
    explain: 'Repeated registration creates duplicate listeners; lifecycle cleanup prevents stacked submissions.',
  },
  {
    benchmark: 'MMLU-Pro-style reasoning',
    title: 'Boardroom Logic',
    prompt: 'If every profitable product has retention, and no product with retention is being sunset, what follows?',
    answers: ['Profitable products are not being sunset', 'All sunset products are profitable', 'No products have retention', 'Every retained product is profitable'], correct: 0,
    explain: 'Profitability implies retention, and retention excludes sunset status.',
  },
  {
    benchmark: 'IFEval-style instruction following',
    title: 'Investor Update Constraints',
    prompt: 'You must write exactly two bullet points and include the word "runway" once. Which response obeys?',
    answers: ['- We grew.\n- Runway improved.', 'Runway improved and we grew.', '- runway runway\n- growth', '- We grew.\n- Margins improved.\n- runway improved.'], correct: 0,
    explain: 'It has exactly two bullets and uses the target word once, case-insensitively.',
  },
  {
    benchmark: 'ARC-AGI-style pattern',
    title: 'Grid of Doom',
    prompt: 'Pattern: red squares move one cell right each step; blue squares stay fixed. What should happen next?',
    answers: ['Only red squares shift right', 'Only blue squares shift right', 'Everything disappears', 'All squares turn green'], correct: 0,
    explain: 'The transformation rule applies only to red squares.',
  },
  {
    benchmark: 'LiveBench-style data analysis',
    title: 'KPI Ambush',
    prompt: 'A chart shows signups up 20%, activation flat, and churn up 20%. What is the safest conclusion?',
    answers: ['Growth is unequivocally healthy', 'Acquisition improved, but retention risk needs investigation', 'The product has no users', 'Churn is impossible to measure'], correct: 1,
    explain: 'More signups do not guarantee healthy growth when churn worsens and activation is flat.',
  },
];

const bosses = [
  { name: 'Googol Goliath', emoji: '🔎', color: '#53f5ff', benchmark: 'MMLU-Pro-ish', hp: 100, x: 520, y: 190, taunt: 'I indexed your pitch deck before you wrote it.' },
  { name: 'Microhard Azure Dragon', emoji: '🪟', color: '#9dff72', benchmark: 'SWE-bench-ish', hp: 120, x: 820, y: 420, taunt: 'Your enterprise procurement cycle begins now.' },
  { name: 'Cloudopus', emoji: '🐙', color: '#ff4fd8', benchmark: 'GPQA-ish', hp: 145, x: 340, y: 520, taunt: 'Eight arms. Zero rate limits.' },
  { name: 'Kimi K2 Benchmark Warlord', emoji: '🐉', color: '#ffd166', benchmark: 'LiveBench-ish', hp: 170, x: 950, y: 160, taunt: 'Dynamic evals. Dynamic doom.' },
];

const walls = [
  { x: 120, y: 120, w: 900, h: 24 }, { x: 120, y: 620, w: 900, h: 24 },
  { x: 120, y: 120, w: 24, h: 524 }, { x: 996, y: 120, w: 24, h: 524 },
  { x: 300, y: 230, w: 28, h: 260 }, { x: 600, y: 120, w: 28, h: 250 },
  { x: 742, y: 360, w: 28, h: 260 }, { x: 452, y: 470, w: 310, h: 26 },
];

let selectedHero = heroes[0];
let joeUnlocked = localStorage.getItem('exitValueJoeUnlocked') === 'true';
let player, keys, bullets, particles, activeBossIndex, activeQuestion, score, lastTime, running, pausedForQuiz;

function renderHeroCards() {
  characterGrid.innerHTML = '';
  heroes.forEach((hero) => {
    const locked = hero.id === 'joe' && !joeUnlocked;
    const card = document.createElement('button');
    card.className = `character-card ${selectedHero.id === hero.id ? 'selected' : ''} ${locked ? 'locked' : ''}`;
    card.style.setProperty('--accent', hero.accent);
    card.innerHTML = `
      <div class="avatar">${hero.emoji}</div>
      <h3>${hero.name}</h3>
      <p>${locked ? 'Locked: beat the four-boss benchmark gauntlet.' : hero.blurb}</p>
      <div class="stat"><span>Weapon</span><strong>${hero.weapon}</strong></div>
      <div class="stat"><span>Seed Value</span><strong>$${hero.value}B</strong></div>`;
    card.addEventListener('click', () => {
      if (locked) return;
      selectedHero = hero;
      renderHeroCards();
    });
    characterGrid.appendChild(card);
  });
}

function resetGame() {
  player = { x: 180, y: 180, angle: 0, health: 100, ammo: 30, cooldown: 0 };
  keys = new Set();
  bullets = [];
  particles = [];
  activeBossIndex = 0;
  activeQuestion = 0;
  score = selectedHero.value;
  bosses.forEach((boss, i) => {
    boss.currentHp = boss.hp;
    boss.defeated = false;
    boss.x += i * 0;
  });
  running = true;
  pausedForQuiz = false;
  updateHud();
}

function updateHud() {
  const boss = bosses[activeBossIndex] || bosses[bosses.length - 1];
  hud.heroName.textContent = `${selectedHero.emoji} ${selectedHero.name}`;
  hud.score.textContent = `$${score.toFixed(1)}B`;
  hud.health.textContent = `${Math.max(0, Math.round(player.health))}%`;
  hud.ammo.textContent = player.ammo;
  hud.bossName.textContent = `${boss.emoji} ${boss.name}`;
  hud.bossHp.textContent = `${Math.max(0, Math.round((boss.currentHp / boss.hp) * 100))}%`;
  hud.benchmarkName.textContent = boss.benchmark;
}

function startGame() {
  resetGame();
  menu.classList.add('hidden');
  victory.classList.add('hidden');
  gameShell.classList.remove('hidden');
  hud.toast.textContent = `${bosses[0].name}: ${bosses[0].taunt}`;
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function isBlocked(x, y) {
  return walls.some((wall) => x > wall.x - 16 && x < wall.x + wall.w + 16 && y > wall.y - 16 && y < wall.y + wall.h + 16);
}

function update(dt) {
  if (!running || pausedForQuiz) return;
  player.cooldown = Math.max(0, player.cooldown - dt);
  const moveSpeed = selectedHero.speed * dt * 0.11;
  let dx = 0; let dy = 0;
  if (keys.has('w') || keys.has('arrowup')) { dx += Math.cos(player.angle) * moveSpeed; dy += Math.sin(player.angle) * moveSpeed; }
  if (keys.has('s') || keys.has('arrowdown')) { dx -= Math.cos(player.angle) * moveSpeed; dy -= Math.sin(player.angle) * moveSpeed; }
  if (keys.has('a') || keys.has('arrowleft')) { dx += Math.cos(player.angle - Math.PI / 2) * moveSpeed; dy += Math.sin(player.angle - Math.PI / 2) * moveSpeed; }
  if (keys.has('d') || keys.has('arrowright')) { dx += Math.cos(player.angle + Math.PI / 2) * moveSpeed; dy += Math.sin(player.angle + Math.PI / 2) * moveSpeed; }
  if (!isBlocked(player.x + dx, player.y)) player.x += dx;
  if (!isBlocked(player.x, player.y + dy)) player.y += dy;

  bullets.forEach((bullet) => {
    bullet.x += Math.cos(bullet.angle) * bullet.speed * dt;
    bullet.y += Math.sin(bullet.angle) * bullet.speed * dt;
    bullet.life -= dt;
  });
  bullets = bullets.filter((bullet) => bullet.life > 0 && !isBlocked(bullet.x, bullet.y));

  const boss = bosses[activeBossIndex];
  if (boss && !boss.defeated) {
    const dist = Math.hypot(boss.x - player.x, boss.y - player.y);
    if (dist < 520) player.health -= dt * 0.0028 * (activeBossIndex + 1);
    bullets.forEach((bullet) => {
      if (!bullet.hit && Math.hypot(boss.x - bullet.x, boss.y - bullet.y) < 42) {
        bullet.hit = true;
        bullet.life = 0;
        boss.currentHp -= 9 * selectedHero.accuracy;
        score += 0.35;
        burst(boss.x, boss.y, boss.color, 12);
        if (boss.currentHp <= boss.hp * 0.58 && !boss.quiz1) openQuiz(boss, 'Series A benchmark gate');
        if (boss.currentHp <= boss.hp * 0.24 && !boss.quiz2) openQuiz(boss, 'Series B benchmark gate');
        if (boss.currentHp <= 0) defeatBoss();
      }
    });
  }

  particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
  particles = particles.filter((p) => p.life > 0);

  if (player.health <= 0) endGame(false);
  updateHud();
}

function shoot() {
  if (!running || pausedForQuiz || player.cooldown > 0) return;
  if (player.ammo <= 0) {
    player.ammo = 30;
    hud.toast.textContent = 'Reloaded with fresh investor enthusiasm.';
    player.cooldown = 450;
    return;
  }
  player.ammo -= 1;
  player.cooldown = 115;
  bullets.push({ x: player.x, y: player.y, angle: player.angle + (Math.random() - 0.5) * 0.035 / selectedHero.accuracy, speed: 0.95, life: 900 });
  burst(player.x + Math.cos(player.angle) * 25, player.y + Math.sin(player.angle) * 25, selectedHero.accent, 5);
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    particles.push({ x, y, color, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, life: 350 + Math.random() * 350 });
  }
}

function openQuiz(boss, title) {
  pausedForQuiz = true;
  if (!boss.quiz1) boss.quiz1 = true; else boss.quiz2 = true;
  const question = quizBank[activeQuestion % quizBank.length];
  activeQuestion += 1;
  quizEls.benchmark.textContent = question.benchmark;
  quizEls.title.textContent = `${title}: ${boss.name}`;
  quizEls.prompt.textContent = question.prompt;
  quizEls.feedback.textContent = '';
  quizEls.answers.innerHTML = '';
  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener('click', () => resolveQuiz(question, index));
    quizEls.answers.appendChild(button);
  });
  quizModal.classList.remove('hidden');
}

function resolveQuiz(question, index) {
  const boss = bosses[activeBossIndex];
  const correct = index === question.correct;
  quizEls.feedback.textContent = correct ? `Correct. ${question.explain}` : `Not quite. ${question.explain}`;
  if (correct) {
    score += 18 + activeBossIndex * 4;
    boss.currentHp -= 32;
    burst(boss.x, boss.y, '#9dff72', 35);
  } else {
    player.health -= 14;
    boss.currentHp += 12;
    score = Math.max(0, score - 8);
    burst(player.x, player.y, '#ff5b6e', 25);
  }
  setTimeout(() => {
    quizModal.classList.add('hidden');
    pausedForQuiz = false;
    if (boss.currentHp <= 0) defeatBoss();
  }, 1800);
}

function defeatBoss() {
  const boss = bosses[activeBossIndex];
  if (!boss || boss.defeated) return;
  boss.defeated = true;
  score += 42 + activeBossIndex * 12;
  hud.toast.textContent = `${boss.name} got benchmarked into a footnote.`;
  activeBossIndex += 1;
  if (activeBossIndex >= bosses.length) endGame(true);
  else setTimeout(() => { hud.toast.textContent = `${bosses[activeBossIndex].name}: ${bosses[activeBossIndex].taunt}`; }, 900);
}

function endGame(won) {
  running = false;
  gameShell.classList.add('hidden');
  victory.classList.remove('hidden');
  if (won) {
    joeUnlocked = true;
    localStorage.setItem('exitValueJoeUnlocked', 'true');
    document.getElementById('victoryTitle').textContent = 'Exit acquired. Joe Rogun unlocked.';
    document.getElementById('victoryText').textContent = `Final exit value: $${score.toFixed(1)}B. The bosses asked for a rematch, but your cap table has already gone supernova.`;
  } else {
    document.getElementById('victoryTitle').textContent = 'Runway exhausted.';
    document.getElementById('victoryText').textContent = `Final exit value: $${score.toFixed(1)}B. The board recommends more unit tests and fewer flamethrower demos.`;
  }
  renderHeroCards();
}

function castRays() {
  const rays = 180;
  const fov = Math.PI / 3;
  const strip = canvas.width / rays;
  for (let i = 0; i < rays; i += 1) {
    const angle = player.angle - fov / 2 + (i / rays) * fov;
    let depth = 0;
    let hit = false;
    while (!hit && depth < 900) {
      depth += 6;
      const x = player.x + Math.cos(angle) * depth;
      const y = player.y + Math.sin(angle) * depth;
      hit = isBlocked(x, y);
    }
    const corrected = depth * Math.cos(angle - player.angle);
    const height = Math.min(canvas.height, 42000 / Math.max(1, corrected));
    const shade = Math.max(18, 210 - corrected * 0.18);
    ctx.fillStyle = `rgb(${shade * .35}, ${shade * .55}, ${shade})`;
    ctx.fillRect(i * strip, (canvas.height - height) / 2, strip + 1, height);
    if (i % 9 === 0) {
      ctx.fillStyle = `rgba(83,245,255,${Math.max(0, .3 - corrected / 2200)})`;
      ctx.fillRect(i * strip, (canvas.height - height) / 2, 2, height);
    }
  }
}

function drawSprite(entity, size, label, color) {
  const dx = entity.x - player.x;
  const dy = entity.y - player.y;
  const distance = Math.hypot(dx, dy);
  const angleTo = Math.atan2(dy, dx);
  let relative = angleTo - player.angle;
  while (relative > Math.PI) relative -= Math.PI * 2;
  while (relative < -Math.PI) relative += Math.PI * 2;
  if (Math.abs(relative) > Math.PI / 2) return;
  const screenX = canvas.width / 2 + Math.tan(relative) * canvas.width;
  const spriteSize = Math.max(24, size * 720 / distance);
  const y = canvas.height / 2 - spriteSize / 2;
  const gradient = ctx.createRadialGradient(screenX, y + spriteSize / 2, spriteSize * .1, screenX, y + spriteSize / 2, spriteSize * .75);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.arc(screenX, y + spriteSize / 2, spriteSize * .78, 0, Math.PI * 2); ctx.fill();
  ctx.font = `${Math.max(22, spriteSize * .45)}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(entity.emoji || '◆', screenX, y + spriteSize * .62);
  ctx.font = `800 ${Math.max(12, spriteSize * .08)}px sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.fillText(label, screenX, y - 8);
}

function render() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#070914'); sky.addColorStop(.48, '#17255a'); sky.addColorStop(.5, '#12091d'); sky.addColorStop(1, '#050510');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.globalAlpha = .35;
  for (let y = canvas.height / 2; y < canvas.height; y += 24) {
    ctx.strokeStyle = `rgba(255,79,216,${(y - canvas.height / 2) / canvas.height})`;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  ctx.restore();

  castRays();
  bosses.forEach((boss, index) => { if (!boss.defeated && index >= activeBossIndex) drawSprite(boss, 92 + index * 10, boss.name, boss.color); });
  bullets.forEach((bullet) => drawSprite({ ...bullet, emoji: '✦' }, 26, '', selectedHero.accent));
  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life / 700);
    drawSprite({ ...p, emoji: '•' }, 14, '', p.color);
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = 'rgba(255,255,255,.74)';
  ctx.font = '900 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(selectedHero.weapon, canvas.width / 2, canvas.height - 38);
}

function loop(now) {
  const dt = Math.min(32, now - lastTime);
  lastTime = now;
  update(dt);
  render();
  if (running) requestAnimationFrame(loop);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('keydown', (event) => {
  keys?.add(event.key.toLowerCase());
  if (event.code === 'Space') shoot();
});
window.addEventListener('keyup', (event) => keys?.delete(event.key.toLowerCase()));
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('click', () => { canvas.requestPointerLock?.(); shoot(); });
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === canvas && running && !pausedForQuiz) player.angle += event.movementX * 0.0024;
});
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('againButton').addEventListener('click', () => { victory.classList.add('hidden'); menu.classList.remove('hidden'); });
howButton.addEventListener('click', () => { howTo.open = !howTo.open; });

renderHeroCards();
resizeCanvas();
