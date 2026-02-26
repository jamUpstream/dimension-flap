// ══════════════════════════════════════════════════════════
// INTRO ANIMATION
// ══════════════════════════════════════════════════════════
(function runIntro() {
  const overlay   = document.getElementById("introOverlay");
  const iCanvas   = document.getElementById("introCanvas");
  const bootEl    = document.getElementById("introBootLines");
  const logoWrap  = document.getElementById("introLogoWrap");
  const itl1      = document.getElementById("itl1");
  const itl2      = document.getElementById("itl2");
  const taglineEl = document.getElementById("introTagline");
  const phoneFrame = document.querySelector(".phone-frame");

  phoneFrame.classList.add("intro-hidden");

  const ictx = iCanvas.getContext("2d");
  let particles = [];
  let raf;

  function resizeIntroCanvas() {
    iCanvas.width  = window.innerWidth;
    iCanvas.height = window.innerHeight;
  }
  resizeIntroCanvas();
  window.addEventListener("resize", resizeIntroCanvas);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      size: 1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.35,
      col: Math.random() > 0.5 ? "#00ffcc" : "#cc00ff",
    });
  }

  function tickParticles() {
    ictx.clearRect(0, 0, iCanvas.width, iCanvas.height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4) { p.y = iCanvas.height + 4; p.x = Math.random() * iCanvas.width; }
      ictx.globalAlpha = p.alpha;
      ictx.fillStyle = p.col;
      ictx.beginPath();
      ictx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ictx.fill();
    }
    ictx.globalAlpha = 1;
    raf = requestAnimationFrame(tickParticles);
  }
  tickParticles();

  const scanBar = document.createElement("div");
  scanBar.className = "intro-scanbar";
  overlay.appendChild(scanBar);

  const BOOT_LINES = [
    "> INITIALIZING VOID ENGINE v4.2.1...",
    "> LOADING DIMENSION MATRICES... OK",
    "> CALIBRATING GRAVITY CONSTANTS... OK",
    "> SYNCING PARALLEL TIMELINES... OK",
    "> DIMENSIONAL RIFT STABLE",
    "> ALL SYSTEMS NOMINAL — ENTERING VOID",
  ];

  let done = false;

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    overlay.classList.add("done");
    phoneFrame.classList.remove("intro-hidden");
    phoneFrame.classList.add("intro-visible");
    setTimeout(() => {
      overlay.remove();
      window.removeEventListener("resize", resizeIntroCanvas);
    }, 900);
  }

  function skipHandler(e) {
    if (e.type === "keydown" && e.code !== "Space") return;
    overlay.removeEventListener("click", skipHandler);
    overlay.removeEventListener("touchstart", skipHandler);
    document.removeEventListener("keydown", skipHandler);
    finish();
  }
  overlay.addEventListener("click", skipHandler);
  overlay.addEventListener("touchstart", skipHandler, { passive: true });
  document.addEventListener("keydown", skipHandler);

  let lineIdx = 0;

  function addBootLine() {
    if (lineIdx >= BOOT_LINES.length) {
      setTimeout(showLogo, 120);
      return;
    }
    const div = document.createElement("div");
    div.className = "intro-boot-line";
    div.textContent = BOOT_LINES[lineIdx];
    bootEl.appendChild(div);
    lineIdx++;
    const delay = lineIdx >= BOOT_LINES.length - 1 ? 520 : 220;
    setTimeout(addBootLine, delay);
  }

  function showLogo() {
    logoWrap.classList.add("visible");
    setTimeout(() => {
      itl1.classList.add("reveal");
      setTimeout(() => itl1.classList.add("glitch"), 600);
    }, 80);
    setTimeout(() => {
      itl2.classList.add("reveal");
      setTimeout(() => itl2.classList.add("glitch"), 600);
    }, 400);
    setTimeout(() => taglineEl.classList.add("visible"), 900);
    setTimeout(finish, 2600);
  }

  setTimeout(addBootLine, 300);
})();



const SUPABASE_URL = 'https://zuukqwhpuvqhomfvyzfu.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dWtxd2hwdXZxaG9tZnZ5emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzUwMjksImV4cCI6MjA4NzQxMTAyOX0.NON1QYVhhhQNLCFhIMLPpX6hIwzz3qGTSamunp2XdpY';
const SCORES_TABLE = 'dimension-flap_scores';

// Thin Supabase REST helper (no SDK needed)
const sb = {
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON,
    'Authorization': 'Bearer ' + SUPABASE_ANON,
  },
  async insert(row) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SCORES_TABLE}`, {
      method: 'POST',
      headers: { ...this.headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify(row),
    });
    return res.ok;
  },
  async topScores(limit = 15) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${SCORES_TABLE}?select=name,score,max_dimension&order=score.desc&limit=${limit}`,
      { headers: this.headers }
    );
    if (!res.ok) return null;
    return res.json();
  },
};

// ══════════════════════════════════════════════════════════
// CANVAS & DOM
// ══════════════════════════════════════════════════════════
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameArea = document.getElementById('gameArea');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const hud = document.getElementById('hud');
const scoreDisplay = document.getElementById('scoreDisplay');
const dimDisplay = document.getElementById('dimDisplay');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');
const dimBanner = document.getElementById('dimBanner');
const dimBannerText = document.getElementById('dimBannerText');
const playerNameInput = document.getElementById('playerNameInput');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const saveStatus = document.getElementById('saveStatus');
const lbList = document.getElementById('lbList');

const optionsScreen = document.getElementById('optionsScreen');
const sfxToggleBtn = document.getElementById('sfxToggle');
const lowSpecToggleBtn = document.getElementById('lowSpecToggle');
const hellToggleBtn = document.getElementById('hellToggle');

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('leaderboardBtn').addEventListener('click', openLeaderboard);
document.getElementById('lbCloseBtn').addEventListener('click', closeLeaderboard);
saveScoreBtn.addEventListener('click', handleSaveScore);
document.getElementById('optionsBtn').addEventListener('click', openOptions);
document.getElementById('optionsCloseBtn').addEventListener('click', closeOptions);
document.getElementById('goMenuBtn').addEventListener('click', goToMenu);
sfxToggleBtn.addEventListener('click', () => toggleOption('sfx'));
lowSpecToggleBtn.addEventListener('click', () => toggleOption('lowSpec'));
hellToggleBtn.addEventListener('click', () => toggleOption('hell'));

// ── Button SFX — delegated so every .btn and .toggle-btn is covered ──
const PRIMARY_IDS = new Set(['startBtn', 'restartBtn', 'saveScoreBtn']);

document.addEventListener('pointerover', e => {
  const btn = e.target.closest('.btn, .toggle-btn');
  if (!btn || btn.disabled) return;
  SFX.btnHover();
}, { passive: true });

document.addEventListener('click', e => {
  const btn = e.target.closest('.btn, .toggle-btn');
  if (!btn || btn.disabled) return;
  if (PRIMARY_IDS.has(btn.id)) {
    SFX.btnClickPrimary();
  } else {
    SFX.btnClick();
  }
}, { passive: true, capture: true });

// ══════════════════════════════════════════════════════════
// CHEAT CODE — type "jamwassogreat" on start/lobby screen
// ══════════════════════════════════════════════════════════
let cheatNoclip = false;
let cheatBuffer = '';
const CHEAT_CODE = 'jamwassogreat';

