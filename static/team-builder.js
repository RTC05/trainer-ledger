/* ─────────────────────────────────────────────────
   Team Builder — logic, coverage engine, gym
   matchup analysis, and best-team suggester.
   Depends on: gym-data.js (window.GYM_DATA)
   ─────────────────────────────────────────────────*/
'use strict';

/* ── Type colours ── */
const TB_TC = {
  normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030',
  grass:'#78C850', ice:'#98D8D8', fighting:'#C03028', poison:'#A040A0',
  ground:'#E0C068', flying:'#A890F0', psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038', ghost:'#705898', dragon:'#7038F8', dark:'#705848',
  steel:'#B8B8D0', fairy:'#EE99AC',
};

const TB_TYPES = Object.keys(TB_TC);

/* attacking type → { super, not, immune } */
const TB_CHART = {
  normal:   { immune:['ghost'] },
  fire:     { super:['grass','ice','bug','steel'],          not:['fire','water','rock','dragon'] },
  water:    { super:['fire','ground','rock'],               not:['water','grass','dragon'] },
  electric: { super:['water','flying'],                    not:['electric','grass','dragon'], immune:['ground'] },
  grass:    { super:['water','ground','rock'],              not:['fire','grass','poison','flying','bug','dragon','steel'] },
  ice:      { super:['grass','ground','flying','dragon'],   not:['water','ice'] },
  fighting: { super:['normal','ice','rock','dark','steel'], not:['poison','bug','psychic','flying','fairy'], immune:['ghost'] },
  poison:   { super:['grass','fairy'],                     not:['poison','ground','rock','ghost'], immune:['steel'] },
  ground:   { super:['fire','electric','poison','rock','steel'], not:['grass','bug'], immune:['flying'] },
  flying:   { super:['grass','fighting','bug'],             not:['electric','rock','steel'] },
  psychic:  { super:['fighting','poison'],                  not:['psychic','steel'], immune:['dark'] },
  bug:      { super:['grass','psychic','dark'],             not:['fire','fighting','poison','flying','ghost','steel','fairy'] },
  rock:     { super:['fire','ice','flying','bug'],          not:['fighting','ground','steel'] },
  ghost:    { super:['psychic','ghost'],                    not:['dark'], immune:['normal','fighting'] },
  dragon:   { super:['dragon'],                            not:['steel'], immune:['fairy'] },
  dark:     { super:['psychic','ghost'],                    not:['fighting','dark','fairy'] },
  steel:    { super:['ice','rock','fairy'],                 not:['fire','water','electric','steel'] },
  fairy:    { super:['fighting','dragon','dark'],           not:['fire','poison','steel'] },
};

/** Multiplier for one attack type vs one defending type */
function _oneMult(atk, def) {
  const e = TB_CHART[atk] || {};
  if ((e.immune||[]).includes(def)) return 0;
  if ((e.not   ||[]).includes(def)) return 0.5;
  if ((e.super ||[]).includes(def)) return 2;
  return 1;
}

/** Combined multiplier for atk type vs array of def types */
function _mult(atk, defTypes) {
  return defTypes.reduce((m, d) => m * _oneMult(atk, d), 1);
}

/** Does this Pokémon (by its types) have ≥1 SE STAB move vs these gym types? */
function hasSuperEffective(pokeTypes, gymTypes) {
  return pokeTypes.some(atk => _mult(atk, gymTypes) >= 2);
}

/** Count how many of the 6 team slots are weak to a given attacking type */
function teamWeaknessCount(team, atkType) {
  return team.filter(p => _mult(atkType, p.types) >= 2).length;
}

/** Sprite URL helper */
function sprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function typePill(type, small = false) {
  const bg = TB_TC[type] || '#777';
  const sz = small ? 'font-size:9px;padding:1px 6px' : 'font-size:10px;padding:2px 8px';
  return `<span style="background:${bg};border-radius:12px;color:#fff;font-weight:700;
    text-transform:capitalize;text-shadow:0 1px 2px rgba(0,0,0,.4);${sz}">${type}</span>`;
}

/* ── State ── */
let _roster    = [];   // all caught Pokémon
let _team      = [];   // up to 6 selected (pokemon objects)
let _gameId    = '';
let _gymData   = [];

