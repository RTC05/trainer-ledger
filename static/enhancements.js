/* enhancements.js — Confetti milestones + Random Pokémon picker
   No external dependencies.
*/
'use strict';

/* ══════════════════════════════════════════════════════════
   CONFETTI ENGINE
   ══════════════════════════════════════════════════════════ */
(function () {
  let _canvas, _ctx, _particles = [], _raf;

  const COLORS = ['#ffc107','#e53935','#448aff','#4caf50','#ff80ab','#fff176','#80deea'];

  function _createParticle(x, y) {
    return {
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -12 - 4,
      color: COLORS[Math.random() * COLORS.length | 0],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
      gravity: 0.35,
      life: 1,
      decay: Math.random() * 0.012 + 0.008,
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
    };
  }

  function _ensureCanvas() {
    if (_canvas) return;
    _canvas = document.createElement('canvas');
    _canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(_canvas);
    _ctx = _canvas.getContext('2d');
  }

  function _resize() {
    if (!_canvas) return;
    _canvas.width  = window.innerWidth;
    _canvas.height = window.innerHeight;
  }

  function _draw() {
    if (!_ctx) return;
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    _particles = _particles.filter(p => p.life > 0);

    for (const p of _particles) {
      _ctx.save();
      _ctx.globalAlpha = p.life;
      _ctx.fillStyle   = p.color;
      _ctx.translate(p.x, p.y);
      _ctx.rotate((p.rotation * Math.PI) / 180);
      if (p.shape === 'circle') {
        _ctx.beginPath();
        _ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        _ctx.fill();
      } else {
        _ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      _ctx.restore();

      p.x        += p.vx;
      p.y        += p.vy;
      p.vy       += p.gravity;
      p.vx       *= 0.98;
      p.rotation += p.spin;
      p.life     -= p.decay;
    }

    if (_particles.length > 0) {
      _raf = requestAnimationFrame(_draw);
    } else {
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    }
  }

  function burst(count = 120) {
    _ensureCanvas();
    _resize();
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 3;
    for (let i = 0; i < count; i++) {
      _particles.push(_createParticle(
        cx + (Math.random() - 0.5) * 200,
        cy + (Math.random() - 0.5) * 80
      ));
    }
    cancelAnimationFrame(_raf);
    _draw();
  }

  window.confettiBurst = burst;
  window.addEventListener('resize', _resize);
})();


/* ══════════════════════════════════════════════════════════
   MILESTONE TRACKER
   Fires confetti at 25 / 50 / 75 / 100% completion.
   Tracks which milestones already fired via localStorage.
   ══════════════════════════════════════════════════════════ */
(function () {
  const MILESTONES = [25, 50, 75, 100];

  function _storageKey() {
    const m = window.location.pathname.match(/\/game\/([^/]+)/);
    return m ? `milestones_${m[1]}` : null;
  }

  function _firedMilestones() {
    const key = _storageKey();
    if (!key) return new Set();
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch { return new Set(); }
  }

  function _markFired(pct) {
    const key = _storageKey();
    if (!key) return;
    const fired = _firedMilestones();
    fired.add(pct);
    localStorage.setItem(key, JSON.stringify([...fired]));
  }

  function checkMilestones(caught, total) {
    if (!total) return;
    const pct = Math.floor((caught / total) * 100);
    const fired = _firedMilestones();
    for (const m of MILESTONES) {
      if (pct >= m && !fired.has(m)) {
        _markFired(m);
        setTimeout(() => {
          window.confettiBurst(m === 100 ? 300 : 150);
          _showMilestoneToast(m);
        }, 200);
        break; // one at a time
      }
    }
  }

  function _showMilestoneToast(pct) {
    const msgs = {
      25:  '25% done! Keep hunting! 🎯',
      50:  'Halfway there! You\'re on fire! 🔥',
      75:  '75%! Almost a Pokémon Master! ⚡',
      100: 'COMPLETE! You caught \'em all! 🎉🎉🎉',
    };
    const toast = document.createElement('div');
    toast.textContent = msgs[pct] || `${pct}% complete!`;
    toast.style.cssText = [
      'position:fixed', 'top:80px', 'left:50%', 'transform:translateX(-50%)',
      'background:#ffc107', 'color:#0a0a12', 'font-weight:800', 'font-size:16px',
      'padding:12px 28px', 'border-radius:50px', 'z-index:10000',
      'box-shadow:0 4px 24px rgba(0,0,0,0.4)', 'pointer-events:none',
      'transition:opacity 0.5s ease', 'opacity:1',
    ].join(';');
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; }, 2800);
    setTimeout(() => toast.remove(), 3400);
  }

  window.checkMilestones = checkMilestones;
})();


/* ══════════════════════════════════════════════════════════
   RANDOM POKÉMON PICKER
   Scrolls to & highlights a random uncaught card.
   ══════════════════════════════════════════════════════════ */
function pickRandomUncaught() {
  const uncaught = [...document.querySelectorAll('.poke-card')]
    .filter(c => !c.classList.contains('caught') && c.style.display !== 'none' && !c.classList.contains('hidden'));

  if (!uncaught.length) {
    _showPickerToast('No uncaught Pokémon visible! 🤔');
    return;
  }

  // Remove any previous highlight
  document.querySelectorAll('.picker-highlight').forEach(c => c.classList.remove('picker-highlight'));

  const pick = uncaught[Math.random() * uncaught.length | 0];
  pick.classList.add('picker-highlight');
  pick.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const name = pick.dataset.name || 'Unknown';
  _showPickerToast(`🎲 Go catch ${name.charAt(0).toUpperCase() + name.slice(1)}!`);

  // Remove highlight after 3s
  setTimeout(() => pick.classList.remove('picker-highlight'), 3000);
}

function _showPickerToast(msg) {
  const existing = document.getElementById('picker-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'picker-toast';
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%) translateY(0)',
    'background:#1c1c2e', 'color:#ffc107', 'font-weight:700', 'font-size:14px',
    'padding:10px 24px', 'border-radius:50px', 'z-index:10000',
    'border:1px solid rgba(255,193,7,0.4)',
    'box-shadow:0 4px 20px rgba(0,0,0,0.5)', 'pointer-events:none',
    'transition:opacity 0.4s ease', 'opacity:1',
  ].join(';');
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 2200);
  setTimeout(() => toast.remove(), 2700);
}

window.pickRandomUncaught = pickRandomUncaught;