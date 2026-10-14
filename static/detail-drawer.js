/* ─────────────────────────────────────────────────
   Pokémon Detail Drawer
   Fetches data from PokéAPI on demand and renders
   a rich side-panel with stats, evolutions, moves,
   type matchups, abilities and encounter locations.
   ─────────────────────────────────────────────────*/

'use strict';

/* ── Type colours ── */
const TC = {
  normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030',
  grass:'#78C850', ice:'#98D8D8', fighting:'#C03028', poison:'#A040A0',
  ground:'#E0C068', flying:'#A890F0', psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038', ghost:'#705898', dragon:'#7038F8', dark:'#705848',
  steel:'#B8B8D0', fairy:'#EE99AC',
};

/*
  TYPE_CHART[attackType] = { super:[...], not:[...], immune:[...] }
  super  = 2×, not = 0.5×, immune = 0×
*/
const TYPE_CHART = {
  normal:   { immune:['ghost'] },
  fire:     { super:['grass','ice','bug','steel'],           not:['fire','water','rock','dragon'] },
  water:    { super:['fire','ground','rock'],                not:['water','grass','dragon'] },
  electric: { super:['water','flying'],                     not:['electric','grass','dragon'], immune:['ground'] },
  grass:    { super:['water','ground','rock'],               not:['fire','grass','poison','flying','bug','dragon','steel'] },
  ice:      { super:['grass','ground','flying','dragon'],    not:['water','ice'] },
  fighting: { super:['normal','ice','rock','dark','steel'],  not:['poison','bug','psychic','flying','fairy'], immune:['ghost'] },
  poison:   { super:['grass','fairy'],                      not:['poison','ground','rock','ghost'], immune:['steel'] },
  ground:   { super:['fire','electric','poison','rock','steel'], not:['grass','bug'], immune:['flying'] },
  flying:   { super:['grass','fighting','bug'],              not:['electric','rock','steel'] },
  psychic:  { super:['fighting','poison'],                   not:['psychic','steel'], immune:['dark'] },
  bug:      { super:['grass','psychic','dark'],              not:['fire','fighting','poison','flying','ghost','steel','fairy'] },
  rock:     { super:['fire','ice','flying','bug'],           not:['fighting','ground','steel'] },
  ghost:    { super:['psychic','ghost'],                     not:['dark'], immune:['normal','fighting'] },
  dragon:   { super:['dragon'],                             not:['steel'], immune:['fairy'] },
  dark:     { super:['psychic','ghost'],                     not:['fighting','dark','fairy'] },
  steel:    { super:['ice','rock','fairy'],                  not:['fire','water','electric','steel'] },
  fairy:    { super:['fighting','dragon','dark'],            not:['fire','poison','steel'] },
};

/* Compute multiplier for one attacking type vs one defending type */
function oneMult(atk, def) {
  const entry = TYPE_CHART[atk] || {};
  if ((entry.immune || []).includes(def)) return 0;
  if ((entry.not    || []).includes(def)) return 0.5;
  if ((entry.super  || []).includes(def)) return 2;
  return 1;
}

/* Combined multiplier for attacking type vs a list of defending types */
function calcMult(atk, defTypes) {
  return defTypes.reduce((m, d) => m * oneMult(atk, d), 1);
}

/* Group all attack types by their multiplier against this Pokémon */
function calcMatchups(defTypes) {
  const groups = { 4:[], 2:[], 0.5:[], 0.25:[], 0:[] };
  Object.keys(TC).forEach(atk => {
    const m = calcMult(atk, defTypes);
    if (m !== 1 && groups[m] !== undefined) groups[m].push(atk);
    else if (m === 4) groups[4].push(atk);
  });
  return groups;
}