/* ── Boot ── */
async function initTeamBuilder(gameId) {
  _gameId  = gameId;
  _gymData = (window.GYM_DATA || {})[gameId] || [];

  const loadEl = document.getElementById('tb-load');
  const mainEl = document.getElementById('tb-main');

  try {
    const res  = await fetch(`/api/game/${gameId}/caught`);
    _roster    = await res.json();
  } catch(e) {
    loadEl.innerHTML = `<p style="color:#ef5350">Failed to load caught Pok\u00e9mon.</p>`;
    return;
  }

  if (!_roster.length) {
    loadEl.innerHTML = `
      <div class="tb-empty">
        <div class="tb-empty-icon">&#127864;</div>
        <p>No caught Pok\u00e9mon yet for this game.<br>
           <a href="/game/${gameId}" style="color:var(--pokeyellow)">Go catch some first!</a></p>
      </div>`;
    return;
  }

  loadEl.style.display = 'none';
  mainEl.style.display = '';
  renderRoster();
  renderTeamSlots();
  renderAnalysis();
}

/* ── Roster ── */
function renderRoster(filter = '') {
  const grid = document.getElementById('roster-grid');
  const f = filter.toLowerCase();
  let shown = 0;
  grid.innerHTML = _roster.map(p => {
    const hide = f && !p.name.includes(f) && !String(p.dex_number).includes(f) ? ' hidden' : '';
    const onTeam = _team.find(t => t.id === p.id) ? ' on-team' : '';
    if (!hide) shown++;
    return `
      <div class="roster-card${onTeam}${hide}" data-id="${p.id}" onclick="tbClickRoster(${p.id})" title="${p.name}">
        <div class="roster-num">#${String(p.dex_number).padStart(3,'0')}</div>
        <img class="roster-sprite" src="${sprite(p.id)}" alt="${p.name}" loading="lazy">
        <div class="roster-name">${p.name}</div>
      </div>`;
  }).join('');
  const cnt = document.getElementById('roster-count');
  if (cnt) cnt.textContent = `${shown} shown`;
}

/* ── Team Slots ── */
function renderTeamSlots() {
  const wrap = document.getElementById('team-slots');
  let html = '';
  for (let i = 0; i < 6; i++) {
    const p = _team[i];
    if (p) {
      html += `
        <div class="team-slot filled" title="Click X to remove">
          <span class="team-slot-num">${i+1}</span>
          <button class="team-slot-remove" onclick="tbRemove(${p.id})" title="Remove">&#x2715;</button>
          <img class="team-slot-sprite" src="${sprite(p.id)}" alt="${p.name}">
          <div class="team-slot-name">${p.name}</div>
          <div class="team-slot-types">${p.types.map(t => typePill(t,true)).join('')}</div>
        </div>`;
    } else {
      html += `
        <div class="team-slot">
          <span class="team-slot-num">${i+1}</span>
          <span class="team-slot-empty">&#43;</span>
        </div>`;
    }
  }
  wrap.innerHTML = html;
}

/* ── Add / Remove ── */
window.tbClickRoster = function(id) {
  if (_team.find(p => p.id === id)) return; // already on team
  if (_team.length >= 6) return;             // full
  const p = _roster.find(r => r.id === id);
  if (!p) return;
  _team.push(p);
  _sync();
};

window.tbRemove = function(id) {
  _team = _team.filter(p => p.id !== id);
  _sync();
};

function _sync() {
  renderTeamSlots();
  renderRoster(document.getElementById('roster-search')?.value || '');
  renderAnalysis();
  document.getElementById('tb-suggest-btn').disabled = _team.length === 6;
}

/* ── Analysis Panels ── */
function renderAnalysis() {
  renderOffensiveCoverage();
  renderDefensiveWeaknesses();
  renderGymMatchups();
}

function renderOffensiveCoverage() {
  const el = document.getElementById('analysis-offense');
  if (!el) return;
  // Which types can the team hit super-effectively via STAB?
  const teamTypes = [...new Set(_team.flatMap(p => p.types))];
  const covered   = TB_TYPES.filter(def =>
    teamTypes.some(atk => _mult(atk, [def]) >= 2)
  );
  const missing = TB_TYPES.filter(t => !covered.includes(t));

  if (!_team.length) { el.innerHTML = '<p class="no-coverage">Add Pok\u00e9mon to see coverage.</p>'; return; }
  el.innerHTML = `
    <div class="coverage-grid">
      ${TB_TYPES.map(t =>
        `<span class="coverage-chip${covered.includes(t)?'':' dim'}" style="background:${TB_TC[t]}">${t}</span>`
      ).join('')}
    </div>
    ${missing.length ? `<p style="font-size:11px;color:var(--text-dim);margin-top:8px">
      No STAB coverage: ${missing.map(t=>`<b style="color:${TB_TC[t]}">${t}</b>`).join(', ')}
    </p>` : '<p style="font-size:11px;color:#4caf50;margin-top:8px">&#10003; Full type coverage!</p>'}`;
}

