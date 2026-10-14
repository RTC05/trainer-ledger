'use strict';

(function () {
  const GAME_ID = window.GAME_ID || document.querySelector('[data-v2-game-id]')?.dataset.v2GameId || 'firered-leafgreen';
  const STORAGE_KEY = `pokemon_tracker_v2_${GAME_ID}_guide_preview`;
  const STATE_ENDPOINT = `/api/v2/state/${GAME_ID}`;
  const DEFAULT_VERSION = window.GAME_VERSIONS?.[0] || document.querySelector('.v2-generic-version-toggle[data-version]')?.dataset.version || GAME_ID;
  const DEFAULT_RULES = { trades: false, pairedVersion: false, events: false };
  const PLATINUM_BADGES = ['coal', 'forest', 'cobble', 'fen', 'relic', 'mine', 'icicle', 'beacon'];
  const BLOCKER_BY_REQUIREMENT = {
    trade: 'Trade required',
    'paired-version': 'Other version required',
    event: 'Event only',
  };

  const grid = document.getElementById('v2-card-grid') || document.getElementById('v2-generic-card-grid');
  const search = document.getElementById('v2-search') || document.getElementById('v2-generic-search');
  const chips = [...document.querySelectorAll('.v2-chip[data-filter]')];
  const cards = [...document.querySelectorAll('.v2-pokemon-card')];
  const versionToggles = [...document.querySelectorAll('.v2-version-toggle[data-version]')];
  const choiceToggles = [...document.querySelectorAll('.v2-choice-toggle[data-choice-kind]')];
  const choiceClearButtons = [...document.querySelectorAll('[data-clear-choice]')];
  const ruleToggles = [...document.querySelectorAll('.v2-rule-toggle[data-rule]')];
  const statusButtons = [...document.querySelectorAll('[data-set-status]')];
  const resetButton = document.getElementById('v2-reset-run');
  const resetGuideButton = document.getElementById('v2-reset-guide');
  const chapterButtons = [...document.querySelectorAll('.v2-timeline-step[data-chapter-id]')];
  const chapterPanels = [...document.querySelectorAll('.v2-chapter[data-chapter-panel]')];
  const guideChecks = [...document.querySelectorAll('.v2-guide-step-check[data-step-id]')];
  const targetCards = [...document.querySelectorAll('.v2-target-card[data-target-dex]')];
  const targetChecks = [...document.querySelectorAll('.v2-target-caught[data-target-dex]')];
  const targetOpenButtons = [...document.querySelectorAll('[data-target-open]')];
  const targetInfoButtons = [...document.querySelectorAll('[data-target-info]')];
  const targetFilterToggles = [...document.querySelectorAll('[data-target-filter-toggle]')];
  const tabButtons = [...document.querySelectorAll('.v2-tab[data-v2-tab]')];
  const tabPanels = [...document.querySelectorAll('.v2-tab-panel[data-v2-panel]')];
  const pokedexCaughtChecks = [...document.querySelectorAll('[data-pokedex-caught]')];
  const itemChecks = [...document.querySelectorAll('.v2-item-check[data-item-id]')];
  const infoButtons = [...document.querySelectorAll('[data-pokedex-info]')];
  const typeModeButtons = [...document.querySelectorAll('.v2-type-mode[data-type-mode]')];
  const typeSearch = document.getElementById('v2-type-search');
  const typeGrid = document.getElementById('v2-type-grid');
  const typeRows = [...document.querySelectorAll('.v2-type-row[data-type-name]')];
  const guideApp = document.querySelector('[data-v2-guide-app]');
  const openGuideButtons = [...document.querySelectorAll('[data-open-v2-guide]')];
  const guideModeToggles = [...document.querySelectorAll('[data-guide-mode-toggle]')];
  const gameSearch = document.getElementById('v2-game-search');
  const gameFilterButtons = [...document.querySelectorAll('[data-game-filter]')];
  const gameCards = [...document.querySelectorAll('[data-v2-game-card]')];
  const platinumCurrentLocation = document.getElementById('v2-platinum-current-location');
  const platinumCatchProgress = document.getElementById('v2-platinum-catch-progress');
  const platinumCatchProgressCopy = document.getElementById('v2-platinum-catch-progress-copy');
  const platinumCatchProgressFill = document.getElementById('v2-platinum-catch-progress-fill');
  const platinumBadgeProgress = document.getElementById('v2-platinum-badge-progress');
  const platinumBadgeButtons = [...document.querySelectorAll('[data-platinum-badge]')];

  const runSetup = document.getElementById('v2-run-setup');
  const dexOwnedCount = document.getElementById('v2-dex-owned-count');
  const guideStepCount = document.getElementById('v2-guide-step-count');
  const ownedCount = document.getElementById('v2-owned-count');
  const catchableCount = document.getElementById('v2-catchable-count');
  const blockedCount = document.getElementById('v2-blocked-count');
  const reviewCaught = document.getElementById('v2-review-caught');
  const reviewCatchable = document.getElementById('v2-review-catchable');
  const reviewChapters = document.getElementById('v2-review-chapters');
  const reviewItems = document.getElementById('v2-review-items');
  const reviewBlockers = document.getElementById('v2-review-blockers');
  const nextTarget = document.getElementById('v2-next-target');
  const nextMethod = document.getElementById('v2-next-method');

  const detailName = document.getElementById('v2-detail-name');
  const detailSummary = document.getElementById('v2-detail-summary');
  const detailStatus = document.getElementById('v2-detail-status');
  const detailTypes = document.getElementById('v2-detail-types');
  const detailMethod = document.getElementById('v2-detail-method');
  const detailBlocker = document.getElementById('v2-detail-blocker');
  const detailVersion = document.getElementById('v2-detail-version');

  let activeFilter = 'all';
  let activeGameFilter = 'all';
  let selectedCard = cards.find(card => card.dataset.status === 'blocked') || cards[0];
  let runState = loadRunState();
  let activeBadges = PLATINUM_BADGES.map(badgeId => Boolean(runState.gymBadges?.[badgeId]));
  let persistTimer = null;

  function syncBadgeButtonsFromState() {
    if (!platinumBadgeButtons.length) return;
    platinumBadgeButtons.forEach((button, index) => {
      const isActive = Boolean(activeBadges[index]);
      button.classList.toggle('is-earned', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    if (platinumBadgeProgress) {
      platinumBadgeProgress.textContent = `${activeBadges.filter(Boolean).length}/${PLATINUM_BADGES.length}`;
    }
  }

  function handleBadgeClick(index) {
    if (index < 0 || index >= PLATINUM_BADGES.length) return;
    const updated = [...activeBadges];
    updated[index] = !updated[index];
    activeBadges = updated;
    if (!runState.gymBadges) runState.gymBadges = {};
    PLATINUM_BADGES.forEach((badgeId, badgeIndex) => {
      runState.gymBadges[badgeId] = Boolean(activeBadges[badgeIndex]);
    });
    saveRunState();
    syncBadgeButtonsFromState();
  }

  platinumBadgeButtons.forEach((button, index) => {
    button.addEventListener('click', () => handleBadgeClick(index));
  });

  syncBadgeButtonsFromState();

  if (!grid || !search || !cards.length) return;

  function loadRunState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        rules: { ...DEFAULT_RULES, ...(parsed.rules || {}) },
        version: parsed.version || DEFAULT_VERSION,
        starter: parsed.starterConfirmed ? parsed.starter || null : null,
        starterConfirmed: Boolean(parsed.starterConfirmed),
        fossil: parsed.fossilConfirmed ? parsed.fossil || null : null,
        fossilConfirmed: Boolean(parsed.fossilConfirmed),
        statuses: parsed.statuses || {},
        completedSteps: parsed.completedSteps || {},
        targetFilters: parsed.targetFilters || {},
        checkedItems: parsed.checkedItems || {},
        gymBadges: parsed.gymBadges || {},
        selectedChapter: parsed.selectedChapter || chapterButtons[0]?.dataset.chapterId || null,
        guideEnabled: parsed.guideEnabled !== false,
        activeTab: parsed.activeTab === 'counters' ? 'type-chart' : parsed.activeTab || 'guide',
      };
    } catch {
      return {
        rules: { ...DEFAULT_RULES },
        version: DEFAULT_VERSION,
        starter: null,
        starterConfirmed: false,
        fossil: null,
        fossilConfirmed: false,
        statuses: {},
        completedSteps: {},
        targetFilters: {},
        checkedItems: {},
        gymBadges: {},
        selectedChapter: chapterButtons[0]?.dataset.chapterId || null,
        guideEnabled: true,
        activeTab: 'guide',
      };
    }
  }

  function saveRunState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runState));
    scheduleServerSave();
  }

  function mergeRunState(remoteState, localState) {
    const merged = { ...(remoteState || {}), ...(localState || {}) };
    ['rules', 'statuses', 'completedSteps', 'targetFilters', 'checkedItems', 'gymBadges'].forEach(key => {
      merged[key] = { ...((remoteState && remoteState[key]) || {}), ...((localState && localState[key]) || {}) };
    });
    return merged;
  }

  async function loadServerState() {
    try {
      const response = await fetch(STATE_ENDPOINT, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (!response.ok) return;
      const payload = await response.json();
      const remoteState = payload?.state || {};
      if (!Object.keys(remoteState).length) return;
      runState = mergeRunState(remoteState, runState);
      refreshPreview();
    } catch {
      // Local preview remains usable for guests or offline sessions.
    }
  }

  function scheduleServerSave() {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(async () => {
      try {
        await fetch(STATE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ state: runState }),
        });
      } catch {
        // Local-only fallback stays valid.
      }
    }, 250);
  }

  function titleCase(value) {
    return String(value || '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function displayChoice(value) {
    if (!value) return 'Pending';
    if (value === 'firered') return 'FireRed';
    if (value === 'leafgreen') return 'LeafGreen';
    if (value === 'dome') return 'Dome';
    if (value === 'helix') return 'Helix';
    return titleCase(value);
  }

  function requirementsFor(card) {
    return (card.dataset.requirements || '').split(',').filter(Boolean);
  }

  function availableVersionsFor(card) {
    return (card.dataset.availableVersions || 'firered,leafgreen').split(',').filter(Boolean);
  }

  function targetAvailableVersionsFor(target) {
    const explicit = (target.dataset.targetVersions || '').split(',').filter(Boolean);
    if (explicit.length) return explicit;
    const linkedCard = cardByDex(target.dataset.targetDex);
    return linkedCard ? availableVersionsFor(linkedCard) : ['firered', 'leafgreen'];
  }

  function starterForDex(dex) {
    if ([1, 2, 3].includes(Number(dex))) return 'bulbasaur';
    if ([4, 5, 6].includes(Number(dex))) return 'charmander';
    if ([7, 8, 9].includes(Number(dex))) return 'squirtle';
    return null;
  }

  function dexForStarter(starter) {
    if (starter === 'bulbasaur') return '1';
    if (starter === 'charmander') return '4';
    if (starter === 'squirtle') return '7';
    return null;
  }

  function isFirstStageStarterDex(dex) {
    return ['1', '4', '7'].includes(String(dex));
  }

  function isTargetRelevant(target) {
    const targetStarter = target.dataset.targetStarter;
    if (targetStarter && runState.starter && targetStarter !== runState.starter) return false;
    const versions = targetAvailableVersionsFor(target);
    return !versions.length || versions.includes(runState.version);
  }

  function fossilForDex(dex) {
    if ([138, 139].includes(Number(dex))) return 'helix';
    if ([140, 141].includes(Number(dex))) return 'dome';
    return null;
  }

  function isRequirementSatisfied(requirement) {
    if (requirement === 'trade') return runState.rules.trades;
    if (requirement === 'paired-version') return runState.rules.pairedVersion;
    if (requirement === 'event') return runState.rules.events;
    return false;
  }

  function ruleBlocker(card) {
    const starter = starterForDex(card.dataset.dex);
    if (starter && !runState.starter) {
      return 'Starter pending';
    }
    if (starter && starter !== runState.starter && !runState.rules.trades) {
      return 'Starter locked';
    }

    const fossil = fossilForDex(card.dataset.dex);
    if (fossil && !runState.fossil) {
      return 'Fossil choice pending';
    }
    if (fossil && fossil !== runState.fossil) {
      return 'Fossil choice';
    }

    const versions = availableVersionsFor(card);
    if (versions.length && !versions.includes(runState.version) && !runState.rules.pairedVersion) {
      const versionLabel = versions.map(titleCase).join(' / ');
      return `${versionLabel} exclusive`;
    }
    const unmet = requirementsFor(card).find(req => !isRequirementSatisfied(req));
    return unmet ? (BLOCKER_BY_REQUIREMENT[unmet] || titleCase(unmet)) : '';
  }

  function defaultStatusFor(card) {
    const blocker = ruleBlocker(card);
    if (blocker) return 'blocked';
    const baseStatus = card.dataset.baseStatus || 'catchable';
    const starter = starterForDex(card.dataset.dex);
    if (starter && starter === runState.starter) {
      return 'catchable';
    }
    if (starter && starter !== runState.starter && runState.rules.trades) {
      return 'catchable';
    }
    const fossil = fossilForDex(card.dataset.dex);
    if (fossil && fossil === runState.fossil) return 'catchable';
    if (baseStatus === 'blocked' && requirementsFor(card).length) return 'catchable';
    return baseStatus === 'blocked' && card.dataset.baseBlocker ? 'blocked' : baseStatus;
  }

  function visibleCards() {
    return cards.filter(card => !card.classList.contains('hidden'));
  }

  function cardByDex(dex) {
    return cards.find(card => card.dataset.dex === String(dex));
  }

  function isOwnedStatus(status) {
    return status === 'owned' || status === 'caught';
  }

  function totalGuideSteps() {
    return guideChecks.length;
  }

  function completedGuideSteps() {
    return guideChecks.filter(stepDone).length;
  }

  function stepDone(check) {
    if (check.dataset.stepId === 'pallet-pick-starter') return Boolean(runState.starter);
    if (check.dataset.stepId === 'mtmoon-pick-fossil') return Boolean(runState.fossil);
    return Boolean(runState.completedSteps[check.dataset.stepId]);
  }

  function requiredChecksForChapter(chapterId) {
    return guideChecks.filter(check => (
      check.dataset.chapterId === chapterId && check.dataset.stepRequired !== 'false'
    ));
  }

  function requiredItemsForChapter(chapterId) {
    return itemChecks.filter(check => (
      check.dataset.chapterId === chapterId && check.dataset.itemRequired !== 'false'
    ));
  }

  function requiredChapterComplete(chapterId) {
    const checks = requiredChecksForChapter(chapterId);
    const items = requiredItemsForChapter(chapterId);
    const checksComplete = checks.length > 0 && checks.every(stepDone);
    const itemsComplete = items.every(check => Boolean(runState.checkedItems[check.dataset.itemId]));
    return checksComplete && itemsComplete;
  }

  function nextChapterId(chapterId) {
    const index = chapterButtons.findIndex(button => button.dataset.chapterId === chapterId);
    return index >= 0 ? chapterButtons[index + 1]?.dataset.chapterId || null : null;
  }

  function maybeAdvanceGuide(chapterId) {
    if (!requiredChapterComplete(chapterId)) return;
    const next = nextChapterId(chapterId);
    if (!next) return;
    window.setTimeout(() => {
      runState.selectedChapter = next;
      saveRunState();
      syncGuide();
      activeChapterPanel()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 220);
  }

  function completedItems() {
    return new Set(
      itemChecks
        .filter(check => Boolean(runState.checkedItems[check.dataset.itemId]))
        .map(check => check.dataset.itemId)
    ).size;
  }

  function validActiveTab() {
    const fallback = runState.guideEnabled ? 'guide' : 'pokedex';
    const exists = tabButtons.some(button => (
      button.dataset.v2Tab === runState.activeTab && (runState.guideEnabled || button.dataset.v2Tab !== 'guide')
    ));
    return exists ? runState.activeTab : fallback;
  }

  function activeChapterId() {
    const fallback = chapterButtons[0]?.dataset.chapterId || null;
    const exists = chapterButtons.some(button => button.dataset.chapterId === runState.selectedChapter);
    return exists ? runState.selectedChapter : fallback;
  }

  function activeChapterPanel() {
    return chapterPanels.find(panel => panel.dataset.chapterPanel === activeChapterId()) || chapterPanels[0] || null;
  }

  function setCardStatus(card, status) {
    card.dataset.status = status;
    card.classList.remove('status-caught', 'status-owned', 'status-catchable', 'status-blocked');
    card.classList.add(`status-${status}`);
  }

  function setCardBlocker(card, blocker) {
    card.dataset.displayBlocker = blocker;
    card.dataset.blocker = blocker.toLowerCase();
    const existing = card.querySelector('.v2-card-blocker, .v2-card-ready');
    if (!existing) return;
    existing.textContent = blocker || 'In play';
    existing.className = blocker ? 'v2-card-blocker' : 'v2-card-ready';
  }

  function applyStatusToCard(card, status) {
    if (!card) return;
    runState.statuses[card.dataset.dex] = status;
    saveRunState();
    setCardStatus(card, status);
    if (status !== 'blocked') {
      setCardBlocker(card, '');
    } else if (!card.dataset.displayBlocker) {
      setCardBlocker(card, 'Manually blocked');
    }
  }

  function applyStarterChoice(starter) {
    const previousDex = dexForStarter(runState.starter);
    runState.starter = starter;
    runState.starterConfirmed = true;
    const nextDex = dexForStarter(starter);
    if (previousDex && previousDex !== nextDex) {
      delete runState.statuses[previousDex];
    }
    if (nextDex) {
      runState.statuses[nextDex] = 'caught';
    }
    runState.completedSteps['pallet-pick-starter'] = true;
    saveRunState();
  }

  function clearStarterChoice() {
    const previousDex = dexForStarter(runState.starter);
    if (previousDex) {
      delete runState.statuses[previousDex];
    }
    runState.starter = null;
    runState.starterConfirmed = false;
    delete runState.completedSteps['pallet-pick-starter'];
    saveRunState();
  }

  function clearStatusForCard(card) {
    if (!card) return;
    delete runState.statuses[card.dataset.dex];
    saveRunState();
    reconcileCard(card);
  }

  function reconcileCard(card) {
    const dex = card.dataset.dex;
    const ruleDrivenBlocker = ruleBlocker(card);
    const savedStatus = runState.statuses[dex];
    const baseBlocker = card.dataset.baseBlocker || '';
    const blocker = ruleDrivenBlocker || (card.dataset.baseStatus === 'blocked' ? baseBlocker : '');
    const status = ruleDrivenBlocker
      ? 'blocked'
      : savedStatus || defaultStatusFor(card);

    setCardBlocker(card, status === 'blocked' ? blocker : '');
    setCardStatus(card, status);
  }

  function reconcileCards() {
    cards.forEach(reconcileCard);
  }

  function syncPokedexCaughtChecks() {
    pokedexCaughtChecks.forEach(check => {
      const card = cardByDex(check.dataset.pokedexCaught);
      if (!card) return;
      const starter = starterForDex(card.dataset.dex);
      const canChooseStarter = isFirstStageStarterDex(card.dataset.dex) && (!runState.starter || starter === runState.starter);
      const blocked = card.dataset.status === 'blocked' && !canChooseStarter;
      const caught = card.dataset.status === 'caught';
      check.checked = caught;
      check.disabled = blocked;
      check.closest('.v2-card-caught')?.classList.toggle('disabled', blocked);
      check.closest('.v2-card-caught')?.classList.toggle('checked', caught);
    });
  }

  function syncGuideSteps() {
    guideChecks.forEach(check => {
      const done = stepDone(check);
      check.checked = done;
      check.closest('.v2-guide-step')?.classList.toggle('done', done);
    });
  }

  function syncItems() {
    itemChecks.forEach(check => {
      const done = Boolean(runState.checkedItems[check.dataset.itemId]);
      check.checked = done;
      check.closest('.v2-item-card')?.classList.toggle('done', done);
    });
  }

  function syncTabs() {
    const active = validActiveTab();
    runState.activeTab = active;
    tabButtons.forEach(button => {
      const isGuideTab = button.dataset.v2Tab === 'guide';
      button.classList.toggle('guide-disabled', isGuideTab && !runState.guideEnabled);
      button.disabled = isGuideTab && !runState.guideEnabled;
    });
    tabButtons.forEach(button => button.classList.toggle('active', button.dataset.v2Tab === active));
    tabPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.v2Panel === active));
  }

  function syncGuideMode() {
    guideModeToggles.forEach(toggle => {
      toggle.classList.toggle('active', runState.guideEnabled);
      const label = toggle.querySelector('strong');
      if (label) label.textContent = runState.guideEnabled ? 'On' : 'Off';
    });
    if (!runState.guideEnabled && runState.activeTab === 'guide') {
      runState.activeTab = 'pokedex';
    }
    syncTabs();
  }

  function syncGuideChapters() {
    const selected = activeChapterId();
    chapterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.chapterId === selected);
    });
    chapterPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.chapterPanel === selected);
    });
  }

  function guideTargetsFor(chapterId = activeChapterId()) {
    return targetCards.filter(card => card.dataset.targetChapter === chapterId);
  }

  function targetCaught(target) {
    const linkedCard = cardByDex(target.dataset.targetDex);
    return Boolean(linkedCard && linkedCard.dataset.status === 'caught');
  }

  function syncTargetFilters() {
    targetFilterToggles.forEach(toggle => {
      const chapterId = toggle.dataset.targetFilterToggle;
      const uncaughtOnly = Boolean(runState.targetFilters[chapterId]);
      toggle.classList.toggle('active', uncaughtOnly);
      toggle.setAttribute('aria-pressed', String(uncaughtOnly));
      toggle.textContent = uncaughtOnly ? 'Showing uncaught only' : 'Show uncaught only';
    });
  }

  function syncGuideTargets() {
    targetCards.forEach(target => {
      const linkedCard = cardByDex(target.dataset.targetDex);
      const status = linkedCard?.dataset.status || 'reference';
      const label = target.querySelector('[data-target-status]');
      const relevant = isTargetRelevant(target);
      const isStarterChoice = target.dataset.targetKind === 'starter';
      const uncaughtOnly = Boolean(runState.targetFilters[target.dataset.targetChapter]);
      const hideForFilter = uncaughtOnly && targetCaught(target);
      const statusText = isStarterChoice
        ? (runState.starter === target.dataset.targetStarter ? 'Selected starter' : 'Starter option')
        : `Status: ${titleCase(status)}`;

      target.classList.toggle('irrelevant', !relevant || hideForFilter);
      target.classList.toggle('owned', isOwnedStatus(status));
      target.classList.toggle('caught', status === 'caught');
      target.classList.toggle('blocked', !isStarterChoice && status === 'blocked');
      if (label) label.textContent = linkedCard
        ? statusText
        : 'Reference target: full data pending';
      target.querySelectorAll('.v2-target-caught').forEach(check => {
        check.checked = status === 'caught';
        check.disabled = !isStarterChoice && (status === 'blocked' || !relevant);
        check.closest('.v2-target-check')?.querySelector('span')?.replaceChildren(
          document.createTextNode(isStarterChoice ? 'choose' : 'caught')
        );
      });
    });
    syncTargetFilters();
  }

  function updateGuideStats() {
    const totalSteps = totalGuideSteps();
    const doneSteps = completedGuideSteps();
    if (guideStepCount) guideStepCount.textContent = `${doneSteps}/${totalSteps}`;

    chapterButtons.forEach(button => {
      const chapterId = button.dataset.chapterId;
      const checks = guideChecks.filter(check => check.dataset.chapterId === chapterId);
      const complete = checks.filter(stepDone).length;
      const requiredChecks = requiredChecksForChapter(chapterId);
      const requiredComplete = requiredChecks.filter(stepDone).length;
      const requiredItems = requiredItemsForChapter(chapterId);
      const requiredItemsComplete = requiredItems.filter(check => Boolean(runState.checkedItems[check.dataset.itemId])).length;
      const label = button.querySelector(`[data-chapter-progress="${chapterId}"]`);
      const localLabel = document.querySelector(`[data-local-step-count="${chapterId}"]`);
      const requiredTotal = requiredChecks.length + requiredItems.length;
      const completedTotal = requiredComplete + requiredItemsComplete;
      const value = `${completedTotal}/${requiredTotal}`;
      if (label) label.textContent = value;
      if (localLabel) localLabel.textContent = value;
      button.classList.toggle('complete', requiredTotal > 0 && completedTotal === requiredTotal);
      button.classList.toggle('started', completedTotal > 0 && completedTotal < requiredTotal);
    });

    chapterPanels.forEach(panel => {
      const chapterId = panel.dataset.chapterPanel;
      const targets = guideTargetsFor(chapterId).filter(isTargetRelevant);
      const owned = targets.filter(target => {
        const linkedCard = cardByDex(target.dataset.targetDex);
        return linkedCard && isOwnedStatus(linkedCard.dataset.status);
      }).length;
      const label = document.querySelector(`[data-target-count="${chapterId}"]`);
      if (label) label.textContent = `${owned}/${targets.length}`;
    });
  }

  function updateRunSummary() {
    const owned = cards.filter(card => isOwnedStatus(card.dataset.status)).length;
    const caught = cards.filter(card => card.dataset.status === 'caught').length;
    const catchable = cards.filter(card => card.dataset.status === 'catchable').length;
    const blocked = cards.filter(card => card.dataset.status === 'blocked').length;
    const reviewedChapters = chapterButtons.filter(button => requiredChapterComplete(button.dataset.chapterId)).length;
    const uniqueItemIds = new Set(itemChecks.map(check => check.dataset.itemId));
    const checkedItemIds = new Set(
      itemChecks
        .filter(check => Boolean(runState.checkedItems[check.dataset.itemId]))
        .map(check => check.dataset.itemId)
    );
    const blockerCounts = { version: 0, trade: 0, event: 0, starter: 0, fossil: 0 };
    cards.forEach(card => {
      if (card.dataset.status !== 'blocked') return;
      const blocker = (card.dataset.displayBlocker || card.dataset.baseBlocker || '').toLowerCase();
      if (blocker.includes('version')) blockerCounts.version += 1;
      else if (blocker.includes('trade')) blockerCounts.trade += 1;
      else if (blocker.includes('event')) blockerCounts.event += 1;
      else if (blocker.includes('starter')) blockerCounts.starter += 1;
      else if (blocker.includes('fossil')) blockerCounts.fossil += 1;
    });
    if (runSetup) {
      runSetup.textContent = `${displayChoice(runState.version)} · ${runState.starter ? displayChoice(runState.starter) : 'Starter pending'}`;
    }
    if (dexOwnedCount) {
      dexOwnedCount.textContent = `${owned}/${cards.length}`;
      dexOwnedCount.nextElementSibling.textContent = `${blocked} currently blocked`;
    }
    if (reviewCaught) reviewCaught.textContent = caught;
    if (reviewCatchable) reviewCatchable.textContent = catchable;
    if (reviewChapters) reviewChapters.textContent = `${reviewedChapters}/${chapterButtons.length}`;
    if (reviewItems) reviewItems.textContent = `${checkedItemIds.size}/${uniqueItemIds.size}`;
    if (reviewBlockers) reviewBlockers.textContent = blocked;
  }

  function syncPlatinumBadgeTracker() {
    activeBadges = PLATINUM_BADGES.map(badgeId => Boolean(runState.gymBadges?.[badgeId]));
    syncBadgeButtonsFromState();
  }

  function updatePlatinumSummary() {
    if (!platinumCurrentLocation && !platinumCatchProgress && !platinumBadgeProgress) return;

    const activeChapter = chapterButtons.find(button => button.dataset.chapterId === activeChapterId()) || chapterButtons[0] || null;
    const activeHeading = activeChapter?.querySelector('strong')?.textContent?.trim();
    if (platinumCurrentLocation) {
      platinumCurrentLocation.textContent = activeHeading || 'Sinnoh route plan';
    }

    const caught = cards.filter(card => card.dataset.status === 'caught').length;
    const total = cards.length;
    const percent = total ? Math.round((caught / total) * 100) : 0;
    if (platinumCatchProgress) platinumCatchProgress.textContent = `${caught}/${total}`;
    if (platinumCatchProgressCopy) platinumCatchProgressCopy.textContent = `${percent}% of the regional tracker caught`;
    if (platinumCatchProgressFill) platinumCatchProgressFill.style.width = `${percent}%`;

    syncPlatinumBadgeTracker();
  }

  function syncStarterGuidance() {
    const brockStepDetail = document.querySelector('[data-step-card="brock-review-team"] small');
    if (!brockStepDetail) return;
    const guidance = {
      bulbasaur: 'Bulbasaur is the smoothest Brock matchup. Review your team, but you usually do not need a special detour unless you want Route 22 completion.',
      charmander: 'Charmander is the hardest Brock starter. Consider extra levels and the optional Route 22 Mankey before you commit to the gym.',
      squirtle: 'Squirtle is comfortable into Brock. Review your team, then continue unless you want optional Mankey/Pikachu cleanup first.',
    };
    brockStepDetail.textContent = guidance[runState.starter] || 'Choose your starter in Pallet Town so this guidance can match your run.';
  }

  const GYM_RECOMMENDATIONS = {
    brock: [
      { dexes: ['1', '2', '3'], move: 'Vine Whip / Leech Seed', reason: 'Grass starter pressure is excellent into Brock.' },
      { dexes: ['7', '8', '9'], move: 'Bubble or Water Gun', reason: 'Water starter pressure is excellent into Brock.' },
      { dexes: ['56', '57'], move: 'Low Kick', reason: 'Route 22 Mankey is the best backup if Charmander needs help.' },
      { dexes: ['12'], move: 'Confusion', reason: 'Butterfree can help as a special attacker if you evolved the forest line.' },
    ],
    misty: [
      { dexes: ['1', '2', '3'], move: 'Vine Whip / Razor Leaf', reason: 'Bulbasaur line is the cleanest Water-gym answer.' },
      { dexes: ['25', '26'], move: 'ThunderShock / Thunderbolt', reason: 'Pikachu line gives Electric pressure into Staryu and Starmie.' },
      { dexes: ['43', '44', '45'], move: 'Absorb / Acid support', reason: 'FireRed Oddish line is useful Water-gym coverage.' },
      { dexes: ['69', '70', '71'], move: 'Vine Whip', reason: 'LeafGreen Bellsprout line is useful Water-gym coverage.' },
    ],
    'lt. surge': [
      { dexes: ['50', '51'], move: 'Dig / Magnitude', reason: 'Diglett line is the cleanest Electric-gym answer.' },
      { dexes: ['74', '75', '76'], move: 'Magnitude / Dig', reason: 'Geodude line resists Electric pressure if available in your run.' },
      { dexes: ['27', '28'], move: 'Dig', reason: 'Sandshrew line can cover Electric if you have LeafGreen/trade access.' },
    ],
    erika: [
      { dexes: ['4', '5', '6'], move: 'Ember / Flamethrower', reason: 'Charmander line is excellent into Grass.' },
      { dexes: ['16', '17', '18', '21', '22'], move: 'Flying-type attacks', reason: 'Early birds are practical Grass-gym answers.' },
      { dexes: ['12'], move: 'Confusion', reason: 'Butterfree can pressure Grass/Poison targets.' },
      { dexes: ['58', '59', '37', '38'], move: 'Fire-type attacks', reason: 'Version fire lines are strong Erika answers if available.' },
    ],
    koga: [
      { dexes: ['63', '64', '65'], move: 'Psybeam / Psychic', reason: 'Abra line is a strong Poison-gym answer if trained/traded.' },
      { dexes: ['96', '97'], move: 'Confusion / Psychic', reason: 'Drowzee line gives reliable Psychic pressure.' },
      { dexes: ['50', '51'], move: 'Dig / Magnitude', reason: 'Ground moves help into Poison targets.' },
    ],
    sabrina: [
      { dexes: ['143'], move: 'Body Slam / Shadow Ball if taught', reason: 'Snorlax is a strong special bulk option into Psychic pressure.' },
      { dexes: ['92', '93', '94'], move: 'Shadow Ball if taught', reason: 'Ghost line can help if you have the right move and trade access.' },
      { dexes: ['130'], move: 'Bite / strong physical attacks', reason: 'Gyarados can lean on physical pressure.' },
    ],
    blaine: [
      { dexes: ['7', '8', '9'], move: 'Surf / Water Pulse', reason: 'Squirtle line is the cleanest Fire-gym answer.' },
      { dexes: ['129', '130'], move: 'Surf / Water Pulse', reason: 'Gyarados is a strong Water option if you raised Magikarp.' },
      { dexes: ['131'], move: 'Surf', reason: 'Lapras is a strong Water/Ice option from Silph Co.' },
      { dexes: ['50', '51'], move: 'Dig / Magnitude', reason: 'Dugtrio can pressure Fire types with Ground moves.' },
    ],
    giovanni: [
      { dexes: ['7', '8', '9'], move: 'Surf / Water Pulse', reason: 'Water starter line is excellent into Ground.' },
      { dexes: ['1', '2', '3'], move: 'Razor Leaf / Giga Drain', reason: 'Grass starter line pressures Ground/Rock targets.' },
      { dexes: ['131'], move: 'Surf / Ice Beam', reason: 'Lapras gives Water coverage and useful bulk.' },
      { dexes: ['129', '130'], move: 'Surf', reason: 'Gyarados is a strong Water option for the final gym.' },
    ],
  };

  function caughtCardFromDexes(dexes) {
    return dexes.map(cardByDex).find(card => card?.dataset.status === 'caught');
  }

  function updateGymHelpers() {
    document.querySelectorAll('[data-gym-helper]').forEach(panel => {
      const gym = panel.dataset.gymHelper;
      const candidates = GYM_RECOMMENDATIONS[gym] || [];
      const picks = candidates
        .map(candidate => ({ ...candidate, card: caughtCardFromDexes(candidate.dexes) }))
        .filter(candidate => candidate.card)
        .slice(0, 3);
      const summary = panel.querySelector(`[data-gym-summary="${gym}"]`);
      const list = panel.querySelector(`[data-gym-picks="${gym}"]`);
      const fallback = panel.querySelector(`[data-gym-fallback="${gym}"]`);
      if (summary) {
        summary.textContent = picks.length
          ? `Best caught options for ${titleCase(gym)} from your Pokédex right now:`
          : `No strong caught matchups marked yet for ${titleCase(gym)}.`;
      }
      if (list) {
        list.innerHTML = picks.length
          ? picks.map(pick => `
            <span>
              <strong>${pick.card.dataset.displayName}</strong>
              <em>${pick.move}</em>
              <small>${pick.reason}</small>
            </span>
          `).join('')
          : '<span>No caught recommendations yet.</span>';
      }
      if (fallback) {
        fallback.textContent = picks.length
          ? 'This is based only on Pokémon currently marked caught in your V2 Pokédex.'
          : 'Mark recommended catches in the Pokédex and this panel will update automatically.';
      }
    });
  }

  function syncGuide() {
    syncGuideSteps();
    syncItems();
    syncTabs();
    syncGuideChapters();
    syncGuideTargets();
    syncTargetFilters();
    syncPokedexCaughtChecks();
    updateGuideStats();
    updateRunSummary();
    updatePlatinumSummary();
    syncStarterGuidance();
    updateGymHelpers();
  }

  function cardMatchesFilter(card) {
    const status = card.dataset.status;
    const tags = (card.dataset.tags || '').split(',');

    if (activeFilter === 'all') return true;
    if (activeFilter === 'owned') return status === 'owned' || status === 'caught';
    if (activeFilter === 'catchable') return status === 'catchable';
    if (activeFilter === 'blocked') return status === 'blocked';
    return tags.includes(activeFilter);
  }

  function cardMatchesSearch(card) {
    const term = search.value.trim().toLowerCase();
    if (!term) return true;
    return [
      card.dataset.name,
      card.dataset.dex,
      card.dataset.method,
      card.dataset.blocker,
      card.dataset.tags,
    ].some(value => String(value || '').includes(term));
  }

  function updateStats(visible) {
    const owned = visible.filter(card => ['owned', 'caught'].includes(card.dataset.status));
    const catchable = visible.filter(card => card.dataset.status === 'catchable');
    const blocked = visible.filter(card => card.dataset.status === 'blocked');
    const next = catchable[0] || visible.find(card => card.dataset.status === 'blocked') || visible[0];

    ownedCount.textContent = owned.length;
    catchableCount.textContent = catchable.length;
    blockedCount.textContent = blocked.length;

    if (next) {
      nextTarget.textContent = next.dataset.displayName;
      nextMethod.textContent = next.dataset.displayBlocker || next.dataset.displayMethod;
    } else {
      nextTarget.textContent = 'No matches';
      nextMethod.textContent = 'Clear a search or filter';
    }
  }

  function updateChapterStats() {
    const panel = activeChapterPanel();
    if (!panel) return;
    const targetDexes = guideTargetsFor(panel.dataset.chapterPanel).filter(isTargetRelevant).map(target => target.dataset.targetDex);
    const targetLinkedCards = targetDexes.map(cardByDex).filter(Boolean);
    const owned = targetLinkedCards.filter(card => isOwnedStatus(card.dataset.status));
    const catchable = targetLinkedCards.filter(card => card.dataset.status === 'catchable');
    const blocked = targetLinkedCards.filter(card => card.dataset.status === 'blocked');

    ownedCount.textContent = owned.length;
    catchableCount.textContent = catchable.length;
    blockedCount.textContent = blocked.length;

    const nextGuideCard = targetLinkedCards.find(card => card.dataset.status === 'catchable')
      || targetLinkedCards.find(card => card.dataset.status === 'blocked')
      || null;
    if (nextGuideCard) {
      nextTarget.textContent = nextGuideCard.dataset.displayName;
      nextMethod.textContent = nextGuideCard.dataset.displayBlocker || nextGuideCard.dataset.displayMethod;
    } else {
      const referenceTarget = guideTargetsFor(panel.dataset.chapterPanel).find(isTargetRelevant);
      nextTarget.textContent = referenceTarget
        ? referenceTarget.querySelector('.v2-target-head > span')?.textContent?.replace(/^#\d+\s+/, '') || 'Guide target'
        : 'No target';
      nextMethod.textContent = referenceTarget
        ? 'Reference target: full data pending'
        : 'Pick another checkpoint';
    }
  }

  function applyFilters() {
    cards.forEach(card => {
      card.classList.toggle('hidden', !(cardMatchesFilter(card) && cardMatchesSearch(card)));
    });
    updateStats(visibleCards());
    syncGuideTargets();
    updateGuideStats();
    updateRunSummary();
    updateChapterStats();
    if (selectedCard) selectCard(selectedCard, { scroll: false });
  }

  function syncRuleToggles() {
    ruleToggles.forEach(toggle => {
      const enabled = Boolean(runState.rules[toggle.dataset.rule]);
      toggle.classList.toggle('active', enabled);
      const label = toggle.querySelector('strong');
      if (label) label.textContent = enabled ? 'On' : 'Off';
    });
  }

  function syncVersionToggles() {
    versionToggles.forEach(toggle => {
      toggle.classList.toggle('active', toggle.dataset.version === runState.version);
    });
  }

  function syncChoiceToggles() {
    choiceToggles.forEach(toggle => {
      const kind = toggle.dataset.choiceKind;
      const value = toggle.dataset.choiceValue;
      toggle.classList.toggle('active', runState[kind] === value);
    });
  }

  function syncStatusButtons() {
    statusButtons.forEach(button => {
      button.classList.toggle('active', selectedCard?.dataset.status === button.dataset.setStatus);
      button.disabled = selectedCard?.dataset.status === 'blocked' && button.dataset.setStatus !== 'blocked';
    });
  }

  function selectCard(card, options = { scroll: false }) {
    selectedCard = card;
    cards.forEach(item => item.classList.toggle('selected', item === card));

    const blocker = card.dataset.displayBlocker || 'None';
    const types = (card.dataset.types || '')
      .split(',')
      .filter(Boolean)
      .map(titleCase)
      .join(' / ');

    detailName.textContent = `#${String(card.dataset.dex).padStart(3, '0')} ${card.dataset.displayName}`;
    detailSummary.textContent = card.dataset.note;
    detailStatus.textContent = `Status: ${titleCase(card.dataset.status)}`;
    detailTypes.textContent = `Types: ${types || 'Unknown'}`;
    detailMethod.textContent = `Method: ${card.dataset.displayMethod}`;
    detailBlocker.textContent = `Blocker: ${blocker}`;
    if (detailVersion) {
      const versions = availableVersionsFor(card).map(displayChoice).join(' / ');
      detailVersion.textContent = `Version: ${versions || 'Unknown'}`;
    }
    syncStatusButtons();

    if (options.scroll) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function openPokemonInfo(card) {
    if (!card || typeof window.openDetailDrawer !== 'function') return;
    window.openDetailDrawer(Number(card.dataset.dex), card.dataset.displayName, Number(card.dataset.dex));
  }

  function setTypeMode(mode) {
    const isDefense = mode === 'defense';
    typeGrid?.classList.toggle('v2-type-defense-mode', isDefense);
    typeModeButtons.forEach(button => button.classList.toggle('active', button.dataset.typeMode === mode));
  }

  function filterTypeRows() {
    const q = (typeSearch?.value || '').trim().toLowerCase();
    typeRows.forEach(row => {
      const blob = (row.dataset.searchText || row.dataset.typeName || '').toLowerCase();
      row.style.display = (!q || blob.includes(q)) ? '' : 'none';
    });
  }

  function filterGameCards() {
    const q = (gameSearch?.value || '').trim().toLowerCase();
    gameCards.forEach(card => {
      const matchesSearch = !q || (card.dataset.gameSearch || '').includes(q);
      const matchesFilter = activeGameFilter === 'all'
        || card.dataset.gameStatus === activeGameFilter
        || card.dataset.gameGen === activeGameFilter;
      card.classList.toggle('hidden', !(matchesSearch && matchesFilter));
    });
  }

  function openGuideApp() {
    if (!guideApp) return;
    runState.activeTab = runState.guideEnabled ? validActiveTab() : 'pokedex';
    saveRunState();
    syncGuideMode();
    syncGuide();
    applyFilters();
    guideApp.hidden = false;
    guideApp.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openGuideButtons.forEach(button => {
    button.addEventListener('click', () => {
      const gameId = button.dataset.openV2Guide;
      const isFrontPreview = gameId === 'firered-leafgreen' && !button.closest('[data-v2-game-card]');
      if (isFrontPreview) {
        openGuideApp();
        return;
      }
      if (gameId) {
        window.location.href = `/v2/game/${gameId}`;
      }
    });
  });

  guideModeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      runState.guideEnabled = !runState.guideEnabled;
      if (!runState.guideEnabled) {
        runState.activeTab = 'pokedex';
      } else if (!runState.activeTab) {
        runState.activeTab = 'guide';
      }
      saveRunState();
      syncGuideMode();
      applyFilters();
    });
  });

  gameSearch?.addEventListener('input', filterGameCards);

  gameFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeGameFilter = button.dataset.gameFilter;
      gameFilterButtons.forEach(item => item.classList.toggle('active', item === button));
      filterGameCards();
    });
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      chips.forEach(item => item.classList.toggle('active', item === chip));
      applyFilters();
    });
  });

  versionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      runState.version = toggle.dataset.version;
      saveRunState();
      syncVersionToggles();
      reconcileCards();
      syncGuide();
      applyFilters();
    });
  });

  choiceToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const kind = toggle.dataset.choiceKind;
      if (kind === 'starter') {
        applyStarterChoice(toggle.dataset.choiceValue);
      } else {
        runState[kind] = toggle.dataset.choiceValue;
        if (kind === 'fossil') runState.fossilConfirmed = true;
        saveRunState();
      }
      syncChoiceToggles();
      reconcileCards();
      syncGuide();
      applyFilters();
      maybeAdvanceGuide(activeChapterId());
    });
  });

  choiceClearButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.clearChoice !== 'starter') return;
      clearStarterChoice();
      syncChoiceToggles();
      reconcileCards();
      syncGuide();
      applyFilters();
    });
  });

  ruleToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const rule = toggle.dataset.rule;
      runState.rules[rule] = !runState.rules[rule];
      saveRunState();
      syncRuleToggles();
      reconcileCards();
      syncGuide();
      applyFilters();
    });
  });

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      runState.activeTab = button.dataset.v2Tab;
      saveRunState();
      syncTabs();
      applyFilters();
      document.getElementById('v2-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  chapterButtons.forEach(button => {
    button.addEventListener('click', () => {
      runState.selectedChapter = button.dataset.chapterId;
      saveRunState();
      syncGuide();
      updateChapterStats();
      const panel = activeChapterPanel();
      panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  guideChecks.forEach(check => {
    check.addEventListener('change', () => {
      if (check.dataset.stepId === 'pallet-pick-starter' && !runState.starter) {
        check.checked = false;
        syncGuideSteps();
        return;
      }
      if (check.dataset.stepId === 'mtmoon-pick-fossil' && !runState.fossil) {
        check.checked = false;
        syncGuideSteps();
        return;
      }
      runState.completedSteps[check.dataset.stepId] = check.checked;
      saveRunState();
      syncGuide();
      maybeAdvanceGuide(check.dataset.chapterId);
    });
  });

  itemChecks.forEach(check => {
    check.addEventListener('change', () => {
      runState.checkedItems[check.dataset.itemId] = check.checked;
      saveRunState();
      syncGuide();
    });
  });

  pokedexCaughtChecks.forEach(check => {
    check.addEventListener('click', event => event.stopPropagation());
    check.addEventListener('change', () => {
      const linkedCard = cardByDex(check.dataset.pokedexCaught);
      if (!linkedCard) {
        syncPokedexCaughtChecks();
        return;
      }
      const starter = starterForDex(linkedCard.dataset.dex);
      if (isFirstStageStarterDex(linkedCard.dataset.dex) && (!runState.starter || starter === runState.starter)) {
        if (check.checked) {
          applyStarterChoice(starter);
          reconcileCards();
          syncChoiceToggles();
        } else {
          clearStarterChoice();
          reconcileCards();
          syncChoiceToggles();
        }
        syncGuide();
        selectCard(linkedCard);
        applyFilters();
        return;
      }
      if (linkedCard.dataset.status === 'blocked') {
        syncPokedexCaughtChecks();
        return;
      }
      if (check.checked) {
        applyStatusToCard(linkedCard, 'caught');
      } else {
        clearStatusForCard(linkedCard);
      }
      syncGuide();
      selectCard(linkedCard);
      applyFilters();
    });
  });

  targetCards.forEach(target => {
    target.addEventListener('click', event => {
      const linkedCard = cardByDex(target.dataset.targetDex);
      if (!linkedCard) return;
      if (event.target.closest('input, label, button')) return;
      selectCard(linkedCard, { scroll: true });
    });
  });

  targetFilterToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const chapterId = toggle.dataset.targetFilterToggle;
      runState.targetFilters[chapterId] = !runState.targetFilters[chapterId];
      saveRunState();
      syncGuide();
      updateChapterStats();
    });
  });

  targetChecks.forEach(check => {
    check.addEventListener('change', () => {
      const target = check.closest('.v2-target-card');
      const linkedCard = cardByDex(check.dataset.targetDex);
      if (target?.dataset.targetKind === 'starter') {
        if (check.checked) {
          applyStarterChoice(target.dataset.targetStarter);
          reconcileCards();
          syncChoiceToggles();
          syncGuide();
          selectCard(cardByDex(check.dataset.targetDex));
          applyFilters();
          maybeAdvanceGuide(activeChapterId());
        } else {
          if (target.dataset.targetStarter === runState.starter) {
            clearStarterChoice();
            reconcileCards();
            syncChoiceToggles();
            syncGuide();
            applyFilters();
          } else {
            syncGuideTargets();
          }
        }
        return;
      }
      if (!linkedCard || linkedCard.dataset.status === 'blocked') {
        syncGuideTargets();
        return;
      }
      if (check.checked) {
        applyStatusToCard(linkedCard, 'caught');
      } else {
        clearStatusForCard(linkedCard);
      }
      syncGuide();
      selectCard(linkedCard);
      applyFilters();
    });
  });

  targetOpenButtons.forEach(button => {
    button.addEventListener('click', () => {
      const linkedCard = cardByDex(button.dataset.targetOpen);
      if (!linkedCard) return;
      runState.activeTab = 'pokedex';
      saveRunState();
      syncTabs();
      selectCard(linkedCard, { scroll: true });
    });
  });

  targetInfoButtons.forEach(button => {
    button.addEventListener('click', () => {
      openPokemonInfo(cardByDex(button.dataset.targetInfo));
    });
  });

  infoButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      openPokemonInfo(cardByDex(button.dataset.pokedexInfo));
    });
  });

  typeModeButtons.forEach(button => {
    button.addEventListener('click', () => setTypeMode(button.dataset.typeMode));
  });

  typeSearch?.addEventListener('input', filterTypeRows);

  statusButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!selectedCard || button.disabled) return;
      const status = button.dataset.setStatus;
      applyStatusToCard(selectedCard, status);
      syncGuide();
      selectCard(selectedCard);
      applyFilters();
    });
  });

  resetButton?.addEventListener('click', () => {
    const ok = window.confirm('Reset the local V2 preview rules and status changes? V1 data is not touched.');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    runState = loadRunState();
    syncVersionToggles();
    syncChoiceToggles();
    syncRuleToggles();
    reconcileCards();
    syncGuide();
    applyFilters();
  });

  resetGuideButton?.addEventListener('click', () => {
    const ok = window.confirm('Reset guide checkmarks and selected checkpoint? Pokemon status changes stay saved.');
    if (!ok) return;
    runState.completedSteps = {};
    runState.selectedChapter = chapterButtons[0]?.dataset.chapterId || null;
    saveRunState();
    syncGuide();
    applyFilters();
  });

  search.addEventListener('input', applyFilters);

  cards.forEach(card => {
    card.addEventListener('click', () => selectCard(card));
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      selectCard(card);
    });
  });

  function refreshPreview() {
    syncRuleToggles();
    syncVersionToggles();
    syncChoiceToggles();
    reconcileCards();
    syncGuideMode();
    syncGuide();
    filterTypeRows();
    filterGameCards();
    selectCard(selectedCard);
    applyFilters();
  }

  setTypeMode('offense');
  refreshPreview();
  loadServerState();
})();