/* ── PokéAPI helpers ── */
const API = 'https://pokeapi.co/api/v2';
async function apiFetch(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

/* ── Generation-accurate type lookup ──
   PokéAPI includes `past_types` on every Pokémon showing which types
   were used in earlier generations. We use that to return historically
   correct types for whichever game the player is currently viewing.
   e.g. Clefairy = Normal in Gen 1–5, Fairy in Gen 6+
*/
const GEN_NUM = {
  'generation-i':1,'generation-ii':2,'generation-iii':3,'generation-iv':4,
  'generation-v':5,'generation-vi':6,'generation-vii':7,'generation-viii':8,
  'generation-ix':9,
};

function getTypesForGen(poke, gameGen) {
  if (!gameGen || !poke.past_types?.length) {
    return poke.types.map(t => t.type.name);
  }
  /* Sort past_types oldest→newest; each entry means
     "these were the types IN this gen and all prior gens" */
  const sorted = [...poke.past_types].sort(
    (a, b) => (GEN_NUM[a.generation.name] || 99) - (GEN_NUM[b.generation.name] || 99)
  );
  for (const pt of sorted) {
    if ((GEN_NUM[pt.generation.name] || 99) >= gameGen) {
      return pt.types.map(t => t.type.name);
    }
  }
  return poke.types.map(t => t.type.name);
}

/* Note shown under type matchups for older gens */
function genAccuracyNote(gameGen) {
  if (gameGen === 1) return '<p class="gen-accuracy-note">⚠️ Gen 1 — No Dark, Steel or Fairy types. Ghost/Psychic immunity and Poison/Bug interactions differ from later games.</p>';
  if (gameGen <= 5) return '<p class="gen-accuracy-note">⚠️ Gen 1–5 — Fairy type did not exist. Types shown reflect this game’s generation.</p>';
  return '';
}

/* ── Evolution chain flattener ──
   Returns array of "rows" (each row = linear path or branch).
   For simple chains: [ [{species,id,trigger}], [{...}], ... ]
   For branching: last row holds multiple nodes.
*/
function idFromUrl(url) {
  return parseInt(url.split('/').filter(Boolean).pop(), 10);
}

function _fmt(str) {
  // "water-stone" → "Water Stone"
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function triggerLabel(detail) {
  if (!detail) return '';
  const t = detail.trigger?.name;
  const parts = [];

  if (t === 'use-item' && detail.item) {
    return _fmt(detail.item.name);
  }

  if (t === 'trade') {
    if (detail.held_item) return `Trade holding ${_fmt(detail.held_item.name)}`;
    return 'Trade';
  }

  if (t === 'three-critical-hits') return '3 Critical Hits';
  if (t === 'take-damage')         return 'Take 49+ damage then level up';
  if (t === 'tower-of-darkness')   return 'Tower of Darkness';
  if (t === 'tower-of-waters')     return 'Tower of Waters';
  if (t === 'agile-style-move')    return 'Use agile style move 20×';
  if (t === 'strong-style-move')   return 'Use strong style move 20×';
  if (t === 'recoil-damage')       return 'Recoil damage';
  if (t === 'spin')                return 'Spin with Syrupy Apple';
  if (t === 'walk-together')       return 'Walk 1000 steps (GO)';

  if (t === 'shed') return 'Lv. 20 + empty party slot + Poké Ball';

  if (t === 'level-up' || t === 'other' || !t) {
    // Base trigger
    if (detail.min_level) parts.push(`Lv. ${detail.min_level}`);

    // Happiness / affection
    if (detail.min_happiness && detail.min_affection) {
      parts.push('High Friendship & Affection');
    } else if (detail.min_happiness) {
      parts.push('High Friendship');
    } else if (detail.min_affection) {
      parts.push('High Affection');
    }

    // Time of day
    if (detail.time_of_day === 'day')   parts.push('(Daytime)');
    if (detail.time_of_day === 'night') parts.push('(Nighttime)');

    // Held item during level up
    if (detail.held_item) parts.push(`Holding ${_fmt(detail.held_item.name)}`);

    // Known move / move type
    if (detail.known_move)      parts.push(`Knows ${_fmt(detail.known_move.name)}`);
    if (detail.known_move_type) parts.push(`Knows a ${_fmt(detail.known_move_type.name)}-type move`);

    // Location
    if (detail.location) parts.push(`Near ${_fmt(detail.location.name)}`);

    // Gender
    if (detail.gender === 1) parts.push('(Female)');
    if (detail.gender === 2) parts.push('(Male)');

    // Physical stats comparison (Tyrogue)
    if (detail.relative_physical_stats === 1)  parts.push('Atk > Def');
    if (detail.relative_physical_stats === -1) parts.push('Def > Atk');
    if (detail.relative_physical_stats === 0)  parts.push('Atk = Def');

    // Party requirements
    if (detail.party_species) parts.push(`With ${_fmt(detail.party_species.name)} in party`);
    if (detail.party_type)    parts.push(`With a ${_fmt(detail.party_type.name)}-type in party`);

    // Environmental
    if (detail.needs_overworld_rain) parts.push('In rain');
    if (detail.turn_upside_down)     parts.push('(Hold device upside down)');
    if (detail.min_beauty)           parts.push('High Beauty');

    // Fallback if nothing was added
    if (!parts.length) {
      if (detail.min_happiness)  return 'High Friendship';
      return t ? _fmt(t) : 'Level up';
    }

    return parts.join(' ');
  }

  return t ? _fmt(t) : '';
}

/* Recursively flatten chain node into { name, id, trigger }[] rows */
function flattenChain(node, trigger) {
  const id  = idFromUrl(node.species.url);
  const me  = { name: node.species.name, id, trigger };
  if (!node.evolves_to.length) return [[me]];

  if (node.evolves_to.length === 1) {
    const next = node.evolves_to[0];
    const nextTrigger = triggerLabel(next.evolution_details[0]);
    return [[me], ...flattenChain(next, nextTrigger)];
  }
  /* Branching (e.g. Eevee) — collect siblings into one row */
  const siblings = node.evolves_to.map(n => ({
    name: n.species.name,
    id:   idFromUrl(n.species.url),
    trigger: triggerLabel(n.evolution_details[0]),
  }));
  return [[me], siblings];
}

/* ── Renderers ── */
function typeBadge(type, large = false) {
  const bg = TC[type] || '#777';
  const cls = large ? 'drawer-type-badge' : 'matchup-chip';
  return `<span class="${cls}" style="background:${bg}">${type}</span>`;
}

function statColor(val) {
  if (val >= 130) return '#4caf50';
  if (val >= 100) return '#8bc34a';
  if (val >= 70)  return '#ffc107';
  if (val >= 50)  return '#ff9800';
  return '#ef5350';
}

function renderStats(poke) {
  const labels = { hp:'HP', attack:'Attack', defense:'Defense',
                   'special-attack':'Sp. Atk', 'special-defense':'Sp. Def', speed:'Speed' };
  return poke.stats.map(s => {
    const name = s.stat.name;
    const val  = s.base_stat;
    const pct  = Math.min(Math.round((val / 255) * 100), 100);
    const col  = statColor(val);
    return `<div class="stat-row">
      <span class="stat-name">${labels[name] || name}</span>
      <span class="stat-val" style="color:${col}">${val}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%;background:${col}"></div></div>
    </div>`;
  }).join('');
}

function renderMatchups(types) {
  const m = calcMatchups(types);
  const rows = [
    { key:4,    label:'4× weak (quad)' },
    { key:2,    label:'2× weak' },
    { key:0.5,  label:'½ resistant' },
    { key:0.25, label:'¼ resistant (quad)' },
    { key:0,    label:'Immune' },
  ];
  return rows.filter(r => m[r.key]?.length).map(r =>
    `<div class="matchup-group">
      <div class="matchup-label">${r.label}</div>
      <div class="matchup-chips">${m[r.key].map(t => typeBadge(t)).join('')}</div>
    </div>`
  ).join('') || '<p style="font-size:12px;color:var(--text-dim)">No notable matchups</p>';
}

function evoNodeHTML(node, currentId, branchTrigger = null) {
  const sprite    = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${node.id}.png`;
  const isCurrent = node.id === currentId ? ' current' : '';
  // In a branch, show each Pokémon's own trigger under its sprite
  const triggerHtml = branchTrigger
    ? `<span class="evo-trigger evo-trigger-inline">${branchTrigger}</span>`
    : '';
  return `<div class="evo-node${isCurrent}" onclick="openDetailDrawer(${node.id},'${node.name}')">
    <img class="evo-sprite" src="${sprite}" alt="${node.name}" loading="lazy">
    <span class="evo-name">${node.name.replace(/-/g,' ')}</span>
    ${triggerHtml}
  </div>`;
}

function renderEvoChain(rows, currentId) {
  let html = '<div class="evo-chain">';
  rows.forEach((row, i) => {
    const isBranch = Array.isArray(row) && row.length > 1;

    if (i > 0) {
      // For linear steps, show trigger on the arrow
      // For branches, just show the arrow — each sibling shows its own trigger
      const trigger = isBranch ? '' : (Array.isArray(row) ? row[0]?.trigger : row.trigger);
      html += `<div class="evo-step">
        <span class="evo-arrow">&#10140;</span>
        ${trigger ? `<span class="evo-trigger">${trigger}</span>` : ''}
      </div>`;
    }

    if (isBranch) {
      // Each branch sibling carries its own trigger label
      html += `<div class="evo-branch">${
        row.map(n => evoNodeHTML(n, currentId, n.trigger)).join('')
      }</div>`;
    } else {
      const node = Array.isArray(row) ? row[0] : row;
      html += evoNodeHTML(node, currentId);
    }
  });
  html += '</div>';
  return html;
}

function renderAbilities(poke) {
  return `<div class="ability-list">${poke.abilities.map(a =>
    `<div class="ability-item">
      <span class="ability-name">${a.ability.name.replace(/-/g,' ')}</span>
      ${a.is_hidden ? '<span class="ability-hidden">(Hidden)</span>' : ''}
    </div>`
  ).join('')}</div>`;
}

function renderLocations(areas) {
  const gameVersions = window.GAME_VERSIONS || [];

  /* Filter to only encounters in the current game's versions.
     If no version list is available (e.g. Pokémon GO, index page),
     fall back to showing all locations. */
  const filtered = gameVersions.length
    ? areas.filter(a =>
        a.version_details.some(vd => gameVersions.includes(vd.version.name))
      )
    : areas;

  if (!filtered.length) {
    if (gameVersions.length && areas.length) {
      return '<p style="font-size:12px;color:var(--text-dim)">Not found in the wild in this game — trade, evolve, transfer, or event only.</p>';
    }
    return '<p style="font-size:12px;color:var(--text-dim)">Not found in the wild — trade, evolve, or event only.</p>';
  }

  /* Deduplicate and clean up area names (max 12) */
  const names = [...new Set(
    filtered.slice(0, 12).map(a => a.location_area.name.replace(/-area$/, '').replace(/-/g, ' '))
  )];

  return `<div class="location-list">${names.map(n =>
    `<span class="location-chip">${n}</span>`
  ).join('')}</div>`;
}

/* ── Catch Rate Calculator ── */
const BALL_OPTS = [
  { value:'1',   label:'Pok\u00e9 Ball \u00d71' },
  { value:'1.5', label:'Great Ball \u00d71.5' },
  { value:'2',   label:'Ultra Ball \u00d72' },
  { value:'5',   label:'Quick Ball \u00d75 (turn 1)' },
  { value:'3.5', label:'Net / Repeat / Dive \u00d73.5' },
  { value:'3',   label:'Dusk Ball \u00d73 (cave/night)' },
  { value:'999', label:'Master Ball (guaranteed)' },
];
const STATUS_OPTS = [
  { value:'1',   label:'No status' },
  { value:'2.5', label:'Sleep / Freeze \u00d72.5' },
  { value:'1.5', label:'Paralysis / Burn / Poison \u00d71.5' },
];

/* Stored so _crUpdate() closure can access after render */
let _crRate = 45;

function _calcCatchProb(captureRate, ballMult, statusMult, hpPct) {
  if (parseFloat(ballMult) >= 999) return 1.0;
  const bm = parseFloat(ballMult);
  const sm = parseFloat(statusMult);
  const hp = parseFloat(hpPct) / 100;
  const a  = Math.min(255, Math.max(1, Math.floor((3 - 2 * hp) / 3 * captureRate * bm * sm)));
  const shake = 65536 / Math.pow(255 / a, 0.1875);
  return Math.min(1, Math.pow(shake / 65536, 4));
}

window._crUpdate = function() {
  const ball   = document.getElementById('cr-ball')?.value   || '1';
  const status = document.getElementById('cr-status')?.value || '1';
  const hpVal  = document.getElementById('cr-hp')?.value     || '50';
  const hpDisp = document.getElementById('cr-hp-val');
  if (hpDisp) hpDisp.textContent = `${hpVal}%`;
  const prob   = _calcCatchProb(_crRate, ball, status, hpVal);
  const pct    = (prob * 100).toFixed(1);
  const throws = prob > 0 ? (1 / prob).toFixed(1) : '\u221e';
  const cls    = prob >= 0.5 ? 'great' : prob >= 0.15 ? 'ok' : 'hard';
  const resEl  = document.getElementById('cr-result');
  if (resEl) resEl.innerHTML = `
    <div class="cr-pct ${cls}">${pct}%</div>
    <div>
      <div class="cr-throws">\u2248 <strong>${throws}</strong> throws on average</div>
      <div class="cr-base">Base catch rate: ${_crRate}/255</div>
    </div>`;
};

function buildCatchRateHTML(captureRate) {
  _crRate = captureRate;
  const ballOpts   = BALL_OPTS  .map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  const statusOpts = STATUS_OPTS.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  return `
    <div class="cr-row">
      <span class="cr-label">Ball</span>
      <select class="cr-select" id="cr-ball" onchange="_crUpdate()">${ballOpts}</select>
    </div>
    <div class="cr-row">
      <span class="cr-label">Status</span>
      <select class="cr-select" id="cr-status" onchange="_crUpdate()">${statusOpts}</select>
    </div>
    <div class="cr-row">
      <span class="cr-label">Target HP</span>
      <input class="cr-slider" id="cr-hp" type="range" min="1" max="100" value="50" oninput="_crUpdate()">
      <span class="cr-slider-val" id="cr-hp-val">50%</span>
    </div>
    <div class="cr-result" id="cr-result"></div>`;
}

/* ── Drawer DOM helpers ── */
function getDrawer()   { return document.getElementById('poke-drawer'); }
function getBackdrop() { return document.getElementById('drawer-backdrop'); }

window.closeDetailDrawer = function closeDetailDrawer() {
  getDrawer()?.classList.remove('open');
  getBackdrop()?.classList.remove('open');
  document.removeEventListener('keydown', _escHandler);
}

function _escHandler(e) {
  if (e.key === 'Escape') closeDetailDrawer();
}

/* ── Main entry point ── */
window.openDetailDrawer = async function openDetailDrawer(pokemonId, _name, gameDexNumber = null) {
  const drawer   = getDrawer();
  const backdrop = getBackdrop();
  const scroll   = drawer.querySelector('.drawer-scroll');
  if (!drawer || !scroll) return;

  /* Show drawer with spinner */
  scroll.innerHTML = `<div class="drawer-loading"><div class="drawer-spinner"></div><span>Loading…</span></div>`;
  drawer.classList.add('open');
  backdrop.classList.add('open');
  document.addEventListener('keydown', _escHandler);

  /* Play Pokémon cry (unless muted) */
  playCry(pokemonId);

  try {
    /* Parallel fetch: pokemon + species */
    const [poke, species] = await Promise.all([
      apiFetch(`${API}/pokemon/${pokemonId}`),
      apiFetch(`${API}/pokemon-species/${pokemonId}`),
    ]);

    /* Evolution chain + encounter locations (non-blocking) */
    const [evoData, locations] = await Promise.all([
      apiFetch(species.evolution_chain.url).catch(() => null),
      apiFetch(`${API}/pokemon/${pokemonId}/encounters`).catch(() => []),
    ]);


    const gameGen = window.GAME_GEN || 0;
    const types = getTypesForGen(poke, gameGen);

    const spriteNormal = poke.sprites.front_default;
    const spriteShiny  = poke.sprites.front_shiny;
    const height = (poke.height  / 10).toFixed(1) + ' m';
    const weight = (poke.weight  / 10).toFixed(1) + ' kg';
    const captureRate = species.capture_rate;

    /* Pokédex flavor text — prefer an entry from this game, fall back to latest English */
    const gameVersions = window.GAME_VERSIONS || [];
    const enEntries = species.flavor_text_entries.filter(e => e.language.name === 'en');
    const gameEntry  = enEntries.find(e => gameVersions.includes(e.version.name));
    const flavor = (gameEntry || enEntries[enEntries.length - 1])
      ?.flavor_text.replace(/[\u000c\n\r]/g, ' ') || '';

    /* Evolution chain */
    const evoRows = evoData ? flattenChain(evoData.chain, '') : [[{name: poke.name, id: pokemonId, trigger:''}]];
    // Apply generation-accurate evolution corrections (overwrites PokéAPI data where needed)
    if (typeof applyEvoCorrections === 'function') applyEvoCorrections(evoRows, window.GAME_GEN);

    /* Build HTML */
    scroll.innerHTML = `
      <!-- Hero -->
      <div class="drawer-hero">
        <div class="drawer-sprite-wrap">
          <img id="drawer-sprite-img" class="drawer-sprite"
               src="${spriteNormal}" alt="${poke.name}"
               onerror="this.style.opacity=0.2">
          ${spriteShiny ? `<button class="drawer-shiny-toggle" id="drawer-shiny-btn" title="Toggle shiny sprite">✨</button>` : ''}
        </div>
        <div class="drawer-info">
          <div class="drawer-num">${(() => {
            const nat = `#${String(poke.id).padStart(4,'0')}`;
            if (gameDexNumber && Number(gameDexNumber) !== Number(poke.id)) {
              const gameDex = `#${String(Number(gameDexNumber)).padStart(3,'0')}`;
              return `${gameDex} <span style="opacity:.75;font-size:12px;">(Game Dex)</span> <span style="opacity:.55;">·</span> ${nat} <span style="opacity:.75;font-size:12px;">(National)</span>`;
            }
            return nat;
          })()}</div>
          <div class="drawer-name">${poke.name.replace(/-/g,' ')}</div>
          <div class="drawer-types">${types.map(t => typeBadge(t, true)).join('')}</div>
          <div class="drawer-meta">
            <span>&#x2195; ${height}</span>
            <span>&#x2696; ${weight}</span>
            <span>&#127381; ${captureRate}/255</span>
          </div>
        </div>
      </div>

      <!-- Pokédex entry -->
      <div class="drawer-section">
        <div class="drawer-section-title">Pokédex Entry</div>
        <p class="drawer-flavor">${flavor}</p>
      </div>

      <!-- Base stats -->
      <div class="drawer-section">
        <div class="drawer-section-title">Base Stats</div>
        ${renderStats(poke)}
      </div>

      <!-- Type matchups -->
      <div class="drawer-section">
        <div class="drawer-section-title">Type Matchups</div>
        ${genAccuracyNote(gameGen)}
        ${renderMatchups(types)}
      </div>

      <!-- Evolution chain -->
      <div class="drawer-section">
        <div class="drawer-section-title">Evolution Chain</div>
        ${renderEvoChain(evoRows, pokemonId)}
      </div>

      <!-- Abilities -->
      <div class="drawer-section">
        <div class="drawer-section-title">Abilities</div>
        ${renderAbilities(poke)}
      </div>

      <!-- Encounter locations -->
      <div class="drawer-section">
        <div class="drawer-section-title">Encounter Locations</div>
        ${renderLocations(locations)}
      </div>

      <!-- Stats tracker (injected by stat-tracker.js) -->
      <div id="stats-tracker-anchor"
           data-base-hp="${poke.stats.find(s => s.stat.name === 'hp')?.base_stat || 0}"
           data-base-attack="${poke.stats.find(s => s.stat.name === 'attack')?.base_stat || 0}"
           data-base-defense="${poke.stats.find(s => s.stat.name === 'defense')?.base_stat || 0}"
           data-base-sp_attack="${poke.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0}"
           data-base-sp_defense="${poke.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0}"
           data-base-speed="${poke.stats.find(s => s.stat.name === 'speed')?.base_stat || 0}"></div>

      <!-- Catch rate calculator -->
      <div class="drawer-section">
        <div class="drawer-section-title">&#127381; Catch Rate Calculator</div>
        ${buildCatchRateHTML(captureRate)}
      </div>
    `;

    // Explicitly inject tracker (observer in stat-tracker.js is fallback)
    if (typeof window.injectStatsTracker === 'function') {
      window.injectStatsTracker(pokemonId);
    }

    /* Wire up shiny sprite toggle */
    document.getElementById('drawer-shiny-btn')?.addEventListener('click', () => {
      const img = document.getElementById('drawer-sprite-img');
      const btn = document.getElementById('drawer-shiny-btn');
      const isShiny = btn.classList.toggle('active');
      img.src = isShiny ? spriteShiny : spriteNormal;
    });

    /* Initial catch rate render */
    _crUpdate();

  } catch (err) {
    scroll.innerHTML = `<div class="drawer-loading"><p style="color:#ef5350;font-size:13px">Failed to load. Check your connection and try again.</p></div>`;
    console.error('[detail-drawer]', err);
  }
}


/* ── Pokémon Cry Player ──────────────────────────────────────────────────
   Uses PokéAPI's hosted OGG cries. Respects a mute toggle stored in
   localStorage so the user can silence it if they want.
*/
let _currentCry = null;

function playCry(pokemonId) {
  if (localStorage.getItem('cries_muted') === 'true') return;
  const url = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
  if (_currentCry) { _currentCry.pause(); _currentCry = null; }
  const audio = new Audio(url);
  audio.volume = 0.5;
  _currentCry  = audio;
  audio.play().catch(() => {}); // ignore autoplay policy errors silently
}

function toggleCryMute() {
  const muted = localStorage.getItem('cries_muted') === 'true';
  localStorage.setItem('cries_muted', String(!muted));
  const btn = document.getElementById('cry-mute-btn');
  if (btn) btn.textContent = !muted ? '🔇' : '🔊';
}

window.playCry        = playCry;
window.toggleCryMute  = toggleCryMute;

/* ── Auto-init: wire up backdrop close on page load ── */
document.addEventListener('DOMContentLoaded', () => {
  getBackdrop()?.addEventListener('click', closeDetailDrawer);
});