function showToast(msg, color = '#00ffcc') {
  const existing = document.getElementById('cheatToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'cheatToast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(5,5,14,0.97);
    color: ${color};
    border: 1px solid ${color};
    box-shadow: 0 0 18px ${color}55;
    font-family: 'Black Ops One', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 2px;
    padding: 10px 20px;
    z-index: 9999;
    pointer-events: none;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.4s ease;
  `;
  document.body.appendChild(toast);
  // Fade out after 2.5s
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

document.addEventListener('keydown', e => {
  // Only listen for cheat when on start/lobby screen (not mid-game typing)
  const onLobby = startScreen.classList.contains('active') ||
    leaderboardScreen.classList.contains('active');
  if (!onLobby) { cheatBuffer = ''; return; }
  // Ignore modifier keys and non-character keys
  if (e.key.length !== 1) { cheatBuffer = ''; return; }
  cheatBuffer += e.key.toLowerCase();
  // Trim buffer to code length
  if (cheatBuffer.length > CHEAT_CODE.length)
    cheatBuffer = cheatBuffer.slice(-CHEAT_CODE.length);
  if (cheatBuffer === CHEAT_CODE) {
    cheatBuffer = '';
    cheatNoclip = !cheatNoclip;
    if (cheatNoclip) {
      showToast('⚡ NOCLIP ACTIVATED', '#ff3c78');
    } else {
      showToast('NOCLIP DEACTIVATED', '#888888');
    }
  }
});

// ══════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════
const BASE_GRAVITY = 0.30;   // slightly punchier gravity
const BASE_FLAP = -6.8;   // snappier upward kick
const MAX_FALL_SPEED = 15;      // allow slightly faster falling
const BASE_SPEED = 2.4;    // faster scroll speed
const PIPE_WIDTH = 52;
const MIN_GAP = 80;    // generous pipe gap
const PIPE_SPAWN_DIST = 170;    // spacing between pipes
const PIPE_START_DELAY = 200;    // ~3.3s grace period before pipes
const SCORE_PER_DIM = 50; // score needed to advance to next dimension
const BIRD_W = 32;
const BIRD_H = 26;
const GROUND_H = 50;

// ══════════════════════════════════════════════════════════
// SFX  — Web Audio API, zero assets needed
// ══════════════════════════════════════════════════════════
const SFX = (() => {
  let ctx;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Generic synth helper
  function play({ type = 'square', freq, freqEnd, dur, vol = 0.18, attack = 0.005, decay = 0, sustain = 1, release, detune = 0, filter, filterEnd }) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      const now = c.currentTime;
      const totalRelease = release ?? dur * 0.4;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (freqEnd !== undefined) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
      if (detune) osc.detune.setValueAtTime(detune, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + attack);
      if (decay > 0) gain.gain.linearRampToValueAtTime(vol * sustain, now + attack + decay);
      gain.gain.setValueAtTime(vol * sustain, now + dur - totalRelease);
      gain.gain.linearRampToValueAtTime(0, now + dur);

      if (filter) {
        const bq = c.createBiquadFilter();
        bq.type = filter;
        bq.frequency.setValueAtTime(filterEnd ?? 2000, now);
        if (filterEnd) bq.frequency.exponentialRampToValueAtTime(filterEnd, now + dur);
        osc.connect(bq); bq.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch (e) { /* silently ignore if audio not available */ }
  }

  // Noise burst for explosions
  function playNoise({ dur = 0.15, vol = 0.12, filter = 'bandpass', filterFreq = 400 }) {
    try {
      const c = getCtx();
      const bufSize = c.sampleRate * dur;
      const buf = c.createBuffer(1, bufSize, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const bq = c.createBiquadFilter();
      bq.type = filter;
      bq.frequency.setValueAtTime(filterFreq, c.currentTime);
      const gain = c.createGain();
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + dur);
      src.connect(bq); bq.connect(gain); gain.connect(c.destination);
      src.start(); src.stop(c.currentTime + dur);
    } catch (e) { }
  }

  return {
    flap() {
      if (sfxMuted) return;
      // Short airy whoosh — sine sweep up
      play({ type: 'sine', freq: 280, freqEnd: 520, dur: 0.12, vol: 0.14, attack: 0.003 });
      play({ type: 'triangle', freq: 180, freqEnd: 360, dur: 0.1, vol: 0.07, attack: 0.003 });
    },
    score() {
      if (sfxMuted) return;
      // Quick upward blip
      play({ type: 'square', freq: 660, freqEnd: 880, dur: 0.1, vol: 0.12, attack: 0.003 });
    },
    die() {
      if (sfxMuted) return;
      // Low crunch + noise burst
      play({ type: 'sawtooth', freq: 220, freqEnd: 55, dur: 0.4, vol: 0.22, attack: 0.005 });
      play({ type: 'square', freq: 110, freqEnd: 40, dur: 0.5, vol: 0.15, attack: 0.005 });
      playNoise({ dur: 0.25, vol: 0.18, filterFreq: 600 });
    },
    dimShift() {
      if (sfxMuted) return;
      // Sci-fi arpeggio sweep
      const notes = [330, 440, 550, 660, 880];
      notes.forEach((f, i) => {
        setTimeout(() => play({ type: 'square', freq: f, freqEnd: f * 1.05, dur: 0.12, vol: 0.13, attack: 0.005 }), i * 55);
      });
      play({ type: 'sine', freq: 110, freqEnd: 440, dur: 0.35, vol: 0.09, attack: 0.01 });
    },
    countdown(n) {
      if (sfxMuted) return;
      // Tick for 3/2/1, higher + longer for GO
      if (n === 0) {
        play({ type: 'square', freq: 880, freqEnd: 1100, dur: 0.22, vol: 0.16, attack: 0.003 });
        play({ type: 'sine', freq: 660, freqEnd: 880, dur: 0.22, vol: 0.10, attack: 0.003 });
      } else {
        play({ type: 'square', freq: 440, dur: 0.09, vol: 0.13, attack: 0.003 });
      }
    },
    // ── UI button sounds ──────────────────────────────────
    btnHover() {
      if (sfxMuted) return;
      // Subtle high tick — quiet sine blip
      play({ type: 'sine', freq: 880, freqEnd: 1020, dur: 0.055, vol: 0.06, attack: 0.002 });
    },
    btnClick() {
      if (sfxMuted) return;
      // Snappy two-tone confirm: low thud + bright ping
      play({ type: 'square', freq: 220, freqEnd: 180, dur: 0.07, vol: 0.13, attack: 0.002 });
      play({ type: 'sine',   freq: 660, freqEnd: 880, dur: 0.12, vol: 0.11, attack: 0.002 });
    },
    btnClickPrimary() {
      if (sfxMuted) return;
      // Punchier version for primary actions (ENTER VOID, RETRY, SAVE)
      play({ type: 'square',   freq: 330, freqEnd: 220, dur: 0.08,  vol: 0.15, attack: 0.002 });
      play({ type: 'sine',     freq: 880, freqEnd: 1320, dur: 0.18, vol: 0.13, attack: 0.003 });
      play({ type: 'triangle', freq: 440, freqEnd: 660,  dur: 0.14, vol: 0.08, attack: 0.004 });
    },
  };
})();

// ══════════════════════════════════════════════════════════
// DIMENSIONS
// ══════════════════════════════════════════════════════════
const DIMENSIONS = [
  {
    id: 1, name: "NORMAL",
    bgTop: "#0d0d2b", bgBot: "#1a1a3a",
    pipeColor: "#00ffcc", pipeGlow: "#00ffcc", groundColor: "#1a3a2a", accentColor: "#00ffcc",
    gravMult: 1.0, speedMult: 0.88, gapMod: 20, pipesMove: false, invertGravity: false, glitch: false
  },
  {
    id: 2, name: "OVERDRIVE",
    bgTop: "#1a0d00", bgBot: "#3a1a00",
    pipeColor: "#ff8c00", pipeGlow: "#ff8c00", groundColor: "#3a1a00", accentColor: "#ff8c00",
    gravMult: 1.05, speedMult: 1.1, gapMod: 10, pipesMove: false, invertGravity: false, glitch: false
  },
  {
    id: 3, name: "WARP",
    bgTop: "#0d001a", bgBot: "#1a0033",
    pipeColor: "#cc00ff", pipeGlow: "#cc00ff", groundColor: "#1a0033", accentColor: "#cc00ff",
    gravMult: 0.9, speedMult: 1.15, gapMod: 25,
    pipesMove: true, pipeMoveAmp: 18, pipeMoveSpeed: 0.008, invertGravity: false, glitch: false
  },
  {
    id: 4, name: "VOID",
    bgTop: "#000000", bgBot: "#0a0010",
    pipeColor: "#ff3c78", pipeGlow: "#ff3c78", groundColor: "#0a000a", accentColor: "#ff3c78",
    gravMult: 1.1, speedMult: 1.3, gapMod: 5,
    pipesMove: true, pipeMoveAmp: 35, pipeMoveSpeed: 0.018, invertGravity: false, glitch: true
  },
  {
    id: 5, name: "INVERSION",
    bgTop: "#001a1a", bgBot: "#003333",
    pipeColor: "#00ffff", pipeGlow: "#00ffff", groundColor: "#003333", accentColor: "#00ffff",
    gravMult: -1.0, speedMult: 1.15, gapMod: 30,
    pipesMove: true, pipeMoveAmp: 18, pipeMoveSpeed: 0.012, invertGravity: true, glitch: false
  },
  {
    id: 6, name: "CHAOS",
    bgTop: "#1a0a00", bgBot: "#0a001a",
    pipeColor: "#ffff00", pipeGlow: "#ffff00", groundColor: "#1a1a00", accentColor: "#ffff00",
    gravMult: 1.2, speedMult: 1.5, gapMod: -5,
    pipesMove: true, pipeMoveAmp: 55, pipeMoveSpeed: 0.025, invertGravity: false, glitch: true
  },
  {
    id: 7, name: "PHANTOM",
    bgTop: "#0a0a0a", bgBot: "#141414",
    pipeColor: "#999999", pipeGlow: "#ffffff", groundColor: "#111111", accentColor: "#cccccc",
    gravMult: 1.1, speedMult: 1.35, gapMod: 10,
    pipesMove: false, invertGravity: false, glitch: false
  },
  {
    id: 8, name: "NEON STORM",
    bgTop: "#00001a", bgBot: "#001a00",
    pipeColor: "#ff00ff", pipeGlow: "#ff00ff", groundColor: "#0a000a", accentColor: "#ff00ff",
    gravMult: 1.15, speedMult: 1.6, gapMod: -8,
    pipesMove: true, pipeMoveAmp: 45, pipeMoveSpeed: 0.028, invertGravity: false, glitch: true
  },
  {
    id: 9, name: "ABYSS",
    bgTop: "#000000", bgBot: "#000000",
    pipeColor: "#003a80", pipeGlow: "#0066ff", groundColor: "#000510", accentColor: "#0077ff",
    gravMult: 1.2, speedMult: 1.7, gapMod: -10,
    pipesMove: true, pipeMoveAmp: 38, pipeMoveSpeed: 0.02, invertGravity: false, glitch: false
  },
  {
    id: 10, name: "OBLIVION",
    bgTop: "#0a0000", bgBot: "#1a0000",
    pipeColor: "#ff2200", pipeGlow: "#ff4400", groundColor: "#0f0000", accentColor: "#ff3300",
    gravMult: 1.3, speedMult: 1.9, gapMod: -18,
    pipesMove: true, pipeMoveAmp: 75, pipeMoveSpeed: 0.04, invertGravity: false, glitch: true
  },
];

// ══════════════════════════════════════════════════════════
// HELL DIMENSION
// ══════════════════════════════════════════════════════════
const HELL_DIM = {
  id: "hell", name: "HELL",
  bgTop: "#0d0000", bgBot: "#1a0000",
  pipeColor: "#ff1a00", pipeGlow: "#ff4400", groundColor: "#0f0000", accentColor: "#ff3c14",
  gravMult: 1.45, speedMult: 2.1, gapMod: -28,
  pipesMove: true, pipeMoveAmp: 60, pipeMoveSpeed: 0.035,
  invertGravity: false, glitch: true,
};
const HELL_PIPE_SPAWN_DIST = 130;
const HELL_MIN_GAP = 82;
const HELL_PIPE_START_DELAY = 0;

// ══════════════════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════════════════
let state = {};
let animFrame;
let bestScore = 0;
let glitchTimer = 0;
let scoreSaved = false;  // track if score was already saved this round
let sfxMuted = false;  // Options: SFX toggle
let lowSpec = false;  // Options: low-spec mode (no glow / shadows)
let hellMode = false;  // Options: Hell Mode

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════
// Low-spec helper: skip expensive shadow when lowSpec mode is on
function applyShadow(context, blur, color) {
  if (lowSpec) { context.shadowBlur = 0; return; }
  context.shadowBlur = blur;
  context.shadowColor = color;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function shadeColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// ══════════════════════════════════════════════════════════
// DRAW: BIRD
// ══════════════════════════════════════════════════════════
function drawBird(x, y, wingPhase, dim) {
  const w = BIRD_W, h = BIRD_H;
  const cx = x + w / 2, cy = y + h / 2;
  ctx.save();

  // Tilt based on vertical velocity: nose up on flap, nose down when falling
  const maxTilt = Math.PI * 0.38;   // ~68° max downward tilt
  const riseAngle = -Math.PI * 0.18; // ~-32° nose-up kick on flap
  let tilt = 0;
  if (state.hasFlapped) {
    // Map velY: negative (rising) → riseAngle, positive (falling) → maxTilt
    tilt = Math.max(riseAngle, Math.min(maxTilt, state.velY * 0.09));
  }
  if (state.invertGravity) tilt = -tilt;

  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  if (state.invertGravity) ctx.scale(1, -1);
  ctx.translate(-cx, -cy);
  const wingDrop = Math.sin(wingPhase) * 5;
  applyShadow(ctx, 10, dim.accentColor);
  ctx.fillStyle = dim.accentColor;
  roundRect(ctx, x + 4, y + 5, w - 8, h - 9, 4); ctx.fill();
  ctx.fillStyle = shadeColor(dim.accentColor, -40);
  roundRect(ctx, x - 5, cy - 4 + wingDrop, 12, 9, 3); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0a0a12'; ctx.fillRect(x + w - 14, y + 7, 7, 6);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x + w - 13, y + 8, 3, 3);
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.moveTo(x + w - 3, cy - 1); ctx.lineTo(x + w + 7, cy + 1); ctx.lineTo(x + w - 3, cy + 4);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ══════════════════════════════════════════════════════════
// DRAW: BURST / POP EXPLOSION
// ══════════════════════════════════════════════════════════
function drawPop(pop) {
  const t = pop.frame / pop.maxFrames;
  const cx = pop.x;
  const cy = pop.y;

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // Radial flash bloom on first 3 frames — no hard rectangular edges
  if (pop.frame < 3) {
    const flashAlpha = 1 - (pop.frame / 3) * 0.7;
    const flashRadius = BIRD_W * 2 + pop.frame * 8;
    const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashRadius);
    flashGrad.addColorStop(0, `rgba(255,255,255,${flashAlpha})`);
    flashGrad.addColorStop(0.4, `rgba(255,255,255,${flashAlpha * 0.5})`);
    flashGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = flashGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, flashRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Shockwave ring
  ctx.globalAlpha = Math.max(0, 1 - t * 2);
  ctx.beginPath();
  ctx.arc(cx, cy, t * 80, 0, Math.PI * 2);
  ctx.strokeStyle = pop.color;
  ctx.shadowColor = pop.color;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 3 * (1 - t);
  ctx.stroke();

  // Pixel shards
  ctx.shadowBlur = 3;
  for (let i = 0; i < pop.particles.length; i++) {
    const p = pop.particles[i];
    if (t < p.delay) continue;
    const pt = (t - p.delay) / (1 - p.delay);
    const eased = 1 - Math.pow(1 - Math.min(pt, 1), 2);
    const px = cx + p.vx * eased;
    const groundY = canvas.height - GROUND_H;
    const rawPy = cy + p.vy * eased + p.g * eased * eased;
    const py = Math.min(rawPy, groundY - 2); // clamp above ground
    const sz = Math.max(1, p.size * (1 - pt * 0.9));
    // Fade faster once particle would have gone underground
    const hitGround = rawPy >= groundY - 2;
    const alpha = hitGround ? 0 : Math.max(0, 1 - pt);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.col;
    ctx.shadowColor = p.col;
    ctx.fillRect(Math.round(px - sz * 0.5), Math.round(py - sz * 0.5), Math.ceil(sz), Math.ceil(sz));
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.restore();
}

// ══════════════════════════════════════════════════════════
// DRAW: PIPE
// ══════════════════════════════════════════════════════════
function drawPipe(x, y, w, h, isTop, dim) {
  if (h <= 0) return;
  const capH = 16, capW = w + 10;
  ctx.save();
  applyShadow(ctx, 16, dim.pipeGlow);
  const grad = ctx.createLinearGradient(x, 0, x + w, 0);
  grad.addColorStop(0, shadeColor(dim.pipeColor, -60));
  grad.addColorStop(0.3, dim.pipeColor);
  grad.addColorStop(1, shadeColor(dim.pipeColor, -40));
  ctx.fillStyle = grad; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = shadeColor(dim.pipeColor, 20);
  ctx.fillRect(x - (capW - w) / 2, isTop ? y + h - capH : y, capW, capH);
  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(x + 5, y, 5, h);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1;
  for (let py = y; py < y + h; py += 14) {
    ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + w, py); ctx.stroke();
  }
  ctx.restore();
}

// ══════════════════════════════════════════════════════════
// DRAW: BACKGROUND
// ══════════════════════════════════════════════════════════
function drawBackground(dim) {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height - GROUND_H);
  grad.addColorStop(0, dim.bgTop); grad.addColorStop(1, dim.bgBot);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawStars(dim);
  if (!lowSpec && dim.glitch && glitchTimer > 0) {
    ctx.fillStyle = 'rgba(255,255,255,' + (0.04 + Math.random() * 0.04) + ')';
    ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 2 + Math.random() * 3);
  }
}

function drawStars(dim) {
  ctx.save();
  for (const s of state.stars) {
    s.x -= s.speed * (state.speed / BASE_SPEED) * 0.25;
    if (s.x < 0) { s.x = canvas.width; s.y = Math.random() * (canvas.height - GROUND_H); }
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = dim.accentColor;
    ctx.shadowColor = dim.accentColor;
    ctx.shadowBlur = (lowSpec || !s.big) ? 0 : 5;
    ctx.fillRect(Math.round(s.x), Math.round(s.y), s.big ? 2 : 1, s.big ? 2 : 1);
  }
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.restore();
}

// ══════════════════════════════════════════════════════════
// DRAW: GROUND
// ══════════════════════════════════════════════════════════
function drawGround(dim) {
  const gy = canvas.height - GROUND_H;
  ctx.fillStyle = dim.groundColor; ctx.fillRect(0, gy, canvas.width, GROUND_H);
  ctx.strokeStyle = dim.pipeColor; ctx.lineWidth = 2;
  applyShadow(ctx, 8, dim.pipeGlow);
  ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = shadeColor(dim.groundColor, 12);
  const bw = 44, offset = state.groundOffset % bw;
  for (let bx = -bw + offset; bx < canvas.width + bw; bx += bw)
    ctx.fillRect(Math.round(bx), gy + 3, bw - 2, 9);
}

// ══════════════════════════════════════════════════════════
// PIPE HELPERS
// ══════════════════════════════════════════════════════════
function getPipeMoveOffset(p) {
  if (!state.dim.pipesMove) return 0;
  const usableH = canvas.height - GROUND_H;
  const raw = Math.sin(p.movePhase) * state.dim.pipeMoveAmp;
  // Clamp: top pipe can never go above y=0, bottom pipe can never go below ground
  const minOff = 0;
  const maxOff = usableH - p.topH - p.gap;
  return Math.max(minOff, Math.min(maxOff, raw));
}

function spawnPipe() {
  const _activeMinGap = hellMode ? HELL_MIN_GAP : MIN_GAP;
  const gap = Math.max(_activeMinGap, _activeMinGap + Math.max(0, 50 - state.score * 1.2) + state.dim.gapMod);
  const usableH = canvas.height - GROUND_H;
  const minTopH = 55, maxTopH = usableH - gap - 55;

  // Limit vertical jump from the last pipe so consecutive pipes are never impossible
  const MAX_STEP = (maxTopH - minTopH) * 0.38; // max 38% of full range per pipe
  const lastPipe = state.pipes[state.pipes.length - 1];
  let lo = minTopH, hi = maxTopH;
  if (lastPipe) {
    lo = Math.max(minTopH, lastPipe.topH - MAX_STEP);
    hi = Math.min(maxTopH, lastPipe.topH + MAX_STEP);
  }

  const topH = lo + Math.random() * (hi - lo);
  state.pipes.push({ x: canvas.width + PIPE_WIDTH, topH, gap, movePhase: Math.random() * Math.PI * 2, counted: false });
}

// ══════════════════════════════════════════════════════════
// INPUT
// ══════════════════════════════════════════════════════════
function onFlap() {
  if (!state.running) return;
  // Block input during the countdown (respects hellMode grace period = 0)
  const _flapDelay = hellMode ? HELL_PIPE_START_DELAY : PIPE_START_DELAY;
  if (_flapDelay > 0 && state.frameCount < _flapDelay) return;
  state.hasFlapped = true;
  state.velY = state.invertGravity ? Math.abs(BASE_FLAP) : BASE_FLAP;
  state.wingPhase = 0;
  SFX.flap();
}

document.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); onFlap(); } });
let _lastCanvasTouchTime = 0;
canvas.addEventListener('click', e => {
  // Suppress synthetic click fired by browser after touchstart (within 500ms)
  if (Date.now() - _lastCanvasTouchTime < 500) return;
  onFlap();
});
canvas.addEventListener('touchstart', e => { e.preventDefault(); _lastCanvasTouchTime = Date.now(); onFlap(); }, { passive: false });

// ── Tablet / desktop: also respond to taps/clicks OUTSIDE the phone frame
// Track last touch time to prevent the browser's synthetic click from double-firing
let _lastOutsideTouchTime = 0;

document.addEventListener('touchstart', e => {
  // Only fire if the touch didn't originate inside the game area (canvas already handles those)
  // and is not on a button or input element
  const target = e.target;
  if (target === canvas) return; // already handled above
  if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'LABEL') return;
  _lastOutsideTouchTime = Date.now();
  onFlap();
}, { passive: true });

document.addEventListener('click', e => {
  const target = e.target;
  if (target === canvas) return; // already handled above
  if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'LABEL') return;
  // Only fire if the click was outside the game-area (i.e. on the tablet background)
  if (gameArea.contains(target)) return;
  // Suppress synthetic click fired by browser after touchstart (within 500ms)
  if (Date.now() - _lastOutsideTouchTime < 500) return;
  onFlap();
});

// ══════════════════════════════════════════════════════════
// CANVAS RESIZE
// ══════════════════════════════════════════════════════════
function resizeCanvas() {
  const rect = gameArea.getBoundingClientRect();
  canvas.width = rect.width || 390;
  canvas.height = rect.height || 620;
}
window.addEventListener('resize', () => {
  resizeCanvas();
  if (state && state.bird)
    state.bird.y = Math.min(state.bird.y, canvas.height - GROUND_H - BIRD_H);
});

// ══════════════════════════════════════════════════════════
// STARS
// ══════════════════════════════════════════════════════════
function generateStars() {
  const stars = [];
  for (let i = 0; i < 60; i++)
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - GROUND_H),
      speed: 0.25 + Math.random() * 0.6,
      alpha: 0.3 + Math.random() * 0.7,
      big: Math.random() < 0.15,
    });
  return stars;
}

// ══════════════════════════════════════════════════════════
// RESET
// ══════════════════════════════════════════════════════════
function resetGame() {
  resizeCanvas();
  const bx = canvas.width * 0.22;
  const by = canvas.height * 0.42;
  const _hStartDim = hellMode ? HELL_DIM : DIMENSIONS[0];
  state = {
    running: true,
    bird: { x: bx, y: by, startY: by },
    velY: 0,
    score: 0,
    dimIndex: 0,
    dim: _hStartDim,
    speed: BASE_SPEED * _hStartDim.speedMult,
    gravity: BASE_GRAVITY * _hStartDim.gravMult,
    invertGravity: false,
    pipes: [],
    stars: generateStars(),
    groundOffset: 0,
    wingPhase: 0,
    frameCount: 0,
    hasFlapped: false,
    pop: null,
  };
  if (hellMode) {
    dimDisplay.classList.add("hell-mode");
    dimDisplay.textContent = "⛧ HELL";
    dimDisplay.style.color = HELL_DIM.accentColor;
  } else {
    dimDisplay.classList.remove("hell-mode");
  }
  scoreSaved = false;
  lastRandomDimIdx = -1;
}

// ══════════════════════════════════════════════════════════
// DIMENSION ADVANCE
// ══════════════════════════════════════════════════════════
// Pool of dimension indices (0-based) that can be randomly cycled in dim 11+
// Excludes dim 0 (NORMAL) — chaos zone should stay hard
const RANDOM_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// Tracks last random pick so we never repeat back-to-back
let lastRandomDimIdx = -1;

function pickRandomDim() {
  const pool = RANDOM_POOL.filter(i => i !== lastRandomDimIdx);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  lastRandomDimIdx = pick;
  return pick;
}

function advanceDimension() {
  state.dimIndex++;  // always increment — no cap

  let nextDim;
  if (state.dimIndex < DIMENSIONS.length) {
    // Dims 1–10: follow the fixed sequence
    nextDim = DIMENSIONS[state.dimIndex];
  } else {
    // Dim 11+: random shuffle from the pool each time
    nextDim = { ...DIMENSIONS[pickRandomDim()] };
    // Override the display id to reflect the real progression number
    nextDim = { ...nextDim, id: state.dimIndex + 1 };
  }

  state.dim = nextDim;
  state.speed = BASE_SPEED * state.dim.speedMult;
  state.gravity = BASE_GRAVITY * Math.abs(state.dim.gravMult);

  // When gravity flips, reset velocity and reposition bird to mid-screen
  // so the player isn't instantly killed by carried-over momentum
  if (state.dim.invertGravity !== state.invertGravity) {
    state.velY = 0;
    state.bird.y = (canvas.height - GROUND_H) * 0.5 - BIRD_H / 2;
    // Clear all pipes so player has breathing room to learn the flip
    state.pipes = [];
  }

  state.invertGravity = state.dim.invertGravity;
  dimBannerText.textContent = 'DIM ' + state.dim.id + ': ' + state.dim.name;
  dimBanner.classList.remove('show');
  void dimBanner.offsetWidth;
  dimBanner.style.color = state.dim.accentColor;
  dimBanner.style.borderColor = state.dim.accentColor;
  dimBanner.style.textShadow = '0 0 20px ' + state.dim.accentColor;
  dimBanner.classList.add('show');
  SFX.dimShift();
  gameArea.classList.remove('shake', 'glitch-flash');
  void gameArea.offsetWidth;
  gameArea.classList.add('shake');
  setTimeout(() => gameArea.classList.add('glitch-flash'), 100);
  setTimeout(() => gameArea.classList.remove('shake', 'glitch-flash'), 500);
  dimDisplay.style.color = state.dim.accentColor;
  dimDisplay.textContent = 'DIM ' + state.dim.id;
}

// ══════════════════════════════════════════════════════════
// COLLISION
// ══════════════════════════════════════════════════════════
function checkCollisions(inGrace) {
  const bx = state.bird.x + 4, by = state.bird.y + 4;
  const bw = BIRD_W - 8, bh = BIRD_H - 6;
  const groundY = canvas.height - GROUND_H;
  // Ground and ceiling are always lethal — ceiling kills from rapid flapping too
  if (by + bh >= groundY) return true;   // hit ground (or inverted floor)
  if (by <= 0)            return true;   // hit ceiling (or inverted ceiling)
  if (!inGrace && !cheatNoclip) {
    for (const p of state.pipes) {
      const yOff = getPipeMoveOffset(p);
      const topB = yOff + p.topH, botT = topB + p.gap;
      if (bx + bw > p.x && bx < p.x + PIPE_WIDTH)
        if (by < topB || by + bh > botT) return true;
    }
  }
  return false;
}

// ══════════════════════════════════════════════════════════
// UPDATE
// ══════════════════════════════════════════════════════════
function update(dt = 1) {
  if (!state.running) return;

  // Countdown tick SFX — fire once per slot change
  const _activeStartDelay = hellMode ? HELL_PIPE_START_DELAY : PIPE_START_DELAY;
  if (_activeStartDelay > 0 && state.frameCount < _activeStartDelay) {
    const prevSlot = Math.min(3, Math.floor(state.frameCount / (_activeStartDelay / 4)));
    const nextSlot = Math.min(3, Math.floor((state.frameCount + dt) / (_activeStartDelay / 4)));
    if (nextSlot > prevSlot) SFX.countdown(3 - nextSlot);
  }

  state.frameCount += dt;

  glitchTimer = state.dim.glitch ? Math.max(0, glitchTimer - dt) : 0;
  if (state.dim.glitch && Math.random() < 0.025 * dt) glitchTimer = 4;

  // Physics — gravity only after first flap; hover bob until then
  if (state.hasFlapped) {
    const gravDir = state.invertGravity ? -1 : 1;
    state.velY += state.gravity * gravDir * dt;
    if (!state.invertGravity) state.velY = Math.min(state.velY, MAX_FALL_SPEED);
    else state.velY = Math.max(state.velY, -MAX_FALL_SPEED);
    state.bird.y += state.velY * dt;
    // If bird escapes boundaries, kill immediately — don't clamp+survive
    const _ceiling = 0;
    const _floor   = canvas.height - GROUND_H - BIRD_H;
    if (state.bird.y < _ceiling || state.bird.y > _floor) { endGame(); return; }
  } else {
    state.bird.y = state.bird.startY + Math.sin(state.frameCount * 0.06) * 5;
  }

  state.wingPhase += 0.2 * dt;
  state.groundOffset += state.speed * dt;

  const inGrace = _activeStartDelay > 0 && state.frameCount < _activeStartDelay;
  if (!inGrace) {
    for (const p of state.pipes) {
      p.x -= state.speed * dt;
      if (state.dim.pipesMove) p.movePhase += state.dim.pipeMoveSpeed * dt;
      if (!p.counted && p.x + PIPE_WIDTH < state.bird.x) {
        p.counted = true;
        state.score++;
        scoreDisplay.textContent = state.score;
        SFX.score();
        if (state.score > 0 && state.score % SCORE_PER_DIM === 0) advanceDimension();
      }
    }
    state.pipes = state.pipes.filter(p => p.x + PIPE_WIDTH + 10 > 0);
    const lastPipe = state.pipes[state.pipes.length - 1];
    const _activeSpawnDist = hellMode ? HELL_PIPE_SPAWN_DIST : PIPE_SPAWN_DIST;
    if (!lastPipe || lastPipe.x < canvas.width - _activeSpawnDist) spawnPipe();
  }

  if (checkCollisions(inGrace)) endGame();
}

// ══════════════════════════════════════════════════════════
// DRAW
// ══════════════════════════════════════════════════════════
function draw() {
  const dim = state.dim;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(dim);

  const usableH = canvas.height - GROUND_H;
  for (const p of state.pipes) {
    const yOff = getPipeMoveOffset(p);
    // Gap window: yOff shifts where the opening sits vertically
    const gapTop = yOff + p.topH;   // top edge of the flythrough opening
    const gapBot = gapTop + p.gap;  // bottom edge of the flythrough opening
    // Top pipe always fills from ceiling (y=0) down to the gap — no ceiling gap ever
    drawPipe(p.x, 0, PIPE_WIDTH, gapTop, true, dim);
    // Bottom pipe always fills from gap down to ground — no floor gap ever
    drawPipe(p.x, gapBot, PIPE_WIDTH, usableH - gapBot, false, dim);
  }

  drawGround(dim);

  // Bird OR pop
  if (state.pop) {
    drawPop(state.pop);
  } else {
    drawBird(state.bird.x, state.bird.y, state.wingPhase, dim);
  }

  // Hell Mode watermark
  if (hellMode && state.running) {
    ctx.save();
    ctx.font = '9px "Share Tech Mono",monospace';
    ctx.fillStyle = "#ff3c14";
    ctx.shadowColor = "#ff3c14";
    ctx.shadowBlur = lowSpec ? 0 : 10;
    ctx.globalAlpha = 0.55 + Math.sin(Date.now() * 0.008) * 0.25;
    ctx.textAlign = "center";
    ctx.fillText("⛧ HELL MODE", canvas.width / 2, canvas.height - GROUND_H - 8);
    ctx.restore();
  }

  // Noclip indicator
  if (cheatNoclip) {
    ctx.save();
    ctx.font = '9px "Share Tech Mono",monospace';
    ctx.fillStyle = '#ff3c78';
    ctx.shadowColor = '#ff3c78';
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.006) * 0.3;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ NOCLIP', canvas.width / 2, 18);
    ctx.restore();
  }

  // Countdown overlay
  const _drawDelay = hellMode ? HELL_PIPE_START_DELAY : PIPE_START_DELAY;
  if (_drawDelay > 0 && state.frameCount < _drawDelay) {
    const f = state.frameCount;
    const total = _drawDelay;
    const slot = Math.min(3, Math.floor(f / (total / 4)));
    const slotProg = (f % (total / 4)) / (total / 4);
    const labels = ['3', '2', '1', 'GO!'];
    const label = labels[slot];
    const scale = 0.7 + Math.sin(slotProg * Math.PI) * 0.5;
    const alpha = slotProg < 0.85 ? 1 : 1 - ((slotProg - 0.85) / 0.15);

    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.35; ctx.fillStyle = '#000';
    ctx.fillRect(0, canvas.height * 0.32, canvas.width, canvas.height * 0.22);
    ctx.globalAlpha = alpha * 0.9;
    ctx.font = '12px "Share Tech Mono",monospace';
    ctx.fillStyle = dim.accentColor; ctx.shadowColor = dim.accentColor; ctx.shadowBlur = 10;
    ctx.fillText(slot < 3 ? 'GET READY — PIPES INCOMING' : 'FLAP NOW!',
      canvas.width / 2, canvas.height * 0.36);
    const fs = Math.round(canvas.width * 0.22 * scale);
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 24;
    ctx.fillStyle = slot === 3 ? '#ffff00' : '#ffffff';
    ctx.shadowColor = slot === 3 ? '#ffff00' : dim.accentColor;
    ctx.font = 'bold ' + fs + 'px "Share Tech Mono",monospace';
    ctx.fillText(label, canvas.width / 2, canvas.height * 0.47);
    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════
// GAME LOOP — delta-time normalised to 60 fps, hard-capped at 60 FPS
// ══════════════════════════════════════════════════════════
let lastTimestamp = null;
const FRAME_MIN_MS = 1000 / 60; // ~16.667 ms — never render faster than 60 FPS

function loop(timestamp) {
  if (lastTimestamp === null) lastTimestamp = timestamp;
  const elapsed = timestamp - lastTimestamp;

  // Skip frame if running faster than 60 FPS, but keep the loop alive
  if (elapsed < FRAME_MIN_MS) {
    animFrame = requestAnimationFrame(loop);
    return;
  }

  // Clamp dt: normalised to 1.0 at 60 FPS, max 3 to survive tab-switch pauses
  const rawDt = elapsed / FRAME_MIN_MS;
  const dt = Math.min(rawDt, 3);
  lastTimestamp = timestamp;

  update(dt);
  // If update() triggered endGame(), stop — endGame handles its own rendering
  if (!state.running) return;
  draw();
  animFrame = requestAnimationFrame(loop);
}

// ══════════════════════════════════════════════════════════
// END GAME — play burst then show death screen
// ══════════════════════════════════════════════════════════
function endGame() {
  if (!state.running) return;
  state.running = false;
  cancelAnimationFrame(animFrame);
  SFX.die();

  if (state.score > bestScore) bestScore = state.score;
  finalScoreEl.textContent = state.score;
  bestScoreEl.textContent = bestScore;

  // Shake
  gameArea.classList.remove('shake');
  void gameArea.offsetWidth;
  gameArea.classList.add('shake');

  const bx = state.bird.x + BIRD_W / 2;
  const by = state.bird.y + BIRD_H / 2;
  const accentCol = state.dim.accentColor;
  const groundY = canvas.height - GROUND_H;
  const palette = [accentCol, '#ffffff', '#ffffff', accentCol, '#ffaa00', '#ff3c78', accentCol];

  // Step 1: Erase bird from main canvas immediately
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(state.dim);
  const usableH2 = canvas.height - GROUND_H;
  for (const p of state.pipes) {
    const yOff = getPipeMoveOffset(p);
    const gapTop = yOff + p.topH;
    const gapBot = gapTop + p.gap;
    drawPipe(p.x, 0, PIPE_WIDTH, gapTop, true, state.dim);
    drawPipe(p.x, gapBot, PIPE_WIDTH, usableH2 - gapBot, false, state.dim);
  }
  drawGround(state.dim);

  // Step 2: Build particles
  const particles = [];
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 40 + Math.random() * 150;
    particles.push({
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 20,
      g: 50 + Math.random() * 80,
      size: 2 + Math.floor(Math.random() * 6),
      delay: Math.random() * 0.06,
      col: palette[Math.floor(Math.random() * palette.length)],
    });
  }

  // Step 3: Overlay canvas at z-index 999 — visible ABOVE game-over screen (z-index 20)
  const oc = document.createElement('canvas');
  oc.width = canvas.width;
  oc.height = canvas.height;
  oc.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:999;pointer-events:none;';
  gameArea.appendChild(oc);
  const octx = oc.getContext('2d');

  let burstFrame = 0;
  const maxFrames = 75;

  function burstLoop() {
    burstFrame++;
    const t = burstFrame / maxFrames;
    octx.clearRect(0, 0, oc.width, oc.height);

    // Radial flash bloom first 5 frames — no hard rectangular edges
    if (burstFrame <= 5) {
      const flashAlpha = 1 - (burstFrame / 5) * 0.9;
      const flashRadius = BIRD_W * 2.5 + burstFrame * 6;
      const flashGrad = octx.createRadialGradient(bx, by, 0, bx, by, flashRadius);
      flashGrad.addColorStop(0, `rgba(255,255,255,${flashAlpha})`);
      flashGrad.addColorStop(0.4, `rgba(255,255,255,${flashAlpha * 0.6})`);
      flashGrad.addColorStop(1, 'rgba(255,255,255,0)');
      octx.save();
      octx.globalAlpha = 1;
      octx.fillStyle = flashGrad;
      octx.beginPath();
      octx.arc(bx, by, flashRadius, 0, Math.PI * 2);
      octx.fill();
      octx.restore();
    }

    // Shockwave ring
    octx.save();
    octx.globalAlpha = Math.max(0, 1 - t * 2);
    octx.beginPath();
    octx.arc(bx, by, t * 100, 0, Math.PI * 2);
    octx.strokeStyle = accentCol;
    if (!lowSpec) { octx.shadowColor = accentCol; octx.shadowBlur = 24; } else { octx.shadowBlur = 0; }
    octx.lineWidth = 4 * (1 - t);
    octx.stroke();
    octx.restore();

    // Pixel shards
    octx.save();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (t < p.delay) continue;
      const pt = Math.min(1, (t - p.delay) / (1 - p.delay));
      const eased = 1 - Math.pow(1 - pt, 2);
      const px = bx + p.vx * eased;
      const rawPy = by + p.vy * eased + p.g * eased * eased;
      const hitGround = rawPy >= groundY - 2;
      if (hitGround) continue;
      const py = rawPy;
      const sz = Math.max(1, p.size * (1 - pt * 0.85));
      const alpha = Math.max(0, 1 - pt * 1.1);
      if (alpha <= 0) continue;
      octx.globalAlpha = alpha;
      octx.fillStyle = p.col;
      if (!lowSpec) { octx.shadowColor = p.col; octx.shadowBlur = 4; } else { octx.shadowBlur = 0; }
      octx.fillRect(Math.round(px - sz * 0.5), Math.round(py - sz * 0.5), Math.ceil(sz), Math.ceil(sz));
    }
    octx.restore();

    // Central glow
    if (t < 0.3) {
      const gp = 1 - t / 0.3;
      octx.save();
      octx.globalAlpha = gp * 0.9;
      octx.beginPath();
      octx.arc(bx, by, gp * 16, 0, Math.PI * 2);
      octx.fillStyle = '#ffffff';
      octx.shadowColor = accentCol;
      octx.shadowBlur = 32;
      octx.fill();
      octx.restore();
    }

    if (burstFrame < maxFrames) {
      animFrame = requestAnimationFrame(burstLoop);
    } else {
      oc.remove();
      scoreSaved = false;
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
      saveScoreBtn.disabled = false;
      saveScoreBtn.textContent = 'SAVE SCORE';
      saveScoreBtn.classList.remove('saved');
      const nameEntry = document.getElementById('nameEntry');
      const voidNotice = document.getElementById('voidNotice') || (() => {
        const el = document.createElement('div');
        el.id = 'voidNotice';
        el.style.cssText = 'font-size:0.7rem;letter-spacing:2px;color:#ff3c78;text-align:center;padding:6px 0;border:1px solid #ff3c7855;background:rgba(255,60,120,0.07);width:100%;';
        nameEntry.parentNode.insertBefore(el, nameEntry);
        return el;
      })();
      const _isVoided = cheatNoclip || hellMode;
      voidNotice.textContent = hellMode ? '⛧ HELL MODE — SCORE VOIDED' : '⚡ NOCLIP USED — SCORE VOIDED';
      if (_isVoided) { nameEntry.style.display = 'none'; voidNotice.style.display = 'block'; }
      else { nameEntry.style.display = ''; voidNotice.style.display = 'none'; }
      hud.classList.add('hidden');
      gameOverScreen.classList.add('active');
    }
  }
  animFrame = requestAnimationFrame(burstLoop);
}

// ══════════════════════════════════════════════════════════
// START GAME
// ══════════════════════════════════════════════════════════
function startGame() {
  startScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  leaderboardScreen.classList.remove('active');
  optionsScreen.classList.remove('active');
  hud.classList.remove('hidden');
  scoreDisplay.textContent = '0';
  // resetGame sets state.dim correctly for hellMode — read HUD from there after
  resetGame();
  // HUD sync: resetGame already sets dimDisplay for hell, but fix normal case too
  if (!hellMode) {
    dimDisplay.classList.remove('hell-mode');
    dimDisplay.style.color = DIMENSIONS[0].accentColor;
    dimDisplay.textContent = 'DIM 1';
  }
  cancelAnimationFrame(animFrame);
  lastTimestamp = null;
  animFrame = requestAnimationFrame(loop);
}

// ══════════════════════════════════════════════════════════
// SAVE SCORE
// ══════════════════════════════════════════════════════════
async function handleSaveScore() {
  if (scoreSaved) return;
  const name = playerNameInput.value.trim().toUpperCase() || 'ANON';
  if (name.length === 0) {
    showSaveStatus('ENTER A NAME FIRST', 'error'); return;
  }
  saveScoreBtn.disabled = true;
  saveScoreBtn.textContent = 'SAVING...';
  showSaveStatus('', '');

  const ok = await sb.insert({
    name,
    score: state.score,
    max_dimension: state.dimIndex + 1,
  });

  if (ok) {
    scoreSaved = true;
    saveScoreBtn.textContent = 'SAVED ✓';
    saveScoreBtn.classList.add('saved');
    showSaveStatus('SCORE SAVED!', 'ok');
  } else {
    saveScoreBtn.disabled = false;
    saveScoreBtn.textContent = 'SAVE SCORE';
    showSaveStatus('SAVE FAILED — CHECK CONFIG', 'error');
  }
}

function showSaveStatus(msg, type) {
  saveStatus.textContent = msg;
  saveStatus.className = 'save-status' + (type ? ' ' + type : '');
}

// ══════════════════════════════════════════════════════════
// LEADERBOARD
// ══════════════════════════════════════════════════════════
async function openLeaderboard() {
  startScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  leaderboardScreen.classList.add('active');
  lbList.innerHTML = '<div class="lb-loading">LOADING...</div>';

  const rows = await sb.topScores(15);
  if (!rows || rows.length === 0) {
    lbList.innerHTML = '<div class="lb-empty">NO SCORES YET — BE THE FIRST!</div>';
    return;
  }

  lbList.innerHTML = rows.map((r, i) => {
    const rankClass = i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : '';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
    return '<div class="lb-row ' + rankClass + '">'
      + '<span class="lb-rank">' + medal + '</span>'
      + '<span class="lb-name">' + escapeHtml(r.name) + '</span>'
      + '<span class="lb-dim">D' + r.max_dimension + '</span>'
      + '<span class="lb-score">' + r.score + '</span>'
      + '</div>';
  }).join('');
}

function closeLeaderboard() {
  leaderboardScreen.classList.remove('active');
  // Go back to wherever we came from
  if (state.running === false && state.score !== undefined && state.frameCount > 0) {
    gameOverScreen.classList.add('active');
  } else {
    startScreen.classList.add('active');
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ══════════════════════════════════════════════════════════
// HELL MODE LIVE APPLY
// ══════════════════════════════════════════════════════════
function applyHellModeToRunningGame() {
  if (hellMode) {
    state.dim = HELL_DIM;
    state.speed = BASE_SPEED * HELL_DIM.speedMult;
    state.gravity = BASE_GRAVITY * HELL_DIM.gravMult;
    state.invertGravity = false;
    state.velY = 0;
    state.pipes = [];
    dimBannerText.textContent = "⛧ HELL MODE ACTIVATED";
    dimBanner.classList.remove("show");
    void dimBanner.offsetWidth;
    dimBanner.style.color = HELL_DIM.accentColor;
    dimBanner.style.borderColor = HELL_DIM.accentColor;
    dimBanner.style.textShadow = "0 0 20px " + HELL_DIM.accentColor;
    dimBanner.classList.add("show");
    gameArea.classList.remove("shake", "glitch-flash");
    void gameArea.offsetWidth;
    gameArea.classList.add("shake");
    setTimeout(() => gameArea.classList.add("glitch-flash"), 80);
    setTimeout(() => gameArea.classList.remove("shake", "glitch-flash"), 500);
    SFX.dimShift();
    dimDisplay.classList.add("hell-mode");
    dimDisplay.textContent = "⛧ HELL";
    dimDisplay.style.color = HELL_DIM.accentColor;
  } else {
    const d = state.dimIndex < DIMENSIONS.length ? DIMENSIONS[state.dimIndex] : DIMENSIONS[DIMENSIONS.length - 1];
    state.dim = d;
    state.speed = BASE_SPEED * d.speedMult;
    state.gravity = BASE_GRAVITY * Math.abs(d.gravMult);
    state.invertGravity = d.invertGravity;
    state.pipes = [];
    dimBannerText.textContent = "DIM " + d.id + ": " + d.name;
    dimBanner.classList.remove("show");
    void dimBanner.offsetWidth;
    dimBanner.style.color = d.accentColor;
    dimBanner.style.borderColor = d.accentColor;
    dimBanner.style.textShadow = "0 0 20px " + d.accentColor;
    dimBanner.classList.add("show");
    SFX.dimShift();
    dimDisplay.classList.remove("hell-mode");
    dimDisplay.textContent = "DIM " + d.id;
    dimDisplay.style.color = d.accentColor;
  }
}

// ══════════════════════════════════════════════════════════
// OPTIONS
// ══════════════════════════════════════════════════════════
let _optionsCaller = 'start'; // 'start' | 'gameover'

function openOptions() {
  _optionsCaller = startScreen.classList.contains('active') ? 'start' : 'gameover';
  startScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  optionsScreen.classList.add('active');
}

function closeOptions() {
  optionsScreen.classList.remove('active');
  if (_optionsCaller === 'gameover') {
    gameOverScreen.classList.add('active');
  } else {
    startScreen.classList.add('active');
  }
}

function goToMenu() {
  gameOverScreen.classList.remove('active');
  leaderboardScreen.classList.remove('active');
  optionsScreen.classList.remove('active');
  // Cancel any running loop / burst animation
  cancelAnimationFrame(animFrame);
  // Reset state to a clean idle frame (not running)
  resizeCanvas();
  const _mx = canvas.width * 0.22;
  const _my = canvas.height * 0.42;
  const _menuDim = hellMode ? HELL_DIM : DIMENSIONS[0];
  state = {
    running: false,
    bird: { x: _mx, y: _my, startY: _my },
    velY: 0, score: 0,
    dimIndex: 0, dim: _menuDim,
    speed: BASE_SPEED * _menuDim.speedMult,
    gravity: BASE_GRAVITY * _menuDim.gravMult,
    invertGravity: false, pipes: [],
    stars: generateStars(),
    groundOffset: 0, wingPhase: 0, frameCount: 0,
    hasFlapped: false, pop: null,
  };
  hud.classList.add('hidden');
  // Remove any leftover overlay canvases from burst animation
  document.querySelectorAll('#gameArea canvas:not(#gameCanvas)').forEach(c => c.remove());
  draw(); // single clean static frame
  startScreen.classList.add('active');
}

function toggleOption(which) {
  if (which === 'sfx') {
    sfxMuted = !sfxMuted;
    sfxToggleBtn.classList.toggle('active', !sfxMuted);
    sfxToggleBtn.setAttribute('aria-pressed', String(!sfxMuted));
    sfxToggleBtn.querySelector('.toggle-state').textContent = sfxMuted ? 'OFF' : 'ON';
  } else if (which === 'lowSpec') {
    lowSpec = !lowSpec;
    lowSpecToggleBtn.classList.toggle('active', lowSpec);
    lowSpecToggleBtn.setAttribute('aria-pressed', String(lowSpec));
    lowSpecToggleBtn.querySelector('.toggle-state').textContent = lowSpec ? 'ON' : 'OFF';
    // Toggle scanlines CSS (expensive repeating-gradient) off in low-spec
    document.getElementById('gameArea').classList.toggle('low-spec', lowSpec);
  } else if (which === 'hell') {
    hellMode = !hellMode;
    hellToggleBtn.classList.toggle('active', hellMode);
    hellToggleBtn.setAttribute('aria-pressed', String(hellMode));
    hellToggleBtn.querySelector('.toggle-state').textContent = hellMode ? 'ON' : 'OFF';
    if (state.running) {
      applyHellModeToRunningGame();
    } else {
      // Not in-game: update the idle canvas so the background reflects hell colours
      const _idleDim = hellMode ? HELL_DIM : DIMENSIONS[0];
      state.dim = _idleDim;
      // Update start screen background via a single draw pass
      draw();
    }
  }
}

// ══════════════════════════════════════════════════════════
// INIT — draw a static frame while on start screen
// ══════════════════════════════════════════════════════════
(function init() {
  // Defer one rAF so the DOM has finished layout and getBoundingClientRect() returns real sizes
  requestAnimationFrame(() => {
    resizeCanvas();
    const bx = canvas.width * 0.22;
    const by = canvas.height * 0.42;
    state = {
      running: false, bird: { x: bx, y: by, startY: by }, velY: 0, score: 0,
      dimIndex: 0, dim: DIMENSIONS[0], speed: BASE_SPEED, gravity: BASE_GRAVITY,
      invertGravity: false, pipes: [], stars: generateStars(),
      groundOffset: 0, wingPhase: 0, frameCount: 0, hasFlapped: false, pop: null,
    };
    draw();
  });
})();
