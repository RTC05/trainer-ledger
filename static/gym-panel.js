'use strict';
/* ─────────────────────────────────────────────────────────
   gym-panel.js  —  Gym Guide + progress tracking
   Reads window.GYM_DATA and window.CURRENT_GAME_ID
   ───────────────────────────────────────────────────────── */

const _SE = {
  normal: ['fighting'], fire: ['water', 'ground', 'rock'], water: ['electric', 'grass'],
  electric: ['ground'], grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'], fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'], ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'], psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'], rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'], dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'], steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel'],
};

const _TC = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

const _gymProgressState = {
  gameId: window.CURRENT_GAME_ID,
  rows: [],
  completed: new Set(),
};

function _badge(type, small) {
  const bg = _TC[type] || '#777';
  const sz = small ? 'font-size:9px;padding:1px 5px' : 'font-size:10px;padding:2px 7px';
  return `<span class="type-badge" style="background:${bg};${sz}">${type}</span>`;
}

function _counters(leaderTypes) {
  const score = {};
  for (const def of leaderTypes) {
    for (const atk of (_SE[def] || [])) score[atk] = (score[atk] || 0) + 1;
  }
  return Object.entries(score).sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

function _sectionLabel(title) {
  if (/champion/i.test(title)) return 'champion';
  if (/elite four/i.test(title)) return 'elite';
  if (/semi.final/i.test(title)) return 'elite';
  return 'gym';
}

function _challengeId(g) {
  return `${g.title}::${g.leader}::${g.location}`.toLowerCase().replace(/\s+/g, '-');
}

function _nextChallenge() {
  return _gymProgressState.rows.find(g => !_gymProgressState.completed.has(_challengeId(g))) || null;
}

function _renderRow(g) {
  const counters = _counters(g.types);
  const typeHTML = g.types.map(t => _badge(t, false)).join(' ');
  const ctrHTML = counters.length
    ? counters.map(t => _badge(t, true)).join(' ')
    : '<span style="font-size:10px;color:var(--text-dim)">—</span>';

  const cid = _challengeId(g);
  const done = _gymProgressState.completed.has(cid);

  return `
  <div class="gp-row ${done ? 'gp-row-done' : ''}" data-challenge-id="${cid}">
    <button class="gp-check ${done ? 'gp-check-done' : ''}"
            type="button"
            onclick="toggleGymChallenge('${cid}')"
            title="${done ? 'Mark un-beaten' : 'Mark beaten'}"
            aria-label="Toggle beaten for ${g.leader}">
      ${done ? '✅' : '⬜'}
    </button>
    <div class="gp-emoji">${g.emoji}</div>
    <div class="gp-info">
      <div class="gp-leader">${g.leader}</div>
      <div class="gp-meta">${g.title} • ${g.location}</div>
    </div>
    <div class="gp-types">
      <div class="gp-type-line">${typeHTML}</div>
      <div class="gp-counter-line"><span class="gp-counter-label">counter:</span>${ctrHTML}</div>
    </div>
  </div>`;
}

function _renderSection(title, rows) {
  if (!rows.length) return '';
  return `
  <div class="gp-section">
    <div class="gp-section-title">${title}</div>
    ${rows.map(_renderRow).join('')}
  </div>`;
}

function _renderNextCard() {
  const next = _nextChallenge();
  const wrap = document.getElementById('gym-next-card');
  if (!wrap) return;

  if (!next) {
    wrap.innerHTML = '<div class="gp-next-card">🏆 All listed challenges completed. Legend behavior unlocked.</div>';
    return;
  }

  const counters = _counters(next.types).slice(0, 4).map(t => _badge(t, true)).join(' ');
  wrap.innerHTML = `
    <div class="gp-next-card">
      <strong>Next challenge:</strong> ${next.title} — ${next.leader} (${next.location})
      <div style="margin-top:4px;">Suggested counters: ${counters || '—'}</div>
    </div>
  `;
}

async function _loadGymProgress() {
  const r = await fetch(`/api/game/${_gymProgressState.gameId}/gym-progress`);
  if (!r.ok) return;
  const data = await r.json();
  _gymProgressState.completed = new Set(data.completed || []);
}

window.toggleGymChallenge = async function (challengeId) {
  const r = await fetch(`/api/game/${_gymProgressState.gameId}/gym-progress/${encodeURIComponent(challengeId)}`, {
    method: 'POST',
  });
  if (!r.ok) return;
  const data = await r.json();
  if (data.completed) _gymProgressState.completed.add(challengeId);
  else _gymProgressState.completed.delete(challengeId);
  renderGymPanel(_gymProgressState.gameId);
};

async function renderGymPanel(gameId) {
  const gyms = window.GYM_DATA?.[gameId];
  const panel = document.getElementById('gym-panel');
  const body = document.getElementById('gym-panel-body');
  if (!panel || !body) return;

  if (!gyms?.length) {
    panel.style.display = 'none';
    return;
  }

  _gymProgressState.gameId = gameId;
  _gymProgressState.rows = gyms;
  await _loadGymProgress();

  const gymRows = gyms.filter(g => _sectionLabel(g.title) === 'gym');
  const eliteRows = gyms.filter(g => _sectionLabel(g.title) === 'elite');
  const champRows = gyms.filter(g => _sectionLabel(g.title) === 'champion');
  const gymLabel = gymRows.some(g => /trial/i.test(g.title)) ? 'Trials' : 'Gym Leaders';

  body.innerHTML = `
    <div id="gym-next-card"></div>
    ${_renderSection(gymLabel, gymRows)}
    ${_renderSection('Elite Four', eliteRows)}
    ${_renderSection('Champion', champRows)}
  `;

  _renderNextCard();
}

window.toggleGymPanel = function () {
  const body = document.getElementById('gym-panel-body');
  const chevron = document.getElementById('gym-chevron');
  const btn = document.getElementById('gym-toggle-btn');
  if (!body) return;
  const opening = body.hidden;
  body.hidden = !opening;
  if (chevron) chevron.innerHTML = opening ? '&#9650;' : '&#9660;';
  if (btn) btn.setAttribute('aria-expanded', String(opening));
};

renderGymPanel(window.CURRENT_GAME_ID);