function renderDefensiveWeaknesses() {
  const el = document.getElementById('analysis-defense');
  if (!el) return;
  if (!_team.length) { el.innerHTML = '<p class="no-coverage">Add Pok\u00e9mon to see weaknesses.</p>'; return; }

  const counts = TB_TYPES.map(atk => ({ type: atk, count: teamWeaknessCount(_team, atk) }))
    .filter(r => r.count > 0)
    .sort((a,b) => b.count - a.count);

  if (!counts.length) {
    el.innerHTML = '<p style="font-size:12px;color:#4caf50">&#10003; No shared weaknesses!</p>';
    return;
  }
  el.innerHTML = counts.map(r => {
    const pct = (r.count / _team.length) * 100;
    const col = r.count >= 4 ? '#ef5350' : r.count >= 2 ? '#ffc107' : '#8bc34a';
    return `<div class="weak-row">
      <span class="weak-type-name" style="background:${TB_TC[r.type]}">${r.type}</span>
      <span class="weak-count">${r.count}/${_team.length} weak</span>
      <div class="weak-bar-track"><div class="weak-bar-fill" style="width:${pct}%;background:${col}"></div></div>
    </div>`;
  }).join('');
}

function renderGymMatchups() {
  const el = document.getElementById('analysis-gyms');
  if (!el) return;

  if (!_gymData.length) {
    el.innerHTML = '<p class="gym-empty">No gym data for this game.</p>';
    return;
  }

  const rows = _gymData.map(gym => {
    // Which team members have SE STAB vs this gym?
    const good = _team.filter(p => hasSuperEffective(p.types, gym.types));
    // Which team members are weak to at least one of the gym's types?
    const weak = _team.filter(p => gym.types.some(atk => _mult(atk, p.types) >= 2));

    let rating, rClass;
    if (!_team.length)  { rating = '—';     rClass = ''; }
    else if (good.length >= 2) { rating = '✅ Great'; rClass = 'great'; }
    else if (good.length === 1){ rating = '🟡 OK';   rClass = 'ok'; }
    else                       { rating = '⚠️ Rough'; rClass = 'rough'; }

    return `<tr class="gym-row">
      <td class="gym-cell">
        <div class="gym-leader">${gym.emoji} ${gym.leader}</div>
        <div class="gym-title">${gym.title} &middot; ${gym.location}</div>
      </td>
      <td class="gym-cell">
        <div class="gym-type-chips">${gym.types.map(t => typePill(t)).join('')}</div>
      </td>
      <td class="gym-cell">
        <div class="gym-counters">
          ${good.length
            ? good.map(p => `<img class="gym-counter-sprite" src="${sprite(p.id)}" alt="${p.name}" title="${p.name}">`).join('')
            : _team.length ? '<span style="font-size:11px;color:var(--text-dim)">None &#x1F613;</span>' : ''}
        </div>
      </td>
      <td class="gym-cell"><div class="gym-rating ${rClass}">${rating}</div></td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    <table class="gym-table">
      <thead><tr>
        <th>Leader</th><th>Types</th><th>Your counters</th><th>Rating</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* ── Suggest Best Team ── */
window.tbSuggestTeam = function() {
  if (!_roster.length) return;

  /* Score each Pokémon: count distinct gyms it's SE against */
  const scored = _roster.map(p => ({
    ...p,
    gymScore: _gymData.filter(g => hasSuperEffective(p.types, g.types)).length,
  })).sort((a,b) => b.gymScore - a.gymScore);

  /* Greedy set cover: pick 6 that maximize uncovered gyms */
  const covered  = new Set();
  const suggested = [];
  const used      = new Set();

  /* Track offensive types already on team to encourage diversity */
  const teamOff = new Set();

  while (suggested.length < 6 && suggested.length < scored.length) {
    let best = null, bestNew = -1;
    for (const p of scored) {
      if (used.has(p.id)) continue;
      // New gyms this Pokémon would cover
      const newGyms = _gymData.filter(
        (g, i) => !covered.has(i) && hasSuperEffective(p.types, g.types)
      ).length;
      // Diversity bonus: prefer types not yet on team
      const newTypes = p.types.filter(t => !teamOff.has(t)).length;
      const score = newGyms * 3 + newTypes;
      if (score > bestNew) { bestNew = score; best = p; }
    }
    if (!best) break;
    suggested.push(best);
    used.add(best.id);
    best.types.forEach(t => teamOff.add(t));
    _gymData.forEach((g, i) => { if (hasSuperEffective(best.types, g.types)) covered.add(i); });
  }

  _team = suggested;
  _sync();
};

/* ── Roster search ── */
window.tbSearch = function(val) { renderRoster(val); };

/* ── Init on load ── */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('tb-game-id');
  if (el) initTeamBuilder(el.value);
});