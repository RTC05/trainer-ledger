/* DV/IV/EV tracker injected into Pokémon detail drawer */
'use strict';

const ST_KEYS = ['hp','attack','defense','sp_attack','sp_defense','speed'];
let _stInjectKey = null;
const ST_LABELS = {
  hp: 'HP', attack: 'Atk', defense: 'Def',
  sp_attack: 'SpA', sp_defense: 'SpD', speed: 'Spe',
};

function _sum(keys, obj, prefix='') {
  return keys.reduce((acc, k) => acc + Number(obj[`${prefix}${k}`] || 0), 0);
}

function _grade(statSystem, totalStats) {
  const max = statSystem === 'dv' ? 90 : 186;
  const pct = max ? (totalStats / max) * 100 : 0;
  if (pct >= 95) return 'S';
  if (pct >= 85) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
}

function _currentPokemonId() {
  const el = document.querySelector('#drawer-scroll .drawer-num');
  if (!el) return null;
  const m = el.textContent.match(/#(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function _loadSavedLevel(gameId, pokemonId, fallback) {
  const key = `st_level_${gameId}_${pokemonId}`;
  const v = parseInt(localStorage.getItem(key) || '', 10);
  return Number.isFinite(v) && v >= 1 && v <= 100 ? v : fallback;
}

function _saveLevel(gameId, pokemonId, level) {
  const key = `st_level_${gameId}_${pokemonId}`;
  localStorage.setItem(key, String(level));
}

function _calcHP(base, iv, ev, level, isDV) {
  const indiv = isDV ? iv * 2 : iv;
  const evTerm = isDV ? 0 : Math.floor(ev / 4);
  if (isDV) {
    return Math.floor((((base + indiv) * 2 + 63) * level) / 100) + level + 10;
  }
  return Math.floor((((2 * base + indiv + evTerm) * level) / 100)) + level + 10;
}

function _calcOther(base, iv, ev, level, isDV) {
  const indiv = isDV ? iv * 2 : iv;
  const evTerm = isDV ? 0 : Math.floor(ev / 4);
  if (isDV) {
    return Math.floor((((base + indiv) * 2 + 63) * level) / 100) + 5;
  }
  return Math.floor((((2 * base + indiv + evTerm) * level) / 100)) + 5;
}

function _calcPreview(baseStats, data, level, statSystem) {
  const isDV = statSystem === 'dv';
  const out = {};
  for (const k of ST_KEYS) {
    const base = Number(baseStats[k] || 0);
    const iv = Number(data[k] || 0);
    const ev = Number(data[`ev_${k}`] || 0);
    out[k] = k === 'hp'
      ? _calcHP(base, iv, ev, level, isDV)
      : _calcOther(base, iv, ev, level, isDV);
  }
  return out;
}

function _buildTrackerSection(entry, gameGen, gameId, pokemonId) {
  const statLabel = entry.stat_system === 'dv' ? 'DVs' : 'IVs';
  const statMax = entry.stat_system === 'dv' ? 15 : 31;
  const evEnabled = gameGen >= 3;

  const level = _loadSavedLevel(gameId, pokemonId, gameGen <= 2 ? 5 : 50);

  const statRows = ST_KEYS.map((k) => `
    <div class="st-row">
      <label class="st-label" for="st-${k}">${k.replace('_', ' ')}</label>
      <input id="st-${k}" class="st-input" type="number" min="0" max="${statMax}" value="${entry[k] ?? 0}" data-key="${k}">
    </div>
  `).join('');

  const evRows = ST_KEYS.map((k) => `
    <div class="st-row">
      <label class="st-label" for="st-ev-${k}">EV ${k.replace('_', ' ')}</label>
      <input id="st-ev-${k}" class="st-input" type="number" min="0" max="255" value="${entry[`ev_${k}`] ?? 0}" data-key="ev_${k}" ${evEnabled ? '' : 'disabled'}>
    </div>
  `).join('');

  return `
    <div class="drawer-section" id="stats-tracker-section">
      <div class="drawer-section-title">🧬 ${statLabel} / EV Tracker</div>
      <p class="st-sub">Gen ${gameGen} • ${entry.stat_system.toUpperCase()} mode${evEnabled ? ' + EVs' : ''}</p>

      <div class="st-row st-level-row">
        <label class="st-label" for="st-level">Level</label>
        <input id="st-level" class="st-input" type="number" min="1" max="100" value="${level}">
      </div>

      <div class="st-grid">${statRows}</div>
      <div class="st-grid st-ev-grid">${evRows}</div>

      <div class="st-summary" id="st-summary"></div>
      <div class="st-calc" id="st-calc"></div>
      <div class="st-actions">
        <button id="st-save" class="filter-pill" type="button">Save Stats</button>
        <span id="st-status" class="st-status"></span>
      </div>
    </div>
  `;
}

function _readInputs() {
  const data = {};
  document.querySelectorAll('#stats-tracker-section .st-input').forEach((inp) => {
    data[inp.dataset.key] = Math.max(0, parseInt(inp.value || '0', 10) || 0);
  });
  return data;
}

function _renderCalcPreview(statSystem, gameId, pokemonId) {
  const anchor = document.getElementById('stats-tracker-anchor');
  const calcEl = document.getElementById('st-calc');
  const lvlEl = document.getElementById('st-level');
  if (!anchor || !calcEl || !lvlEl) return;

  const level = Math.max(1, Math.min(100, parseInt(lvlEl.value || '1', 10) || 1));
  _saveLevel(gameId, pokemonId, level);

  const baseStats = {
    hp: Number(anchor.dataset.baseHp || 0),
    attack: Number(anchor.dataset.baseAttack || 0),
    defense: Number(anchor.dataset.baseDefense || 0),
    sp_attack: Number(anchor.dataset.baseSp_attack || anchor.dataset.baseSpAttack || 0),
    sp_defense: Number(anchor.dataset.baseSp_defense || anchor.dataset.baseSpDefense || 0),
    speed: Number(anchor.dataset.baseSpeed || 0),
  };

  const values = _readInputs();
  const preview = _calcPreview(baseStats, values, level, statSystem);

  calcEl.innerHTML = `
    <div class="st-calc-title">Calculated stats at Lv. ${level}</div>
    <div class="st-calc-grid">
      ${ST_KEYS.map(k => `<span class="st-calc-chip"><strong>${ST_LABELS[k]}</strong> ${preview[k]}</span>`).join('')}
    </div>
  `;
}

function _renderSummary(statSystem, gameId, pokemonId) {
  const data = _readInputs();
  const totalStats = _sum(ST_KEYS, data);
  const totalEV = _sum(ST_KEYS, data, 'ev_');
  const grade = _grade(statSystem, totalStats);
  const maxStats = statSystem === 'dv' ? 90 : 186;

  const sumEl = document.getElementById('st-summary');
  if (!sumEl) return;
  sumEl.innerHTML = `
    <div><strong>${statSystem.toUpperCase()} Total:</strong> ${totalStats}/${maxStats}</div>
    <div><strong>EV Total:</strong> ${totalEV}${statSystem === 'dv' ? ' (N/A in this gen)' : '/510'}</div>
    <div><strong>IV Check Grade:</strong> ${grade}</div>
  `;
  _renderCalcPreview(statSystem, gameId, pokemonId);
}

async function _saveStats(gameId, pokemonId, statSystem) {
  const payload = {
    game_id: gameId,
    pokemon_id: pokemonId,
    stat_system: statSystem,
    ..._readInputs(),
  };
  const statusEl = document.getElementById('st-status');
  if (statusEl) statusEl.textContent = 'Saving...';

  try {
    const r = await fetch('/api/stats/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    if (statusEl) statusEl.textContent = 'Saved ✔';
  } catch {
    if (statusEl) statusEl.textContent = 'Save failed';
  }
}

async function injectStatsTracker(forcedPokemonId = null) {
  const scroll = document.getElementById('drawer-scroll');
  if (!scroll) return;
  if (scroll.querySelector('#stats-tracker-section')) return;

  const pokemonId = forcedPokemonId || _currentPokemonId();
  const gameId = window.CURRENT_GAME_ID;
  const gameGen = window.GAME_GEN || 9;
  if (!pokemonId || !gameId) return;

  const key = `${gameId}:${pokemonId}`;
  if (_stInjectKey === key) return;
  _stInjectKey = key;

  try {
    const r = await fetch(`/api/stats/${gameId}/${pokemonId}`);
    if (!r.ok) return;
    const data = await r.json();
    if (!data?.entry) return;

    const anchor = document.getElementById('stats-tracker-anchor');
    if (anchor) {
      anchor.outerHTML = _buildTrackerSection(data.entry, data.game_gen || gameGen, gameId, pokemonId);
    } else {
      scroll.insertAdjacentHTML('beforeend', _buildTrackerSection(data.entry, data.game_gen || gameGen, gameId, pokemonId));
    }

    const statSystem = data.entry.stat_system;
    _renderSummary(statSystem, gameId, pokemonId);

    scroll.querySelectorAll('#stats-tracker-section .st-input').forEach((inp) => {
      inp.addEventListener('input', () => _renderSummary(statSystem, gameId, pokemonId));
    });
    document.getElementById('st-level')?.addEventListener('input', () =>
      _renderSummary(statSystem, gameId, pokemonId)
    );
    document.getElementById('st-save')?.addEventListener('click', () =>
      _saveStats(gameId, pokemonId, statSystem)
    );
  } catch {
    // keep drawer resilient
  } finally {
    _stInjectKey = null;
  }
}

const _obs = new MutationObserver(() => {
  const scroll = document.getElementById('drawer-scroll');
  if (!scroll) return;
  if (scroll.querySelector('.drawer-hero') && !scroll.querySelector('#stats-tracker-section')) {
    injectStatsTracker();
  }
});

window.injectStatsTracker = injectStatsTracker;

document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('drawer-scroll');
  if (scroll) _obs.observe(scroll, { childList: true, subtree: true });
});
