'use strict';

(function () {
  const shell = document.querySelector('[data-v2-game-id]');
  if (!shell) return;

  const gameId = shell.dataset.v2GameId;
  const storageKey = `pokemon_tracker_v2_game_shell_${gameId}`;
  const cards = [...document.querySelectorAll('[data-generic-card]')];
  const caughtChecks = [...document.querySelectorAll('[data-generic-caught]')];
  const infoButtons = [...document.querySelectorAll('[data-generic-info]')];
  const versionButtons = [...document.querySelectorAll('.v2-generic-version-toggle[data-version]')];
  const filterButtons = [...document.querySelectorAll('[data-v2-generic-filter]')];
  const search = document.getElementById('v2-generic-search');
  const pokemonTypeFilter = document.getElementById('v2-generic-type-filter');
  const zaZoneFilter = document.getElementById('v2-za-zone-filter');
  const versionLabel = document.getElementById('v2-generic-version');
  const caughtLabel = document.getElementById('v2-generic-caught');
  const visibleLabel = document.getElementById('v2-generic-visible');
  const classicKantoProgress = document.getElementById('v2-kanto-classic-progress');
  const classicKantoVersionProgress = document.getElementById('v2-kanto-classic-version-progress');
  const classicKantoStaticProgress = document.getElementById('v2-kanto-classic-static-progress');
  const classicKantoLegendaryProgress = document.getElementById('v2-kanto-classic-legendary-progress');
  const classicJohtoProgress = document.getElementById('v2-johto-classic-progress');
  const classicJohtoTimeProgress = document.getElementById('v2-johto-classic-time-progress');
  const classicJohtoStaticProgress = document.getElementById('v2-johto-classic-static-progress');
  const classicJohtoLegendaryProgress = document.getElementById('v2-johto-classic-legendary-progress');
  const hgssJohtoProgress = document.getElementById('v2-hgss-johto-progress');
  const hgssKantoProgress = document.getElementById('v2-hgss-kanto-progress');
  const hgssVersionBlocked = document.getElementById('v2-hgss-version-blocked');
  const hgssHeadbuttProgress = document.getElementById('v2-hgss-headbutt-progress');
  const hgssTimeProgress = document.getElementById('v2-hgss-time-progress');
  const hgssTimeFilter = document.getElementById('v2-hgss-time-filter');
  const emeraldHoennProgress = document.getElementById('v2-emerald-hoenn-progress');
  const emeraldWeatherProgress = document.getElementById('v2-emerald-weather-progress');
  const emeraldStaticProgress = document.getElementById('v2-emerald-static-progress');
  const emeraldLegendaryProgress = document.getElementById('v2-emerald-legendary-progress');
  const platinumSinnohProgress = document.getElementById('v2-platinum-sinnoh-progress');
  const platinumHoneyProgress = document.getElementById('v2-platinum-honey-progress');
  const platinumStaticProgress = document.getElementById('v2-platinum-static-progress');
  const platinumLegendaryProgress = document.getElementById('v2-platinum-legendary-progress');
  const platinumCurrentLocation = document.getElementById('v2-platinum-current-location');
  const platinumCatchProgress = document.getElementById('v2-platinum-catch-progress');
  const platinumCatchProgressCopy = document.getElementById('v2-platinum-catch-progress-copy');
  const platinumCatchProgressFill = document.getElementById('v2-platinum-catch-progress-fill');
  const platinumBadgeProgress = document.getElementById('v2-platinum-badge-progress');
  const platinumBadgeButtons = [...document.querySelectorAll('[data-platinum-badge]')];
  const platinumTargetToggles = [...document.querySelectorAll('[data-platinum-target-toggle]')];
  const bwUnovaProgress = document.getElementById('v2-bw-unova-progress');
  const bwSeasonProgress = document.getElementById('v2-bw-season-progress');
  const bwShakingProgress = document.getElementById('v2-bw-shaking-progress');
  const bwLegendaryProgress = document.getElementById('v2-bw-legendary-progress');
  const alolaProgress = document.getElementById('v2-alola-progress');
  const alolaScanProgress = document.getElementById('v2-alola-scan-progress');
  const alolaStaticProgress = document.getElementById('v2-alola-static-progress');
  const alolaLegendaryProgress = document.getElementById('v2-alola-legendary-progress');
  const xyProgress = document.getElementById('v2-xy-progress');
  const xyMegaProgress = document.getElementById('v2-xy-mega-progress');
  const xyStaticProgress = document.getElementById('v2-xy-static-progress');
  const xyLegendaryProgress = document.getElementById('v2-xy-legendary-progress');
  const swshProgress = document.getElementById('v2-swsh-progress');
  const swshWildProgress = document.getElementById('v2-swsh-wild-progress');
  const swshStaticProgress = document.getElementById('v2-swsh-static-progress');
  const swshLegendaryProgress = document.getElementById('v2-swsh-legendary-progress');
  const letsGoProgress = document.getElementById('v2-lg-progress');
  const letsGoVersionProgress = document.getElementById('v2-lg-version-progress');
  const letsGoStaticProgress = document.getElementById('v2-lg-static-progress');
  const letsGoLegendaryProgress = document.getElementById('v2-lg-legendary-progress');
  const plaProgress = document.getElementById('v2-pla-progress');
  const plaResearchProgress = document.getElementById('v2-pla-research-progress');
  const plaDistortionProgress = document.getElementById('v2-pla-distortion-progress');
  const plaLegendaryProgress = document.getElementById('v2-pla-legendary-progress');
  const svProgress = document.getElementById('v2-sv-progress');
  const svOpenProgress = document.getElementById('v2-sv-open-progress');
  const svTitanProgress = document.getElementById('v2-sv-titan-progress');
  const svStarProgress = document.getElementById('v2-sv-star-progress');
  const svOddProgress = document.getElementById('v2-sv-odd-progress');
  const svFormProgress = document.getElementById('v2-sv-form-progress');
  const svParadoxProgress = document.getElementById('v2-sv-paradox-progress');
  const svAreaZeroProgress = document.getElementById('v2-sv-area-zero-progress');
  const svLegendaryProgress = document.getElementById('v2-sv-legendary-progress');
  const resetButton = document.getElementById('v2-generic-reset');
  const typeModeButtons = [...document.querySelectorAll('[data-generic-type-mode]')];
  const typeSearch = document.getElementById('v2-generic-type-search');
  const typeGrid = document.getElementById('v2-generic-type-grid');
  const typeRows = [...document.querySelectorAll('[data-generic-type-row]')];
  const cardGrid = document.getElementById('v2-generic-card-grid');
  const guideButtons = [...document.querySelectorAll('[data-generic-guide-button]')];
  const guidePanels = [...document.querySelectorAll('[data-generic-guide-panel]')];
  const guideGroupSections = [...document.querySelectorAll('[data-guide-group]')];
  const guideGroupToggles = [...document.querySelectorAll('[data-guide-group-toggle]')];
  const guideChecks = [...document.querySelectorAll('[data-generic-guide-step]')];
  const guideTargetCards = [...document.querySelectorAll('[data-generic-guide-target]')];
  const genericGymHelpers = [...document.querySelectorAll('[data-generic-gym-helper]')];
  const guideCountLabel = document.getElementById('v2-generic-guide-count');
  const itemCountLabel = document.getElementById('v2-generic-item-count');
  const tabButtons = [...document.querySelectorAll('[data-v2-generic-tab]')];
  const tabPanels = [...document.querySelectorAll('[data-v2-generic-panel]')];
  const itemChecks = [...document.querySelectorAll('[data-generic-item-id]')];
  const starterButtons = [...document.querySelectorAll('[data-generic-starter]')];
  const starterProfiles = [...document.querySelectorAll('[data-generic-starter-profile]')];
  const starterPlans = [...document.querySelectorAll('[data-generic-starter-plan]')];
  const starterPlanEmpty = document.querySelector('.v2-starter-team-empty');
  const svPathButtons = [...document.querySelectorAll('[data-sv-path-mode]')];
  const svPathPanels = [...document.querySelectorAll('[data-sv-path-panel]')];
  const svPathNotes = [...document.querySelectorAll('[data-sv-path-note]')];
  const svPreferredElements = [...document.querySelectorAll('[data-sv-preferred-modes]')];
  const clearStarterButton = document.getElementById('v2-generic-clear-starter');
  const starterLabel = document.getElementById('v2-generic-starter');
  const zaVerifiedChecks = [...document.querySelectorAll('[data-za-verified]')];
  const zaVerifiedLabel = document.getElementById('v2-za-verified');
  const zaWildZoneLabel = document.getElementById('v2-za-wild-zone');
  const zaMegaLabel = document.getElementById('v2-za-mega');
  const zaNoteInputs = [...document.querySelectorAll('[data-za-field-note]')];
  const zaNotesLabel = document.getElementById('v2-za-notes');
  const zaLocationNotesLabel = document.getElementById('v2-za-location-notes');
  const zaTargetFilterButtons = [...document.querySelectorAll('[data-za-target-filter]')];
  const zaScopeFilterButtons = [...document.querySelectorAll('[data-za-scope-filter]')];
  const zaConfidenceFilterButtons = [...document.querySelectorAll('[data-za-confidence-filter]')];
  const zaCurrentObjectiveTitle = document.getElementById('v2-za-current-objective-title');
  const zaCurrentObjectiveNext = document.getElementById('v2-za-current-objective-next');
  const zaCurrentObjectiveNote = document.getElementById('v2-za-current-objective-note');
  const zaCurrentZone = document.getElementById('v2-za-current-zone');
  const zaCurrentZoneProgress = document.getElementById('v2-za-current-zone-progress');
  const zaOpenCurrentZoneButton = document.getElementById('v2-za-open-current-zone');
  const zaOpenCurrentZoneUncaughtButton = document.getElementById('v2-za-open-current-zone-uncaught');
  const zaCopyNotesButton = document.getElementById('v2-za-copy-notes');
  const zaCopyStatus = document.getElementById('v2-za-copy-status');
  const zaClearSessionButton = document.getElementById('v2-za-clear-session');
  const zaHideCompletedButton = document.getElementById('v2-za-hide-completed');
  const zaSessionChecks = [...document.querySelectorAll('[data-za-session-step]')];
  const zaSessionProgress = document.getElementById('v2-za-session-progress');
  const zaLocationInputs = [...document.querySelectorAll('[data-za-location]')];
  const zaDetailPanel = document.getElementById('v2-za-detail-panel');
  const zaDetailModal = document.getElementById('v2-za-detail-modal');
  const zaDetailNumber = document.getElementById('v2-za-detail-number');
  const zaDetailName = document.getElementById('v2-za-detail-name');
  const zaDetailNote = document.getElementById('v2-za-detail-note');
  const zaDetailSprite = document.getElementById('v2-za-detail-sprite');
  const zaDetailCaught = document.getElementById('v2-za-detail-caught');
  const zaDetailVerified = document.getElementById('v2-za-detail-verified');
  const zaDetailGuide = document.getElementById('v2-za-detail-guide');
  const zaDetailTypes = document.getElementById('v2-za-detail-types');
  const zaDetailCaughtToggle = document.getElementById('v2-za-detail-caught-toggle');
  const zaDetailVerifiedToggle = document.getElementById('v2-za-detail-verified-toggle');
  const zaDetailLocation = document.getElementById('v2-za-detail-location');
  const zaDetailGuideJump = document.getElementById('v2-za-detail-guide-jump');
  const zaDetailInfo = document.getElementById('v2-za-detail-info');
  const zaAttentionTotal = document.getElementById('v2-za-attention-total');
  const zaAttentionUncaught = document.getElementById('v2-za-attention-uncaught');
  const zaAttentionLocations = document.getElementById('v2-za-attention-locations');
  const zaAttentionVerification = document.getElementById('v2-za-attention-verification');
  const zaAttentionNotes = document.getElementById('v2-za-attention-notes');
  const zaAttentionUncaughtList = document.getElementById('v2-za-attention-uncaught-list');
  const zaAttentionLocationsList = document.getElementById('v2-za-attention-locations-list');
  const zaAttentionVerificationList = document.getElementById('v2-za-attention-verification-list');
  const zaAttentionNotesList = document.getElementById('v2-za-attention-notes-list');
  const zaAttentionButtons = [...document.querySelectorAll('[data-za-attention-jump]')];
  const zaMissingReasonFields = {
    currentZone: {
      count: document.getElementById('v2-za-missing-current-zone'),
      list: document.getElementById('v2-za-missing-current-zone-list'),
    },
    level: {
      count: document.getElementById('v2-za-missing-level'),
      list: document.getElementById('v2-za-missing-level-list'),
    },
    stone: {
      count: document.getElementById('v2-za-missing-stone'),
      list: document.getElementById('v2-za-missing-stone-list'),
    },
    trade: {
      count: document.getElementById('v2-za-missing-trade'),
      list: document.getElementById('v2-za-missing-trade-list'),
    },
    friendship: {
      count: document.getElementById('v2-za-missing-friendship'),
      list: document.getElementById('v2-za-missing-friendship-list'),
    },
    postgame: {
      count: document.getElementById('v2-za-missing-postgame'),
      list: document.getElementById('v2-za-missing-postgame-list'),
    },
  };
  const zaZoneCards = [...document.querySelectorAll('[data-za-zone-card]')];
  const zaZoneMarkAllButtons = [...document.querySelectorAll('[data-za-zone-mark-all]')];
  const zaZoneClearButtons = [...document.querySelectorAll('[data-za-zone-clear]')];
  const zaEvolutionCards = [...document.querySelectorAll('[data-za-evolution-jump]')];
  const zaEvolutionCounts = [...document.querySelectorAll('[data-za-evolution-count]')];
  const zaMegaCards = [...document.querySelectorAll('[data-za-mega-jump]')];
  const zaMegaTotal = document.getElementById('v2-za-mega-total');
  const zaMegaMain = document.getElementById('v2-za-mega-main');
  const zaMegaDlc = document.getElementById('v2-za-mega-dlc');
  const zaMegaSource = document.getElementById('v2-za-mega-source');
  const zaMegaCaughtSource = document.getElementById('v2-za-mega-caught-source');
  const zaMegaMainList = document.getElementById('v2-za-mega-main-list');
  const zaMegaDlcList = document.getElementById('v2-za-mega-dlc-list');
  const zaMegaSourceList = document.getElementById('v2-za-mega-source-list');
  const zaMegaCaughtSourceList = document.getElementById('v2-za-mega-caught-source-list');
  const zaCompletionReady = document.getElementById('v2-za-completion-ready');
  const zaCompletionMain = document.getElementById('v2-za-completion-main');
  const zaCompletionWild = document.getElementById('v2-za-completion-wild');
  const zaCompletionEvolution = document.getElementById('v2-za-completion-evolution');
  const zaCompletionMega = document.getElementById('v2-za-completion-mega');
  const zaCompletionPostgame = document.getElementById('v2-za-completion-postgame');
  const zaCompletionLocation = document.getElementById('v2-za-completion-location');
  const zaCompletionMainList = document.getElementById('v2-za-completion-main-list');
  const zaCompletionWildList = document.getElementById('v2-za-completion-wild-list');
  const zaCompletionEvolutionList = document.getElementById('v2-za-completion-evolution-list');
  const zaCompletionMegaList = document.getElementById('v2-za-completion-mega-list');
  const zaCompletionPostgameList = document.getElementById('v2-za-completion-postgame-list');
  const zaCompletionLocationList = document.getElementById('v2-za-completion-location-list');
  const zaCorrectionForm = document.getElementById('v2-za-correction-form');
  const zaCorrectionTitle = document.getElementById('v2-za-correction-title');
  const zaCorrectionDetails = document.getElementById('v2-za-correction-details');
  const zaCorrectionSubmit = document.getElementById('v2-za-correction-submit');
  const zaTeamSlotCards = [...document.querySelectorAll('[data-za-team-slot-card]')];
  const zaTeamSlotSelects = [...document.querySelectorAll('[data-za-team-slot]')];
  const zaTeamLevelInputs = [...document.querySelectorAll('[data-za-team-level]')];
  const zaTeamMoveInputs = [...document.querySelectorAll('[data-za-team-move]')];
  const zaTeamSlotStatuses = [...document.querySelectorAll('[data-za-team-slot-status]')];
  const platinumBadgeIds = ['coal', 'forest', 'cobble', 'fen', 'relic', 'mine', 'icicle', 'beacon'];

  let activeFilter = 'all';
  let activeZaTargetFilter = 'all';
  let activeZaConfidenceFilter = 'all';
  let activeZaScopeFilter = 'main';
  let selectedDex = null;
  let state = loadState();
  let persistTimer = null;
  activeZaScopeFilter = state.zaScope || 'main';

  const HGSS_GYM_RECOMMENDATIONS = {
    falkner: [
      {
        dexes: ['179', '180', '181'],
        move: 'ThunderShock',
        reason: 'Mareep line is the cleanest early Flying answer if you catch it before the gym.',
      },
      {
        dexes: ['74', '75', '76'],
        move: 'Rock Throw',
        reason: 'Geodude line resists Flying and gives you sturdy Rock pressure.',
      },
      {
        dexes: ['95'],
        move: 'Rock Throw',
        reason: 'Onix is another strong Rock option if you trade/catch it before Falkner.',
      },
      {
        dexes: ['155', '156', '157'],
        move: 'Ember',
        reason: 'Cyndaquil line can push with neutral damage if leveled.',
      },
    ],
    bugsy: [
      {
        dexes: ['155', '156', '157'],
        move: 'Ember / Flame Wheel',
        reason: 'Cyndaquil line is the cleanest early Bugsy answer.',
      },
      {
        dexes: ['16', '17', '18', '21', '22', '163', '164'],
        move: 'Gust / Peck',
        reason: 'Early birds give useful Flying pressure into Bug types.',
      },
      {
        dexes: ['74', '75', '76', '95'],
        move: 'Rock Throw',
        reason: 'Rock coverage is helpful into Scyther and the Bug gym tempo.',
      },
      {
        dexes: ['92', '93', '94'],
        move: 'Hypnosis / status support',
        reason: 'Gastly can help with status if you caught it at night in Sprout Tower.',
      },
      {
        dexes: ['214'],
        move: 'Strong neutral hits',
        reason: 'Heracross is an excellent pickup, even if timing and Headbutt access vary by route.',
      },
    ],
    whitney: [
      {
        dexes: ['214'],
        move: 'Brick Break / strong Fighting pressure',
        reason: 'Heracross is one of the best answers if you picked it up from Headbutt trees.',
      },
      {
        dexes: ['66', '67', '68'],
        move: 'Karate Chop / Fighting moves',
        reason: 'Machop line gives direct Fighting pressure into Normal types.',
      },
      {
        dexes: ['74', '75', '76', '95', '185'],
        move: 'Rock Throw / defensive pressure',
        reason: 'Rocky options can take hits better than frailer route catches.',
      },
      {
        dexes: ['92', '93', '94'],
        move: 'Status support',
        reason: 'Gastly can still support the fight, but watch Normal-type immunity interactions.',
      },
    ],
    morty: [
      {
        dexes: ['19', '20', '133', '197'],
        move: 'Bite / Dark coverage',
        reason: 'Dark coverage is useful into Morty if your route or Eevee planning gives you access.',
      },
      {
        dexes: ['63', '64', '65', '96', '97'],
        move: 'Confusion / Psybeam',
        reason: 'Psychic pressure helps into the Gastly line, though you still need to manage status.',
      },
      {
        dexes: ['92', '93', '94'],
        move: 'Night Shade / Hypnosis',
        reason: 'Your own Gastly line can support with status and Ghost pressure.',
      },
      {
        dexes: ['179', '180', '181'],
        move: 'Thunder Wave / reliable neutral hits',
        reason: 'Ampharos line can stabilize the fight with paralysis and bulk.',
      },
    ],
    chuck: [
      {
        dexes: ['16', '17', '18', '21', '22', '163', '164'],
        move: 'Fly / Wing Attack / Peck',
        reason: 'Flying pressure is the cleanest idea into Fighting types.',
      },
      {
        dexes: ['63', '64', '65', '96', '97', '102', '103'],
        move: 'Psychic coverage',
        reason: 'Psychic-type attacks help punish Fighting targets if you trained one.',
      },
      {
        dexes: ['130', '194', '195', '158', '159', '160'],
        move: 'Surf / strong Water pressure',
        reason: 'Bulky Water options help you play safely through Chuck’s pressure.',
      },
    ],
    jasmine: [
      {
        dexes: ['155', '156', '157', '58', '59', '37', '38'],
        move: 'Flame Wheel / Flamethrower',
        reason: 'Fire coverage is ideal into Steelix and Magnemite-line pressure.',
      },
      {
        dexes: ['66', '67', '68', '214'],
        move: 'Fighting coverage',
        reason: 'Fighting options can pressure Steel, especially if your Fire options are weak.',
      },
      {
        dexes: ['194', '195', '158', '159', '160', '130'],
        move: 'Surf / Water coverage',
        reason: 'Water coverage helps into Steelix if you have Surf online.',
      },
      {
        dexes: ['74', '75', '76', '95', '185'],
        move: 'Ground/Rock pressure',
        reason: 'Rock/Ground options can be useful, but watch Steelix’s bulk.',
      },
    ],
    pryce: [
      {
        dexes: ['155', '156', '157', '58', '59', '37', '38'],
        move: 'Fire coverage',
        reason: 'Fire attacks punish Ice targets if you kept a Fire option trained.',
      },
      {
        dexes: ['66', '67', '68', '214'],
        move: 'Fighting coverage',
        reason: 'Fighting pressure is useful into Ice and Normal/Ice-style bulk.',
      },
      {
        dexes: ['179', '180', '181'],
        move: 'Electric coverage',
        reason: 'Ampharos line is helpful into water-leaning Ice teams.',
      },
      {
        dexes: ['130', '158', '159', '160'],
        move: 'Strong neutral Water pressure',
        reason: 'Bulky Water options can help stabilize the fight if coverage is limited.',
      },
    ],
    clair: [
      {
        dexes: ['130'],
        move: 'Ice Fang / strong Water pressure',
        reason: 'Red Gyarados is a practical late-game option for Dragon-gym prep.',
      },
      {
        dexes: ['220', '221', '473'],
        move: 'Ice Shard / Ice Fang',
        reason: 'Swinub line brings the Ice coverage you want for Dragon targets.',
      },
      {
        dexes: ['147', '148', '149'],
        move: 'Dragon-type pressure',
        reason: 'Dratini line is a long-game answer if you invested in it before Blackthorn.',
      },
      {
        dexes: ['131', '86', '87'],
        move: 'Ice Beam / Ice coverage',
        reason: 'Water/Ice options help if your route cleanup gave you one.',
      },
    ],
  };

  const EMERALD_GYM_RECOMMENDATIONS = {
    roxanne: [
      { dexes: ['258', '259', '260'], move: 'Water Gun / Mud Shot', reason: 'Mudkip line is the cleanest Emerald answer into Roxanne.' },
      { dexes: ['285', '286'], move: 'Absorb / Mach Punch', reason: 'Shroomish and Breloom are excellent early Rock answers.' },
      { dexes: ['252', '253', '254'], move: 'Absorb / Bullet Seed', reason: 'Treecko line can still do the job if you kept levels healthy.' },
      { dexes: ['296', '297'], move: 'Fighting pressure', reason: 'Makuhita line helps if Granite Cave gave you one early.' },
    ],
    brawly: [
      { dexes: ['280', '281', '282'], move: 'Confusion', reason: 'Ralts or Kirlia is one of the best clean answers if you caught it.' },
      { dexes: ['276', '277', '278', '279'], move: 'Wing Attack / Peck', reason: 'Taillow and Wingull lines give easy Flying pressure into Brawly.' },
      { dexes: ['267', '269'], move: 'Confusion / status', reason: 'Beautifly or Dustox can still help with early utility and status.' },
      { dexes: ['307', '308'], move: 'Psychic / Fighting mirror pressure', reason: 'Meditite line is another strong Granite Cave pickup for this gym.' },
    ],
    wattson: [
      { dexes: ['258', '259', '260'], move: 'Mud Shot / Ground typing', reason: 'Mudkip line trivializes Wattson if you chose it.' },
      { dexes: ['74', '75', '76', '322', '323'], move: 'Ground pressure', reason: 'Ground lines avoid the worst of Wattson’s Electric pressure.' },
      { dexes: ['285', '286'], move: 'Mach Punch / bulk', reason: 'Breloom line gives safe neutral pressure if Ground options are thin.' },
      { dexes: ['304', '305', '306'], move: 'Bulk / Metal Claw', reason: 'Aron line can soak hits better than frailer route catches.' },
    ],
    flannery: [
      { dexes: ['258', '259', '260', '278', '279', '320', '321'], move: 'Water coverage', reason: 'Water lines are the cleanest answer to Flannery’s fire-heavy team.' },
      { dexes: ['74', '75', '76', '194', '195'], move: 'Ground pressure', reason: 'Ground lines punish Fire types safely if leveled.' },
      { dexes: ['296', '297', '322', '323'], move: 'Bulk / neutral pressure', reason: 'Bulky Fighting or Numel lines can stabilize the matchup.' },
    ],
    norman: [
      { dexes: ['296', '297', '285', '286'], move: 'Fighting pressure', reason: 'Makuhita and Breloom lines are some of the best Norman answers.' },
      { dexes: ['263', '264', '287', '288', '289'], move: 'Status / bulk', reason: 'Bulky Normal mirrors or Pickup lines can help if your offense is awkward.' },
      { dexes: ['258', '259', '260', '320', '321'], move: 'Bulk + chip', reason: 'Bulky Water lines help you survive Norman’s strongest turns.' },
    ],
    winona: [
      { dexes: ['309', '310', '311', '312'], move: 'Electric coverage', reason: 'Electric pressure is the easiest way to punish Winona’s Flying team.' },
      { dexes: ['74', '75', '76', '304', '305', '306'], move: 'Rock Slide / Rock pressure', reason: 'Rock and Steel lines help into Flying bulk and Altaria.' },
      { dexes: ['363', '364', '365'], move: 'Ice coverage', reason: 'Ice lines help if you reached Shoal-side cleanup earlier than usual.' },
    ],
    'tate & liza': [
      { dexes: ['261', '262', '359'], move: 'Dark pressure', reason: 'Dark lines are the cleanest thematic answer into the Psychic double battle.' },
      { dexes: ['41', '42', '92', '93', '94'], move: 'Ghost pressure / status', reason: 'Ghost lines help if you have them trained and positioned carefully.' },
      { dexes: ['258', '259', '260', '320', '321'], move: 'Surf / bulk', reason: 'Bulky Water options often stabilize the fight better than glass cannons.' },
    ],
    juan: [
      { dexes: ['252', '253', '254', '285', '286'], move: 'Grass coverage', reason: 'Grass lines give direct pressure into Juan’s Water core.' },
      { dexes: ['309', '310', '311', '312'], move: 'Electric coverage', reason: 'Electric routes or Plusle/Minun style lines help into the Water gym.' },
      { dexes: ['258', '259', '260', '320', '321'], move: 'Bulky Water mirror', reason: 'Bulky Water mirrors can help if your offensive coverage is shaky.' },
    ],
    wallace: [
      { dexes: ['252', '253', '254', '285', '286'], move: 'Grass coverage', reason: 'Grass pressure matters a lot across the full Champion Wallace battle.' },
      { dexes: ['309', '310', '311', '312'], move: 'Electric coverage', reason: 'Electric lines are some of the clearest Wallace answers if you trained one.' },
      { dexes: ['359', '371', '372', '373'], move: 'Strong neutral pressure', reason: 'Late-game heavy hitters can clean up once your type answers are in place.' },
    ],
  };

  const RUBY_SAPPHIRE_GYM_RECOMMENDATIONS = {
    roxanne: EMERALD_GYM_RECOMMENDATIONS.roxanne,
    brawly: EMERALD_GYM_RECOMMENDATIONS.brawly,
    wattson: EMERALD_GYM_RECOMMENDATIONS.wattson,
    flannery: EMERALD_GYM_RECOMMENDATIONS.flannery,
    norman: EMERALD_GYM_RECOMMENDATIONS.norman,
    winona: EMERALD_GYM_RECOMMENDATIONS.winona,
    'tate & liza': EMERALD_GYM_RECOMMENDATIONS['tate & liza'],
    wallace: EMERALD_GYM_RECOMMENDATIONS.juan,
    steven: [
      { dexes: ['255', '256', '257', '322', '323'], move: 'Fire coverage', reason: 'Fire pressure is one of the cleanest ways to break through Steven’s Steel-heavy team.' },
      { dexes: ['258', '259', '260', '74', '75', '76'], move: 'Water or Ground pressure', reason: 'Water and Ground lines are strong into Aggron, Armaldo, Claydol, and Metagross support pieces.' },
      { dexes: ['296', '297', '286'], move: 'Fighting pressure', reason: 'Fighting lines help into Steel and Rock pieces if your Fire options are weak.' },
      { dexes: ['371', '372', '373', '359'], move: 'Strong neutral late-game pressure', reason: 'Late heavy hitters can close the fight once your coverage lines are ready.' },
    ],
  };

  const ORAS_GYM_RECOMMENDATIONS = {
    roxanne: EMERALD_GYM_RECOMMENDATIONS.roxanne,
    brawly: EMERALD_GYM_RECOMMENDATIONS.brawly,
    wattson: EMERALD_GYM_RECOMMENDATIONS.wattson,
    flannery: EMERALD_GYM_RECOMMENDATIONS.flannery,
    norman: EMERALD_GYM_RECOMMENDATIONS.norman,
    winona: EMERALD_GYM_RECOMMENDATIONS.winona,
    'tate & liza': EMERALD_GYM_RECOMMENDATIONS['tate & liza'],
    wallace: EMERALD_GYM_RECOMMENDATIONS.juan,
    steven: RUBY_SAPPHIRE_GYM_RECOMMENDATIONS.steven,
  };

  const PLATINUM_GYM_RECOMMENDATIONS = {
    roark: [
      { dexes: ['387', '388', '389'], move: 'Absorb / Razor Leaf', reason: 'Turtwig line is a very clean Roark answer.' },
      { dexes: ['393', '394', '395'], move: 'Bubble / Water Gun', reason: 'Piplup line handles Roark well if you chose it.' },
      { dexes: ['406', '315', '407'], move: 'Absorb / Mega Drain', reason: 'Budew line is another strong early answer.' },
      { dexes: ['66', '67', '68'], move: 'Low Kick / Karate Chop', reason: 'Machop gives direct Fighting pressure into the first gym.' },
    ],
    gardenia: [
      { dexes: ['390', '391', '392'], move: 'Fire coverage', reason: 'Chimchar line is one of the cleanest Gardenia answers.' },
      { dexes: ['396', '397', '398'], move: 'Wing Attack / Aerial pressure', reason: 'Starly line gives simple Flying pressure if you kept it trained.' },
      { dexes: ['399', '400', '427', '428'], move: 'Neutral pressure / support', reason: 'Several route catches can support even if you lack direct Fire or Flying dominance.' },
    ],
    maylene: [
      { dexes: ['280', '281', '282'], move: 'Confusion / Psychic pressure', reason: 'Ralts-line Psychic coverage is excellent into Fighting teams.' },
      { dexes: ['396', '397', '398'], move: 'Flying coverage', reason: 'Staravia or Staraptor is a practical and common answer.' },
      { dexes: ['425', '426'], move: 'Flying/Ghost support', reason: 'Drifloon line can help if you captured the timed Windworks target.' },
    ],
    'crasher wake': [
      { dexes: ['387', '388', '389', '406', '315', '407'], move: 'Grass coverage', reason: 'Grass lines are the clearest Wake answers if you kept them current.' },
      { dexes: ['403', '404', '405'], move: 'Spark / Thunder Fang', reason: 'Luxio or Luxray gives excellent Electric pressure into Wake.' },
      { dexes: ['466', '462'], move: 'Electric special methods', reason: 'Late-evolution Electric lines can matter if you already planned them out.' },
    ],
    byron: [
      { dexes: ['390', '391', '392'], move: 'Fire coverage', reason: 'Chimchar line is excellent into Steel-heavy teams.' },
      { dexes: ['66', '67', '68', '447', '448'], move: 'Fighting pressure', reason: 'Fighting lines are reliable into Byron if you kept them trained.' },
      { dexes: ['393', '394', '395'], move: 'Water coverage', reason: 'Piplup line helps into Steelix and general Steel bulk.' },
    ],
    candice: [
      { dexes: ['390', '391', '392'], move: 'Fire coverage', reason: 'Fire pressure is the easiest route into Candice.' },
      { dexes: ['66', '67', '68', '447', '448'], move: 'Fighting pressure', reason: 'Fighting lines hit several Ice targets cleanly.' },
      { dexes: ['74', '75', '76', '95'], move: 'Rock pressure', reason: 'Rock and Ground lines help if your Fire options are limited.' },
    ],
    volkner: [
      { dexes: ['74', '75', '76', '443', '444', '445'], move: 'Ground pressure', reason: 'Ground lines are the cleanest answer into Volkner.' },
      { dexes: ['387', '388', '389', '399', '400'], move: 'Bulk / neutral support', reason: 'Bulky neutral options still help if your Ground line is weak.' },
      { dexes: ['66', '67', '68'], move: 'Strong neutral pressure', reason: 'Fighting lines can still contribute even without direct immunity.' },
    ],
    cyrus: [
      { dexes: ['399', '400', '434', '435', '359'], move: 'Dark pressure', reason: 'Dark lines are useful into the late Platinum story fights.' },
      { dexes: ['447', '448', '396', '397', '398'], move: 'Strong neutral pressure', reason: 'Fast, reliable lines help more than cute type charts here.' },
    ],
    cynthia: [
      { dexes: ['390', '391', '392'], move: 'Fire coverage', reason: 'Fire coverage matters into several Cynthia lines and general League cleanup.' },
      { dexes: ['387', '388', '389', '393', '394', '395', '403', '404', '405'], move: 'Stable STAB and coverage', reason: 'Well-trained starter and Luxray-style cores matter more than a single perfect counter.' },
      { dexes: ['220', '221', '461'], move: 'Ice coverage', reason: 'Ice pressure is valuable into Cynthia’s dragon-side threats.' },
      { dexes: ['443', '444', '445', '447', '448'], move: 'Late heavy-hitter pressure', reason: 'Pseudo-legendaries and Lucario line become real late-game payoff answers.' },
    ],
  };

  const BW_GYM_RECOMMENDATIONS = {
    'cilan/chili/cress': [
      { dexes: ['511', '513', '515'], move: 'Elemental monkey coverage', reason: 'The monkey gift is the intended first-gym equalizer in Black/White.' },
      { dexes: ['495', '496', '497', '498', '499', '500', '501', '502', '503'], move: 'Starter pressure', reason: 'Starter choice still matters even with the monkey gift.' },
      { dexes: ['506', '507', '508'], move: 'Strong neutral pressure', reason: 'Lillipup line gives reliable early damage if your elemental coverage is awkward.' },
    ],
    lenora: [
      { dexes: ['532', '533', '534'], move: 'Fighting pressure', reason: 'Timburr line is one of the cleanest Lenora answers.' },
      { dexes: ['522', '523'], move: 'Electric pressure / speed control', reason: 'Blitzle line helps if you need safer tempo and chip.' },
      { dexes: ['506', '507', '508'], move: 'Bulk / neutral pressure', reason: 'A strong Herdier line can help if you are light on Fighting options.' },
    ],
    burgh: [
      { dexes: ['498', '499', '500', '554', '555'], move: 'Fire coverage', reason: 'Fire lines are the easiest route into Burgh’s Bug-heavy gym.' },
      { dexes: ['519', '520', '521'], move: 'Flying pressure', reason: 'Pidove line is a common, practical answer if you kept it trained.' },
      { dexes: ['540', '541', '542'], move: 'Mirror pressure / utility', reason: 'Sewaddle line and other route bugs can still help if you planned well.' },
    ],
    elesa: [
      { dexes: ['529', '530', '618'], move: 'Ground pressure', reason: 'Ground lines are the cleanest answer into Elesa.' },
      { dexes: ['498', '499', '500', '506', '507', '508'], move: 'Bulk / neutral pressure', reason: 'Strong neutral lines help if you are short on Ground coverage.' },
      { dexes: ['559', '560'], move: 'Bulky neutral pressure', reason: 'Scraggy line can stabilize the matchup if leveled properly.' },
    ],
    clay: [
      { dexes: ['495', '496', '497', '501', '502', '503', '535', '536', '537'], move: 'Grass or Water coverage', reason: 'Water and Grass lines are the cleanest route into Clay.' },
      { dexes: ['522', '523', '571'], move: 'Safe neutral pressure', reason: 'Fast midgame lines can still carry the fight even without perfect type advantage.' },
    ],
    skyla: [
      { dexes: ['522', '523', '595', '596'], move: 'Electric coverage', reason: 'Electric lines are the easiest route into Skyla.' },
      { dexes: ['582', '583', '584'], move: 'Ice coverage', reason: 'Ice pressure matters a lot if you have it ready by this point.' },
      { dexes: ['532', '533', '534'], move: 'Strong neutral pressure', reason: 'Bulky Fighting lines can still contribute if your direct answers are thin.' },
    ],
    brycen: [
      { dexes: ['498', '499', '500', '554', '555'], move: 'Fire coverage', reason: 'Fire pressure is the cleanest route into Brycen.' },
      { dexes: ['532', '533', '534', '559', '560'], move: 'Fighting pressure', reason: 'Fighting lines hit several Ice targets cleanly.' },
      { dexes: ['622', '623', '624', '625'], move: 'Steel / physical pressure', reason: 'Late-game sturdy lines help if your Fire coverage is weak.' },
    ],
    'drayden/iris': [
      { dexes: ['582', '583', '584', '613', '614'], move: 'Ice coverage', reason: 'Ice pressure is the cleanest answer into the final dragon gym.' },
      { dexes: ['610', '611', '612', '633', '634', '635'], move: 'Dragon pressure', reason: 'If you invested in a dragon line, this is where it starts paying back.' },
      { dexes: ['622', '623'], move: 'Bulky neutral pressure', reason: 'Sturdy late-game lines help survive the last gym even without perfect typing.' },
    ],
    'n/ghetsis': [
      { dexes: ['643', '644', '635', '612', '628'], move: 'Late-game heavy pressure', reason: 'The climax rewards strong, well-built endgame lines more than clever gimmicks.' },
      { dexes: ['570', '571', '624', '625'], move: 'Dark pressure', reason: 'Dark lines help into several late Unova threats.' },
      { dexes: ['595', '596', '522', '523'], move: 'Electric pressure', reason: 'Electric lines help steady the broad endgame roster.' },
    ],
  };

  const BW2_GYM_RECOMMENDATIONS = {
    'cheren': [
      { dexes: ['495', '496', '497', '498', '499', '500', '501', '502', '503'], move: 'Starter pressure', reason: 'Your starter is still the clearest opening anchor in the sequel start.' },
      { dexes: ['504', '505', '519', '520', '521'], move: 'Strong neutral pressure', reason: 'Early route normals and birds help you keep Cheren simple and stable.' },
      { dexes: ['179', '180', '181'], move: 'ThunderShock', reason: 'Mareep line is one of the best early B2/W2 route catches and keeps paying off immediately.' },
    ],
    roxie: [
      { dexes: ['179', '180', '181'], move: 'ThunderShock / Electro Ball', reason: 'Mareep line is excellent into Roxie if you trained it from Floccesy Ranch.' },
      { dexes: ['447', '448'], move: 'Fighting pressure', reason: 'Riolu line gives strong neutral pressure and scales well through Virbank.' },
      { dexes: ['519', '520', '521'], move: 'Air Cutter / Flying pressure', reason: 'Pidove line is a practical early answer if your Electric slot is weak.' },
    ],
    burgh: BW_GYM_RECOMMENDATIONS.burgh,
    elesa: BW_GYM_RECOMMENDATIONS.elesa,
    clay: BW_GYM_RECOMMENDATIONS.clay,
    skyla: BW_GYM_RECOMMENDATIONS.skyla,
    brycen: BW_GYM_RECOMMENDATIONS.brycen,
    drayden: BW_GYM_RECOMMENDATIONS['drayden/iris'],
    iris: BW_GYM_RECOMMENDATIONS['n/ghetsis'],
  };

  const ALOLA_GYM_RECOMMENDATIONS = {
    hala: [
      { dexes: ['722', '723', '724', '731', '732', '733'], move: 'Flying pressure', reason: 'Rowlet line and early birds give practical answers into Hala.' },
      { dexes: ['280', '281', '282', '282'], move: 'Psychic coverage', reason: 'Psychic pressure helps if your early route mix gives you one.' },
      { dexes: ['728', '729', '730'], move: 'Fairy/Water pressure', reason: 'Popplio line stays stable and safe through the first grand trial.' },
    ],
    olivia: [
      { dexes: ['728', '729', '730', '722', '723', '724'], move: 'Water or Grass coverage', reason: 'Starter pressure is still the easiest route into Olivia if you kept pace.' },
      { dexes: ['749', '750'], move: 'Ground pressure', reason: 'Mudbray line is one of Akala’s best practical pickups and helps a lot here.' },
      { dexes: ['744', '745'], move: 'Rock pressure / neutral trades', reason: 'Rockruff line can still help if your Water or Grass answers are thin.' },
    ],
    nanu: [
      { dexes: ['728', '729', '730'], move: 'Fairy coverage', reason: 'Primarina line is one of the cleanest late-game answers into Dark pressure.' },
      { dexes: ['753', '754', '764'], move: 'Fairy or Bug pressure', reason: 'Alola route variety gives several usable answers if you kept catches current.' },
      { dexes: ['739', '740', '66', '67', '68'], move: 'Fighting pressure', reason: 'Fighting lines still help if your Fairy plan is weak.' },
    ],
    hapu: [
      { dexes: ['728', '729', '730'], move: 'Water coverage', reason: 'Popplio line is one of the cleanest Hapu answers if trained.' },
      { dexes: ['722', '723', '724', '753', '754'], move: 'Grass coverage', reason: 'Grass pressure helps a lot into the Ground-heavy final grand trial.' },
      { dexes: ['767', '768', '779'], move: 'Water pressure / neutral support', reason: 'Late water-route catches can stabilize the matchup even without perfect coverage.' },
    ],
    kukui: [
      { dexes: ['722', '723', '724', '725', '726', '727', '728', '729', '730'], move: 'Starter coverage core', reason: 'Well-trained starter lines matter more than one gimmick answer in the final battle.' },
      { dexes: ['782', '783', '784', '745'], move: 'Late heavy pressure', reason: 'Pseudo-legendary or late-form payoff lines are exactly what the endgame rewards.' },
      { dexes: ['776', '778', '777'], move: 'Strong neutral pressure', reason: 'Distinct Alola lines still shine if you kept them current through the islands.' },
    ],
    necrozma: [
      { dexes: ['778', '777', '730'], move: 'Status, Fairy, or dark-leaning support', reason: 'Ultra Necrozma rewards broad prep and survivable pressure more than a single hard counter.' },
      { dexes: ['782', '783', '784'], move: 'Dragon pressure', reason: 'Late heavy hitters help if you invested in them before the climax.' },
      { dexes: ['728', '729', '730', '725', '726', '727'], move: 'Starter pressure and support', reason: 'Your starter line should still be part of the Ultra Necrozma plan if leveled properly.' },
    ],
  };

  const XY_GYM_RECOMMENDATIONS = {
    viola: [
      { dexes: ['653', '654', '655', '667', '668'], move: 'Fire coverage', reason: 'Fennekin and Litleo lines are some of the cleanest answers into Viola.' },
      { dexes: ['661', '662', '663'], move: 'Flying pressure', reason: 'Fletchling line is a practical early answer if you kept it trained.' },
      { dexes: ['650', '651', '652'], move: 'Bulk / neutral pressure', reason: 'Chespin line can still stabilize the fight if your direct coverage is weaker.' },
    ],
    grant: [
      { dexes: ['656', '657', '658', '650', '651', '652'], move: 'Water or Grass coverage', reason: 'Starter pressure is the simplest route into Grant.' },
      { dexes: ['694', '695'], move: 'Ground/Electric support', reason: 'Helioptile line helps long-term even if it is not your main Grant answer.' },
      { dexes: ['674', '675'], move: 'Fighting pressure', reason: 'Pancham line gives useful direct pressure into Rock teams.' },
    ],
    korrina: [
      { dexes: ['661', '662', '663', '701'], move: 'Flying pressure', reason: 'Flying coverage is the cleanest route into Korrina.' },
      { dexes: ['280', '281', '282'], move: 'Psychic pressure', reason: 'Psychic coverage helps if your Kalos routes gave you one early.' },
      { dexes: ['656', '657', '658'], move: 'Flexible neutral pressure', reason: 'Froakie line and other fast lines still work well here.' },
    ],
    ramos: [
      { dexes: ['653', '654', '655', '667', '668'], move: 'Fire coverage', reason: 'Fire pressure is the easiest route into Ramos.' },
      { dexes: ['661', '662', '663'], move: 'Flying pressure', reason: 'Bird lines stay practical into Grass-heavy teams.' },
      { dexes: ['736', '737', '738', '679', '680', '681'], move: 'Bug or Steel support', reason: 'Broader roster depth still helps even if you lack one perfect answer.' },
    ],
    clemont: [
      { dexes: ['749', '750', '551', '552', '553'], move: 'Ground pressure', reason: 'Ground lines are still the cleanest route into Electric gyms.' },
      { dexes: ['650', '651', '652', '674', '675'], move: 'Bulk / neutral pressure', reason: 'Well-trained neutral lines help if your Ground coverage is thin.' },
      { dexes: ['694', '695'], move: 'Electric mirror / utility', reason: 'Heliolisk line helps the wider Kalos run even if it is not an immunity answer.' },
    ],
    valerie: [
      { dexes: ['679', '680', '681'], move: 'Steel pressure', reason: 'Honedge line is one of the clearest practical answers into Fairy teams.' },
      { dexes: ['568', '569', '690', '691'], move: 'Poison pressure', reason: 'Poison lines help a lot if your Steel answer is weaker.' },
      { dexes: ['653', '654', '655', '656', '657', '658'], move: 'Stable neutral coverage', reason: 'Starter lines remain very useful if you kept them current.' },
    ],
    olympia: [
      { dexes: ['679', '680', '681'], move: 'Ghost pressure', reason: 'Aegislash line is one of the best practical late Kalos answers into Psychic teams.' },
      { dexes: ['692', '693', '690', '691', '686', '687'], move: 'Dark or Ghost support', reason: 'Dark or spooky route lines help into Olympia if you caught them.' },
      { dexes: ['704', '705', '706'], move: 'Late heavy neutral pressure', reason: 'Goodra line and other late-game bulk still matter more than cute one-offs.' },
    ],
    wulfric: [
      { dexes: ['653', '654', '655', '667', '668'], move: 'Fire coverage', reason: 'Fire pressure is the cleanest route into Wulfric.' },
      { dexes: ['674', '675', '447', '448'], move: 'Fighting pressure', reason: 'Fighting lines help into several Ice targets cleanly.' },
      { dexes: ['679', '680', '681'], move: 'Steel pressure', reason: 'Steel lines are steady into the last gym if your Fire plan is weaker.' },
    ],
    diantha: [
      { dexes: ['653', '654', '655', '656', '657', '658'], move: 'Starter coverage core', reason: 'Well-trained starters matter more than a single perfect counter in the Kalos League.' },
      { dexes: ['704', '705', '706', '701', '448'], move: 'Late heavy pressure', reason: 'Pseudo-legendary and Lucario-style payoff lines are exactly what the late game rewards.' },
      { dexes: ['679', '680', '681'], move: 'Steel/Ghost pressure', reason: 'Aegislash line stays valuable across the whole Diantha fight.' },
    ],
  };

  const SWSH_GYM_RECOMMENDATIONS = {
    milo: [
      { dexes: ['813', '814', '815', '840', '841', '842'], move: 'Fire coverage', reason: 'Scorbunny and early fire-friendly catches are the cleanest Milo answers.' },
      { dexes: ['821', '822', '823'], move: 'Flying pressure', reason: 'Rookidee line is a practical early answer if you kept it trained.' },
      { dexes: ['835', '836'], move: 'Flexible neutral support', reason: 'Yamper line still helps a lot with pace and route cleanup even if not super effective.' },
    ],
    nessa: [
      { dexes: ['810', '811', '812', '840', '841', '842'], move: 'Grass coverage', reason: 'Grass pressure is still the easiest route into Nessa.' },
      { dexes: ['835', '836'], move: 'Electric coverage', reason: 'Yamper line is one of the clearest practical Nessa answers.' },
      { dexes: ['824', '825', '826'], move: 'Status / support', reason: 'Early route bugs and support lines still help if your direct answers are thin.' },
    ],
    kabu: [
      { dexes: ['816', '817', '818', '843', '844'], move: 'Water or Ground coverage', reason: 'Sobble and Ground route pickups are the cleanest Kabu answers.' },
      { dexes: ['831', '832', '833', '834'], move: 'Bulk and stable pressure', reason: 'Bulky early lines help you survive the gym challenge format.' },
      { dexes: ['840', '841', '842'], move: 'Neutral pressure', reason: 'Appletun or Flapple planning can still help if your Water slot is weak.' },
    ],
    'bea/allister': [
      { dexes: ['856', '857', '858', '859', '860', '861'], move: 'Psychic or Fairy pressure', reason: 'Midgame Galar lines give useful coverage into either version gym if you kept them current.' },
      { dexes: ['821', '822', '823'], move: 'Flying pressure', reason: 'Corviknight line stays useful into Fighting-heavy Sword runs.' },
      { dexes: ['859', '860', '861'], move: 'Dark/Fairy pressure', reason: 'Impidimp line helps especially well into ghost-leaning Shield runs once available.' },
    ],
    opal: [
      { dexes: ['859', '860', '861', '879'], move: 'Steel or Poison pressure', reason: 'Steel and dark-fairy lines are some of the cleanest practical Opal answers.' },
      { dexes: ['843', '844', '874'], move: 'Strong neutral pressure', reason: 'Bulky route catches still help even without perfect typing.' },
      { dexes: ['813', '814', '815'], move: 'Starter support', reason: 'Cinderace line remains a strong neutral offensive option here.' },
    ],
    'gordie/melony': [
      { dexes: ['813', '814', '815'], move: 'Fire coverage', reason: 'Cinderace line is one of the cleanest practical answers into Ice-heavy versions.' },
      { dexes: ['816', '817', '818', '843', '844'], move: 'Water or Ground pressure', reason: 'Water/Ground route lines help a lot into Rock-heavy versions.' },
      { dexes: ['879'], move: 'Steel pressure', reason: 'Copperajah line gives sturdy value across either version split.' },
    ],
    piers: [
      { dexes: ['856', '857', '858', '859', '860', '861'], move: 'Fairy pressure', reason: 'Fairy lines are the cleanest route into Piers if you trained them.' },
      { dexes: ['852', '853', '739', '740'], move: 'Fighting pressure', reason: 'Fighting lines help a lot if your Fairy plan is weaker.' },
      { dexes: ['810', '811', '812', '816', '817', '818'], move: 'Stable starter pressure', reason: 'Well-trained starters still carry a lot of weight in the late Galar gyms.' },
    ],
    raihan: [
      { dexes: ['872', '873'], move: 'Ice coverage', reason: 'Frosmoth line is one of the clearest late Galar anti-Dragon answers if you built it.' },
      { dexes: ['859', '860', '861', '856', '857', '858'], move: 'Fairy pressure', reason: 'Fairy lines help a lot into Dragon-centric late-game fights.' },
      { dexes: ['885', '886', '887', '884'], move: 'Late heavy pressure', reason: 'Pseudo and late-game lines are exactly what the endgame expects you to cash in.' },
    ],
  };

  const LETSGO_GYM_RECOMMENDATIONS = {
    brock: [
      { dexes: ['7', '8', '9', '1', '2', '3'], move: 'Water or Grass pressure', reason: 'Water and Grass lines are still the cleanest route into Brock.' },
      { dexes: ['25'], move: 'Partner support and chip', reason: 'Partner utility still helps, but direct super-effective pressure is better.' },
    ],
    misty: [
      { dexes: ['25', '26', '43', '44', '45', '69', '70', '71'], move: 'Electric or Grass pressure', reason: 'Electric and Grass lines are still the simplest Misty answers.' },
    ],
    'lt. surge': [
      { dexes: ['50', '51', '27', '28'], move: 'Ground pressure', reason: 'Ground lines are still the cleanest route into Lt. Surge.' },
    ],
    erika: [
      { dexes: ['37', '38', '58', '59', '4', '5', '6'], move: 'Fire coverage', reason: 'Fire pressure is the simplest Erika answer.' },
      { dexes: ['16', '17', '18', '21', '22'], move: 'Flying pressure', reason: 'Bird lines stay useful into Grass-heavy teams.' },
    ],
    koga: [
      { dexes: ['27', '28', '50', '51'], move: 'Ground pressure', reason: 'Ground lines hit the Poison gym cleanly.' },
      { dexes: ['92', '93', '94'], move: 'Ghost pressure', reason: 'Ghost lines help once you reach the later Kanto cities.' },
    ],
    sabrina: [
      { dexes: ['92', '93', '94'], move: 'Ghost pressure', reason: 'Ghost coverage is one of the clearest Sabrina answers.' },
      { dexes: ['123', '127'], move: 'Bug pressure', reason: 'Late Bug lines help if your Ghost plan is weaker.' },
    ],
    blaine: [
      { dexes: ['7', '8', '9', '54', '55', '60', '61', '62'], move: 'Water pressure', reason: 'Water lines are still the easiest route into Blaine.' },
    ],
    giovanni: [
      { dexes: ['7', '8', '9', '43', '44', '45'], move: 'Water or Grass pressure', reason: 'Water and Grass pressure simplify Giovanni a lot.' },
    ],
    champion: [
      { dexes: ['149', '130', '65', '94'], move: 'Late heavy pressure', reason: 'Kanto rewards broad, strong late-game lines more than one gimmick answer.' },
    ],
  };

  const SV_GYM_RECOMMENDATIONS = {
    katy: [
      { dexes: ['909', '910', '911', '667', '668', '935'], move: 'Fire coverage', reason: 'Fire pressure is still the easiest route into Katy, and early Charcadet fits this window nicely.', modes: ['gym', 'balanced'] },
      { dexes: ['16', '17', '18', '941', '973'], move: 'Flying pressure', reason: 'Flying lines are very practical into the first Paldea gym, especially once Flamigo shows up.', modes: ['gym', 'balanced'] },
      { dexes: ['932', '933', '934'], move: 'Rock pressure', reason: 'Nacli’s line is one of the cleanest Paldea-native answers if you swept the early province properly.', modes: ['titan', 'balanced'] },
    ],
    brassius: [
      { dexes: ['909', '910', '911', '667', '668', '935'], move: 'Fire coverage', reason: 'Fire pressure is the cleanest route into Brassius, and Charcadet is one of the strongest early Paldea options.', modes: ['gym', 'balanced'] },
      { dexes: ['941', '16', '17', '18', '973'], move: 'Flying pressure', reason: 'Flying lines stay useful if your Fire slot is weaker.', modes: ['gym', 'balanced'] },
    ],
    iono: [
      { dexes: ['27', '28', '50', '51', '968'], move: 'Ground pressure', reason: 'Ground pressure is still the easiest answer into Iono.', modes: ['gym', 'balanced'] },
    ],
    kofu: [
      { dexes: ['906', '907', '908', '928', '929', '930', '921', '922', '923', '938', '939'], move: 'Grass or Electric pressure', reason: 'Grass and Electric lines are still the cleanest route into Kofu, especially if you kept Smoliv and Tadbulb lines visible.', modes: ['gym', 'balanced'] },
    ],
    larry: [
      { dexes: ['66', '67', '68', '979', '973'], move: 'Fighting pressure', reason: 'Fighting lines are the easiest route into Larry’s Normal team, and Flamigo is one of the most practical Paldea-native answers.', modes: ['gym', 'balanced'] },
    ],
    ryme: [
      { dexes: ['94', '445', '448', '971', '972'], move: 'Ghost or Dark pressure', reason: 'Ghost and Dark coverage help most into Ryme, and Greavard’s line fits naturally into the late Paldea route flow.', modes: ['balanced', 'gym'] },
    ],
    tulip: [
      { dexes: ['94', '445', '448', '971', '972'], move: 'Ghost or Dark pressure', reason: 'Ghost and Dark coverage still make Tulip much cleaner.', modes: ['gym', 'balanced'] },
      { dexes: ['123', '127', '919', '920'], move: 'Bug pressure', reason: 'Bug coverage helps if your Ghost or Dark roster is thinner, and Lokix is one of the cleanest Paldea-native examples.', modes: ['balanced'] },
    ],
    grusha: [
      { dexes: ['909', '910', '911', '667', '668', '935'], move: 'Fire coverage', reason: 'Fire pressure is still the easiest route into Grusha.', modes: ['gym', 'balanced'] },
      { dexes: ['66', '67', '68', '979'], move: 'Fighting pressure', reason: 'Fighting lines help into several Ice targets cleanly.', modes: ['gym', 'balanced'] },
      { dexes: ['932', '933', '934'], move: 'Rock pressure', reason: 'Naclstack and Garganacl give you a sturdy Paldea-native route if your Fire slots are stretched.', modes: ['titan', 'balanced'] },
    ],
    geeta: [
      { dexes: ['998', '979', '983', '970', '977'], move: 'Late heavy pressure', reason: 'Paldea’s endgame rewards broad, powerful late-game lines more than one perfect answer, especially once your late Titan and evolution payoffs are online.', modes: ['titan', 'balanced'] },
    ],
  };

  const ZA_FIGHT_RECOMMENDATIONS = {
    zach: [
      { dexes: ['179', '180', '181'], move: 'Electric pressure', reason: 'Mareep handles the early Flying slot cleanly and keeps value after the opener.' },
      { dexes: ['659', '660'], move: 'Ground pressure', reason: 'Bunnelby gives you a simple answer to Pikachu while still contributing real damage.' },
      { dexes: ['13', '14', '15'], move: 'Bug pressure', reason: 'Beedrill is one of the easiest early carries if you already caught the line.' },
    ],
    yvon: [
      { dexes: ['13', '14', '15'], move: 'Poison pressure', reason: 'Beedrill is one of the cleanest answers into the fairy core in this match.' },
      { dexes: ['688', '689'], move: 'Rock pressure', reason: 'Binacle and Barbaracle keep Vivillon from taking over the pace.' },
      { dexes: ['661', '662', '663'], move: 'Flying pressure', reason: 'Fletchling’s line gives fast neutral damage and tempo control.' },
    ],
    xavi: [
      { dexes: ['661', '662', '663'], move: 'Flying pressure', reason: 'Fletchinder helps control Venipede and Roselia while still dealing real damage to the rest.' },
      { dexes: ['13', '14', '15'], move: 'Bug pressure', reason: 'Beedrill stays efficient into the early ladder matchups if you kept it leveled.' },
      { dexes: ['214'], move: 'Strong physical pressure', reason: 'Heracross trades well into the bulkier parts of Xavi’s team.' },
    ],
    rintaro: [
      { dexes: ['228', '229'], move: 'Dark or Fire coverage', reason: 'Houndour pressures Simisage and gives you a cleaner opening than random filler catches.' },
      { dexes: ['688', '689'], move: 'Rock coverage', reason: 'Binacle and Barbaracle help stabilize the monkey rotation by resisting and hitting back hard.' },
      { dexes: ['25', '26', '172'], move: 'Electric pressure', reason: 'Pikachu or Raichu give you a clean answer into Simipour if you already caught the line.' },
    ],
    vinnie: [
      { dexes: ['674', '675'], move: 'Fighting pressure', reason: 'Pancham and Pangoro are some of the best answers into the Dark-heavy parts of Vinnie’s team.' },
      { dexes: ['214'], move: 'Fighting pressure', reason: 'Heracross hits hard enough that it still matters even once Mega Drampa comes out.' },
      { dexes: ['280', '281', '282'], move: 'Fairy pressure', reason: 'The Ralts line gives you a safer answer into Mega Drampa than brute-forcing with neutral damage.' },
    ],
    canari: [
      { dexes: ['443', '444', '445'], move: 'Ground pressure', reason: 'Gible’s line is one of the cleanest ways to punish the Electric-heavy core.' },
      { dexes: ['322', '323'], move: 'Ground or Fire pressure', reason: 'Numel and Camerupt help into the Electric team while still threatening good damage.' },
      { dexes: ['672', '673'], move: 'Bulky neutral damage', reason: 'Gogoat is a strong backup if your Ground lines are thin or awkward to deploy.' },
    ],
    ivor: [
      { dexes: ['280', '281', '282'], move: 'Psychic or Fairy pressure', reason: 'The Ralts line is one of the cleanest ways to answer a Fighting-heavy roster.' },
      { dexes: ['63', '64', '65'], move: 'Psychic pressure', reason: 'Abra and Kadabra give you fast special pressure if you already caught and trained them.' },
      { dexes: ['679', '680', '681'], move: 'Steel or Ghost pressure', reason: 'Honedge and its line give you excellent matchup value if they are already on your team.' },
    ],
    corbeau: [
      { dexes: ['120', '121'], move: 'Water or Psychic pressure', reason: 'Starmie is one of the cleanest answers if you already caught and evolved the line.' },
      { dexes: ['322', '323'], move: 'Ground or Fire pressure', reason: 'Camerupt helps punish both the Poison and Steel-leaning parts of the fight.' },
      { dexes: ['63', '64', '65'], move: 'Psychic pressure', reason: 'Abra or Kadabra give you clean punishment into Arbok and Roserade if they are already trained.' },
    ],
    jacinthe: [
      { dexes: ['447', '448'], move: 'Steel or Fighting pressure', reason: 'Lucario is one of the cleanest answers into Jacinthe’s mixed fairy-heavy lineup.' },
      { dexes: ['322', '323'], move: 'Fire or Ground pressure', reason: 'Camerupt helps cover Mawile and keeps useful pressure into the rest of the team.' },
      { dexes: ['607', '608', '609'], move: 'Ghost or Fire pressure', reason: 'Litwick’s line gives useful pressure into Jacinthe without overlapping too much with your other answers.' },
    ],
    grisham: [
      { dexes: ['280', '281', '282'], move: 'Fairy pressure', reason: 'Gardevoir is one of the best all-around answers into Grisham’s late-game spread.' },
      { dexes: ['322', '323'], move: 'Ground or Fire pressure', reason: 'Camerupt helps into Pyroar and still matters against the back half if kept healthy.' },
      { dexes: ['459', '460', '712', '713'], move: 'Ice pressure', reason: 'Ice coverage matters a lot once Salamence shows up, so a caught Ice line is worth surfacing here.' },
    ],
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return {
        version: parsed.version || versionButtons[0]?.dataset.version || gameId,
        caught: parsed.caught || {},
        starterDex: parsed.starterDex || null,
        guideSteps: parsed.guideSteps || {},
        checkedItems: parsed.checkedItems || {},
        verifiedTargets: parsed.verifiedTargets || {},
        fieldNotes: parsed.fieldNotes || {},
        verifiedLocations: parsed.verifiedLocations || {},
        currentObjectiveNote: parsed.currentObjectiveNote || '',
        currentWildZone: parsed.currentWildZone || 'all',
        paldeaPathMode: parsed.paldeaPathMode || 'balanced',
        platinumGuideLens: parsed.platinumGuideLens || 'catching',
        platinumGuideGroups: parsed.platinumGuideGroups || {},
        platinumBadges: Array.isArray(parsed.platinumBadges) ? parsed.platinumBadges.slice(0, 8) : new Array(8).fill(false),
        zaScope: parsed.zaScope || 'main',
        zaHideCompleted: Boolean(parsed.zaHideCompleted),
        zaSessionSteps: parsed.zaSessionSteps || {},
        zaTeamSlots: parsed.zaTeamSlots || {},
        zaTeamLevels: parsed.zaTeamLevels || {},
        zaTeamMoves: parsed.zaTeamMoves || {},
        activeTab: parsed.activeTab || 'guide',
        selectedGuideChapter: parsed.selectedGuideChapter || guideButtons[0]?.dataset.genericGuideButton || null,
      };
    } catch {
      return {
        version: versionButtons[0]?.dataset.version || gameId,
        caught: {},
        starterDex: null,
        guideSteps: {},
        checkedItems: {},
        verifiedTargets: {},
        fieldNotes: {},
        verifiedLocations: {},
        currentObjectiveNote: '',
        currentWildZone: 'all',
        paldeaPathMode: 'balanced',
        platinumGuideLens: 'catching',
        platinumGuideGroups: {},
        platinumBadges: new Array(8).fill(false),
        zaScope: 'main',
        zaHideCompleted: false,
        zaSessionSteps: {},
        zaTeamSlots: {},
        zaTeamLevels: {},
        zaTeamMoves: {},
        activeTab: 'guide',
        selectedGuideChapter: guideButtons[0]?.dataset.genericGuideButton || null,
      };
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
    scheduleServerSave();
  }

  function mergeState(remoteState, localState) {
    const objectKeys = ['caught', 'guideSteps', 'checkedItems', 'verifiedTargets', 'fieldNotes', 'verifiedLocations', 'zaSessionSteps', 'zaTeamSlots', 'zaTeamLevels', 'zaTeamMoves', 'platinumGuideGroups'];
    const merged = { ...(remoteState || {}), ...(localState || {}) };
    objectKeys.forEach(key => {
      merged[key] = { ...((remoteState && remoteState[key]) || {}), ...((localState && localState[key]) || {}) };
    });
    return merged;
  }

  function coverageTagsForText(text) {
    const value = String(text || '').toLowerCase();
    const tags = [];
    const coverageMap = [
      ['electric', ['electric', 'thunder', 'volt', 'shock', 'zap']],
      ['ground', ['ground', 'earth', 'mud', 'dig', 'quake', 'drill']],
      ['rock', ['rock', 'stone', 'gem', 'boulder']],
      ['bug', ['bug', 'x-scissor', 'leech life', 'pin missile', 'u-turn', 'silver wind', 'signal beam']],
      ['poison', ['poison', 'sludge', 'gunk', 'venoshock']],
      ['flying', ['flying', 'wing', 'air', 'hurricane', 'aerial ace', 'acrobatics', 'peck', 'brave bird', 'gust']],
      ['dark', ['dark', 'bite', 'crunch', 'foul play', 'dark pulse', 'night slash', 'snarl']],
      ['fire', ['fire', 'flame', 'heat', 'burn', 'ember', 'inferno', 'overheat', 'lava', 'pyro']],
      ['water', ['water', 'bubble', 'surf', 'hydro', 'aqua', 'wave', 'scald']],
      ['psychic', ['psychic', 'psy', 'confusion', 'zen headbutt', 'future sight', 'stored power']],
      ['fighting', ['fight', 'punch', 'kick', 'close combat', 'brick break', 'drain punch', 'aura sphere', 'mach punch', 'karate chop']],
      ['fairy', ['fairy', 'moonblast', 'dazzling gleam', 'play rough', 'kiss', 'sparkly']],
      ['steel', ['steel', 'iron', 'metal', 'flash cannon', 'gyro ball']],
      ['ghost', ['ghost', 'shadow', 'hex', 'ominous', 'phantom', 'night shade']],
      ['grass', ['grass', 'leaf', 'seed', 'petal', 'vine', 'solar', 'giga drain', 'energy ball']],
      ['ice', ['ice', 'frost', 'freeze', 'blizzard', 'icy', 'beam']],
      ['dragon', ['dragon', 'draco', 'outrage', 'claw']],
      ['normal', ['normal', 'hyper beam', 'return', 'tackle', 'slam']],
    ];
    coverageMap.forEach(([tag, patterns]) => {
      if (patterns.some(pattern => value.includes(pattern))) tags.push(tag);
    });
    return tags;
  }

  function moveCoverageTags(moveName) {
    return coverageTagsForText(moveName);
  }

  function teamMovesForSlot(slot) {
    return ['1', '2', '3', '4']
      .map(index => String(state.zaTeamMoves?.[`${slot}-${index}`] || '').trim())
      .filter(Boolean);
  }

  function candidateCoverageTags(candidate) {
    return coverageTagsForText(candidate?.move || '');
  }

  function zaCaughtRosterOptions() {
    return cards
      .filter(card => Boolean(state.caught?.[card.dataset.dex]))
      .sort((a, b) => regionalDexNumber(a) - regionalDexNumber(b));
  }

  function zaTeamEntryForSlot(slot) {
    const dex = String(state.zaTeamSlots?.[slot] || '');
    if (!dex) return null;
    const card = cardByDex(dex);
    if (!card) return null;
    const rawLevel = Number(state.zaTeamLevels?.[slot] || 0);
    return {
      slot,
      dex,
      card,
      level: Number.isFinite(rawLevel) && rawLevel > 0 ? rawLevel : null,
      moves: teamMovesForSlot(slot),
    };
  }

  function zaActiveTeamEntries() {
    return ['1', '2', '3', '4', '5', '6']
      .map(slot => zaTeamEntryForSlot(slot))
      .filter(Boolean);
  }

  function syncZaTeamPlanner() {
    if (gameId !== 'legends-za') return;
    const caughtRoster = zaCaughtRosterOptions();
    let pruned = false;
    const optionMarkup = ['<option value="">Empty slot</option>']
      .concat(caughtRoster.map(card => `<option value="${card.dataset.dex}">#${String(card.dataset.regionalDex || card.dataset.dex).padStart(3, '0')} ${card.dataset.displayName}</option>`))
      .join('');

    zaTeamSlotSelects.forEach(select => {
      const slot = String(select.dataset.zaTeamSlot || '');
      const previousValue = String(state.zaTeamSlots?.[slot] || '');
      select.innerHTML = optionMarkup;
      select.value = previousValue && caughtRoster.some(card => card.dataset.dex === previousValue) ? previousValue : '';
      if (previousValue && !select.value) {
        delete state.zaTeamSlots[slot];
        delete state.zaTeamLevels[slot];
        pruned = true;
      }
    });

    zaTeamLevelInputs.forEach(input => {
      const slot = String(input.dataset.zaTeamLevel || '');
      const value = state.zaTeamLevels?.[slot];
      input.value = value ? String(value) : '';
      input.disabled = !state.zaTeamSlots?.[slot];
    });

    zaTeamMoveInputs.forEach(input => {
      const key = String(input.dataset.zaTeamMove || '');
      const slot = key.split('-')[0] || '';
      input.value = state.zaTeamMoves?.[key] || '';
      input.disabled = !state.zaTeamSlots?.[slot];
    });

    zaTeamSlotCards.forEach(card => {
      const slot = String(card.dataset.zaTeamSlotCard || '');
      const entry = zaTeamEntryForSlot(slot);
      const status = zaTeamSlotStatuses.find(node => node.dataset.zaTeamSlotStatus === slot);
      card.classList.toggle('active', Boolean(entry));
      card.classList.toggle('ready', Boolean(entry?.level && entry.level >= 40));
      if (status) {
        if (!entry) {
          status.textContent = 'No Pokemon selected';
        } else if (entry.level) {
          status.textContent = `${entry.card.dataset.displayName} · Lv. ${entry.level}${entry.moves.length ? ` · ${entry.moves.length} moves` : ''}`;
        } else {
          status.textContent = `${entry.card.dataset.displayName} · Level not set${entry.moves.length ? ` · ${entry.moves.length} moves` : ''}`;
        }
      }
    });
    if (pruned) saveState();
  }

  async function loadServerState() {
    try {
      const response = await fetch(`/api/v2/state/${gameId}`, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      if (!response.ok) return;
      const payload = await response.json();
      const remoteState = payload?.state || {};
      if (!Object.keys(remoteState).length) return;
      state = mergeState(remoteState, state);
      activeZaScopeFilter = state.zaScope || 'main';
      refreshShell();
    } catch {
      // Guests or offline users stay on local-only persistence.
    }
  }

  function scheduleServerSave() {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(async () => {
      try {
        await fetch(`/api/v2/state/${gameId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ state }),
        });
      } catch {
        // Local persistence still succeeds even if the server save fails.
      }
    }, 250);
  }

  function syncZaHideCompleted() {
    shell.classList.toggle('za-hide-completed', Boolean(state.zaHideCompleted));
    zaHideCompletedButton?.classList.toggle('active', Boolean(state.zaHideCompleted));
    if (zaHideCompletedButton) {
      zaHideCompletedButton.textContent = `Hide completed: ${state.zaHideCompleted ? 'on' : 'off'}`;
    }
  }

  function syncSvPathMode() {
    if (gameId !== 'scarlet-violet') return;
    const mode = state.paldeaPathMode || 'balanced';
    svPathButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.svPathMode === mode);
    });
    svPathPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.svPathPanel === mode);
    });
    svPathNotes.forEach(note => {
      note.classList.toggle('active', note.dataset.svPathNote === mode);
    });
    svPreferredElements.forEach(element => {
      const preferred = String(element.dataset.svPreferredModes || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      const relevant = preferred.length > 0;
      const matches = relevant && preferred.includes(mode);
      element.classList.toggle('sv-path-recommended', mode !== 'balanced' && matches);
      element.classList.toggle('sv-path-muted', mode !== 'balanced' && relevant && !matches);
    });
  }

  function regionalDexNumber(card) {
    return Number(card.dataset.regionalDex || card.dataset.dex || 0);
  }

  function svCardRouteScore(card) {
    if (gameId !== 'scarlet-violet') return 0;
    const mode = state.paldeaPathMode || 'balanced';
    if (mode === 'balanced') return 0;
    const preferred = String(card.dataset.svPreferredModes || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    if (!preferred.length) return 0;
    return preferred.includes(mode) ? 2 : -1;
  }

  function orderSvCards() {
    if (gameId !== 'scarlet-violet' || !cardGrid) return;
    const ordered = [...cards].sort((a, b) => {
      const scoreDiff = svCardRouteScore(b) - svCardRouteScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      const caughtDiff = Number(Boolean(state.caught?.[a.dataset.dex])) - Number(Boolean(state.caught?.[b.dataset.dex]));
      if (caughtDiff !== 0) return caughtDiff;
      return regionalDexNumber(a) - regionalDexNumber(b);
    });
    ordered.forEach(card => cardGrid.appendChild(card));
  }

  function titleCase(value) {
    return String(value || '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function cardByDex(dex) {
    return cards.find(card => card.dataset.dex === String(dex));
  }

  function isStarterDex(dex) {
    return starterButtons.some(button => button.dataset.genericStarter === String(dex));
  }

  function setCardCaught(card, caught) {
    card.classList.toggle('status-caught', caught);
    card.classList.toggle('status-catchable', !caught);
    document.querySelectorAll(`[data-generic-caught="${card.dataset.dex}"]`).forEach(check => {
      check.checked = caught;
      check.closest('.v2-card-caught, .v2-target-check')?.classList.toggle('checked', caught);
    });
    guideTargetCards
      .filter(target => target.dataset.genericGuideTarget === card.dataset.dex)
      .forEach(target => target.classList.toggle('caught', caught));
  }

  function syncVerifiedTargets() {
    zaVerifiedChecks.forEach(check => {
      const done = Boolean(state.verifiedTargets?.[check.dataset.zaVerified]);
      check.checked = done;
      check.closest('.v2-target-card')?.classList.toggle('verified', done);
      check.closest('.v2-target-verified-check')?.classList.toggle('checked', done);
    });
    applyZaTargetFilter();
  }

  function targetMatchesZaFilter(target) {
    const confidence = target.dataset.zaConfidence || '';
    const isDlc = confidence.includes('dlc') || confidence.includes('postgame');
    if (activeZaScopeFilter === 'main' && isDlc) return false;
    let confidenceMatch = true;
    if (activeZaConfidenceFilter === 'official') {
      confidenceMatch = confidence === 'official';
    } else if (activeZaConfidenceFilter === 'location-tbd') {
      confidenceMatch = confidence.includes('location tbd');
    } else if (activeZaConfidenceFilter === 'mega') {
      confidenceMatch = confidence.includes('mega planning');
    } else if (activeZaConfidenceFilter === 'dlc') {
      confidenceMatch = confidence.includes('dlc');
    }

    if (!confidenceMatch) return false;
    if (activeZaTargetFilter === 'all') return true;
    const verified = Boolean(state.verifiedTargets?.[target.dataset.genericGuideTarget]);
    const caught = Boolean(state.caught?.[target.dataset.genericGuideTarget]);
    if (activeZaTargetFilter === 'caught') return caught;
    if (activeZaTargetFilter === 'uncaught') return !caught;
    if (activeZaTargetFilter === 'verified') return verified;
    if (activeZaTargetFilter === 'needs-verification') return !verified;
    return true;
  }

  function applyZaTargetFilter() {
    if (!zaTargetFilterButtons.length) return;
    guideTargetCards.forEach(target => {
      target.classList.toggle('za-filtered-out', !targetMatchesZaFilter(target));
    });
    zaTargetFilterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.zaTargetFilter === activeZaTargetFilter);
    });
    zaScopeFilterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.zaScopeFilter === activeZaScopeFilter);
    });
    zaConfidenceFilterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.zaConfidenceFilter === activeZaConfidenceFilter);
    });
  }

  function syncFieldNotes() {
    zaNoteInputs.forEach(input => {
      const value = state.fieldNotes?.[input.dataset.zaFieldNote] || '';
      if (input.value !== value) input.value = value;
      const status = document.querySelector(`[data-za-note-status="${input.dataset.zaFieldNote}"]`);
      if (status) status.textContent = value.trim() ? 'noted' : 'empty';
      input.closest('.v2-za-note-panel')?.classList.toggle('has-note', Boolean(value.trim()));
    });
  }

  function syncSessionSteps() {
    zaSessionChecks.forEach(check => {
      const done = Boolean(state.zaSessionSteps?.[check.dataset.zaSessionStep]);
      check.checked = done;
      check.closest('label')?.classList.toggle('done', done);
    });
    if (zaSessionProgress) {
      const done = zaSessionChecks.filter(check => Boolean(state.zaSessionSteps?.[check.dataset.zaSessionStep])).length;
      zaSessionProgress.textContent = `${done}/${zaSessionChecks.length}`;
    }
  }

  function syncVerifiedLocations() {
    zaLocationInputs.forEach(input => {
      const value = state.verifiedLocations?.[input.dataset.zaLocation] || '';
      if (input.value !== value) input.value = value;
      input.closest('.v2-target-card')?.classList.toggle('has-location-note', Boolean(value.trim()));
    });
    syncZaDetail();
  }

  function openZaDetailModal() {
    if (!zaDetailModal) return;
    zaDetailModal.classList.add('open');
    zaDetailModal.setAttribute('aria-hidden', 'false');
  }

  function guideTargetForDex(dex) {
    return guideTargetCards.find(target => target.dataset.genericGuideTarget === String(dex));
  }

  function syncZaDetail() {
    if (!zaDetailPanel || !selectedDex) return;
    const card = cardByDex(selectedDex);
    if (!card) return;
    cards.forEach(item => item.classList.toggle('selected', item.dataset.dex === String(selectedDex)));
    const guideTarget = guideTargetForDex(selectedDex);
    const regional = card.dataset.regionalDex ? `#${String(card.dataset.regionalDex).padStart(3, '0')}` : `#${String(selectedDex).padStart(3, '0')}`;
    const national = card.dataset.regionalDex ? ` · Nat #${String(selectedDex).padStart(3, '0')}` : '';
    const caught = Boolean(state.caught[selectedDex]);
    const verified = Boolean(state.verifiedTargets?.[selectedDex]);
    const location = state.verifiedLocations?.[selectedDex] || '';

    zaDetailPanel.classList.add('active');
    if (zaDetailSprite && zaDetailSprite.src !== card.dataset.spriteUrl) {
      zaDetailSprite.src = card.dataset.spriteUrl || '';
      zaDetailSprite.dataset.fallbackSrc = card.dataset.spriteFallback || '';
      zaDetailSprite.alt = `${card.dataset.displayName || 'Selected Pokémon'} artwork`;
      zaDetailSprite.closest('.v2-za-detail-sprite')?.classList.toggle('missing', !card.dataset.spriteUrl);
    }
    if (zaDetailNumber) zaDetailNumber.textContent = `${regional}${national}`;
    if (zaDetailName) zaDetailName.textContent = card.dataset.displayName || 'Selected Pokémon';
    if (zaDetailNote) {
      zaDetailNote.textContent = guideTarget
        ? `${card.dataset.method || 'Guide target'} · ${guideTarget.querySelector('.v2-target-tip')?.textContent || card.dataset.note || ''}`.trim()
        : card.dataset.note || 'Lumiose Pokédex draft entry.';
    }
    if (zaDetailCaught) zaDetailCaught.textContent = `Caught: ${caught ? 'yes' : 'no'}`;
    if (zaDetailVerified) zaDetailVerified.textContent = `Verified: ${verified ? 'yes' : 'no'}`;
    if (zaDetailGuide) zaDetailGuide.textContent = `Guide target: ${card.dataset.guideTarget === 'true' ? 'yes' : 'no'}`;
    if (zaDetailTypes) {
      zaDetailTypes.innerHTML = String(card.dataset.types || '')
        .split(',')
        .filter(Boolean)
        .map(type => `<span>${titleCase(type)}</span>`)
        .join('');
    }
    if (zaDetailCaughtToggle) {
      zaDetailCaughtToggle.checked = caught;
      zaDetailCaughtToggle.disabled = false;
      zaDetailCaughtToggle.closest('.v2-target-check')?.classList.toggle('checked', caught);
    }
    if (zaDetailVerifiedToggle) {
      zaDetailVerifiedToggle.checked = verified;
      zaDetailVerifiedToggle.disabled = false;
      zaDetailVerifiedToggle.closest('.v2-target-check')?.classList.toggle('checked', verified);
    }
    if (zaDetailLocation && zaDetailLocation.value !== location) {
      zaDetailLocation.value = location;
      zaDetailLocation.disabled = false;
    } else if (zaDetailLocation) {
      zaDetailLocation.disabled = false;
    }
    if (zaDetailGuideJump) zaDetailGuideJump.disabled = !guideTarget;
    if (zaDetailInfo) zaDetailInfo.disabled = false;
    if (zaCorrectionTitle) zaCorrectionTitle.value = `Z-A correction: ${card.dataset.displayName || selectedDex}`;
    if (zaCorrectionDetails) {
      zaCorrectionDetails.value = [
        `Game: Pokemon Legends: Z-A`,
        `Pokemon: ${pokemonLabelForDex(selectedDex)}`,
        `Current method: ${card.dataset.method || '(none)'}`,
        `Current note: ${card.dataset.note || '(none)'}`,
        `Wild Zones: ${card.dataset.wildZones || '(none)'}`,
        `My location note: ${location || '(none)'}`,
        `Correction needed: `,
      ].join('\n');
    }
    if (zaCorrectionSubmit) zaCorrectionSubmit.disabled = false;
    openZaDetailModal();
  }

  function updateZaStats() {
    if (!zaVerifiedChecks.length) return;
    const verifiedDex = new Set(
      zaVerifiedChecks
        .filter(check => Boolean(state.verifiedTargets?.[check.dataset.zaVerified]))
        .map(check => check.dataset.zaVerified)
    );
    if (zaVerifiedLabel) zaVerifiedLabel.textContent = `${verifiedDex.size}/${new Set(zaVerifiedChecks.map(check => check.dataset.zaVerified)).size}`;

    const wildChecks = zaVerifiedChecks.filter(check => String(check.dataset.zaVerifiedChapter || '').startsWith('wild-zones'));
    const wildVerified = wildChecks.filter(check => Boolean(state.verifiedTargets?.[check.dataset.zaVerified])).length;
    if (zaWildZoneLabel) zaWildZoneLabel.textContent = `${wildVerified}/${wildChecks.length}`;

    const megaChecks = zaVerifiedChecks.filter(check => ['mega-rogue', 'wild-zones-15-20', 'postgame'].includes(check.dataset.zaVerifiedChapter));
    const megaVerified = megaChecks.filter(check => Boolean(state.verifiedTargets?.[check.dataset.zaVerified])).length;
    if (zaMegaLabel) zaMegaLabel.textContent = `${megaVerified}/${megaChecks.length}`;

    if (zaNotesLabel) {
      const noted = zaNoteInputs.filter(input => Boolean((state.fieldNotes?.[input.dataset.zaFieldNote] || '').trim())).length;
      zaNotesLabel.textContent = `${noted}/${zaNoteInputs.length}`;
    }
    if (zaLocationNotesLabel) {
      const locationNotes = new Set(
        zaLocationInputs
          .filter(input => Boolean((state.verifiedLocations?.[input.dataset.zaLocation] || '').trim()))
          .map(input => input.dataset.zaLocation)
      ).size;
      zaLocationNotesLabel.textContent = `${locationNotes}/${zaLocationInputs.length}`;
    }
    updateZaAttention();
  }

  function updateZaAttention() {
    if (!zaAttentionTotal) return;
    const scopedTargets = guideTargetCards.filter(target => {
      const confidence = target.dataset.zaConfidence || '';
      const isDlc = confidence.includes('dlc') || confidence.includes('postgame');
      return activeZaScopeFilter !== 'main' || !isDlc;
    });
    const guideDex = [...new Set(scopedTargets.map(target => target.dataset.genericGuideTarget))];
    const uncaughtDex = guideDex.filter(dex => !state.caught[dex]);
    const needsLocationDex = guideDex.filter(dex => !String(state.verifiedLocations?.[dex] || '').trim());
    const needsVerificationDex = guideDex.filter(dex => !state.verifiedTargets?.[dex]);
    const notedChapters = zaNoteInputs.filter(input => String(state.fieldNotes?.[input.dataset.zaFieldNote] || '').trim());
    const missingLevel = missingDexByTag('level-evolution');
    const missingStone = missingDexByTag('stone-evolution');
    const missingTrade = missingDexByTag('trade-evolution');
    const missingFriendship = missingDexByTag('friendship-evolution');
    const missingPostgame = missingDexByTag('postgame', 'mystery-gift', 'special');
    const missingCurrentZone = currentZoneMissingDex();
    const open = uncaughtDex.length
      + needsLocationDex.length
      + needsVerificationDex.length
      + missingLevel.length
      + missingStone.length
      + missingTrade.length
      + missingFriendship.length
      + missingPostgame.length
      + missingCurrentZone.length;

    zaAttentionTotal.textContent = `${open} open`;
    if (zaAttentionUncaught) zaAttentionUncaught.textContent = String(uncaughtDex.length);
    if (zaAttentionLocations) zaAttentionLocations.textContent = String(needsLocationDex.length);
    if (zaAttentionVerification) zaAttentionVerification.textContent = String(needsVerificationDex.length);
    if (zaAttentionNotes) zaAttentionNotes.textContent = String(notedChapters.length);
    if (zaAttentionUncaughtList) zaAttentionUncaughtList.textContent = previewDexList(uncaughtDex, 'None pending');
    if (zaAttentionLocationsList) zaAttentionLocationsList.textContent = previewDexList(needsLocationDex, 'None pending');
    if (zaAttentionVerificationList) zaAttentionVerificationList.textContent = previewDexList(needsVerificationDex, 'None pending');
    if (zaAttentionNotesList) {
      zaAttentionNotesList.textContent = notedChapters.length
        ? notedChapters.slice(0, 3).map(input => chapterTitleForId(input.dataset.zaFieldNote)).join(', ')
        : 'No notes yet';
    }
    markMetricCard(zaAttentionUncaught, uncaughtDex.length === 0);
    markMetricCard(zaAttentionLocations, needsLocationDex.length === 0);
    markMetricCard(zaAttentionVerification, needsVerificationDex.length === 0);
    markMetricCard(zaAttentionNotes, false);
    updateMissingReasonCard(zaMissingReasonFields.currentZone, missingCurrentZone, state.currentWildZone && state.currentWildZone !== 'all' ? 'None pending' : 'Pick a Wild Zone');
    updateMissingReasonCard(zaMissingReasonFields.level, missingLevel);
    updateMissingReasonCard(zaMissingReasonFields.stone, missingStone);
    updateMissingReasonCard(zaMissingReasonFields.trade, missingTrade);
    updateMissingReasonCard(zaMissingReasonFields.friendship, missingFriendship);
    updateMissingReasonCard(zaMissingReasonFields.postgame, missingPostgame);
    updateZaCompletionReview({
      needsLocationDex,
      missingLevel,
      missingStone,
      missingTrade,
      missingFriendship,
      missingPostgame,
    });
  }

  function cardTags(card) {
    return String(card?.dataset.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
  }

  function isBlockedByVersion(card) {
    const scope = card.dataset.versionScope || 'both';
    if (!scope || scope === 'both') return false;
    return state.version !== scope;
  }

  function hgssMatchesTime(card, time) {
    if (!time || time === 'all') return true;
    const scope = String(card.dataset.timeScope || 'any').toLowerCase();
    return scope.includes(time);
  }

  function isTargetBlockedByVersion(target) {
    const scope = target.dataset.versionScope || 'both';
    if (!scope || scope === 'both') return false;
    return state.version !== scope;
  }

  function caughtCardFromDexes(dexes) {
    return dexes
      .map(dex => cardByDex(dex))
      .find(card => card && Boolean(state.caught?.[card.dataset.dex]));
  }

  function caughtGuideCardsForChapter(chapterId) {
    if (!chapterId) return [];
    const seen = new Set();
    return guideTargetCards
      .filter(target => target.dataset.genericGuideTargetChapter === chapterId)
      .map(target => cardByDex(target.dataset.genericGuideTarget))
      .filter(card => card && Boolean(state.caught?.[card.dataset.dex]))
      .filter(card => {
        if (seen.has(card.dataset.dex)) return false;
        seen.add(card.dataset.dex);
        return true;
      });
  }

  function updateGenericGymHelpers() {
    const recommendationsByGame = {
      'red-blue': LETSGO_GYM_RECOMMENDATIONS,
      yellow: LETSGO_GYM_RECOMMENDATIONS,
      'gold-silver': HGSS_GYM_RECOMMENDATIONS,
      crystal: HGSS_GYM_RECOMMENDATIONS,
      'heartgold-soulsilver': HGSS_GYM_RECOMMENDATIONS,
      emerald: EMERALD_GYM_RECOMMENDATIONS,
      'ruby-sapphire': RUBY_SAPPHIRE_GYM_RECOMMENDATIONS,
      oras: ORAS_GYM_RECOMMENDATIONS,
      'diamond-pearl': PLATINUM_GYM_RECOMMENDATIONS,
      platinum: PLATINUM_GYM_RECOMMENDATIONS,
      bdsp: PLATINUM_GYM_RECOMMENDATIONS,
      'sun-moon': ALOLA_GYM_RECOMMENDATIONS,
      usum: ALOLA_GYM_RECOMMENDATIONS,
      'x-y': XY_GYM_RECOMMENDATIONS,
      'sword-shield': SWSH_GYM_RECOMMENDATIONS,
      'lets-go': LETSGO_GYM_RECOMMENDATIONS,
      'scarlet-violet': SV_GYM_RECOMMENDATIONS,
      'black-white': BW_GYM_RECOMMENDATIONS,
      'black2-white2': BW2_GYM_RECOMMENDATIONS,
      'legends-za': ZA_FIGHT_RECOMMENDATIONS,
    };
    const recommendationSet = recommendationsByGame[gameId];
    if (!recommendationSet) return;
    const paldeaMode = state.paldeaPathMode || 'balanced';
    genericGymHelpers.forEach(panel => {
      const gym = panel.dataset.genericGymHelper;
      const candidates = recommendationSet[gym] || [];
      const zaTeamEntries = gameId === 'legends-za' ? zaActiveTeamEntries() : [];
      let picks = candidates
        .map(candidate => ({
          ...candidate,
          card: caughtCardFromDexes(candidate.dexes),
          teamEntry: gameId === 'legends-za'
            ? zaTeamEntries.find(entry => candidate.dexes.includes(entry.dex))
            : null,
          coverageTags: gameId === 'legends-za' ? candidateCoverageTags(candidate) : [],
          routeScore: gameId === 'scarlet-violet'
            ? ((candidate.modes || []).includes(paldeaMode) ? 1 : 0)
            : 0,
        }))
        .map(candidate => ({
          ...candidate,
          moveScore: candidate.teamEntry
            ? candidate.teamEntry.moves.reduce((score, moveName) => {
                const moveTags = moveCoverageTags(moveName);
                return score + moveTags.filter(tag => candidate.coverageTags.includes(tag)).length;
              }, 0)
            : 0,
        }))
        .filter(candidate => Boolean(candidate.card))
        .sort((a, b) => {
          const aTeam = a.teamEntry ? 1 : 0;
          const bTeam = b.teamEntry ? 1 : 0;
          const aMove = a.moveScore || 0;
          const bMove = b.moveScore || 0;
          const aLevel = a.teamEntry?.level || 0;
          const bLevel = b.teamEntry?.level || 0;
          return (bTeam - aTeam) || (bMove - aMove) || (bLevel - aLevel) || (b.routeScore - a.routeScore);
        })
        .slice(0, 3);
      let usedChapterFallback = false;
      if (!picks.length && gameId === 'legends-za') {
        const chapterId = panel.closest('[data-generic-guide-panel]')?.dataset.genericGuidePanel || null;
        const fallbackPool = zaTeamEntries.length
          ? zaTeamEntries.map(entry => entry.card)
          : (caughtGuideCardsForChapter(chapterId).length ? caughtGuideCardsForChapter(chapterId) : zaCaughtRosterOptions());
        picks = fallbackPool
          .slice(0, 3)
          .map(card => {
            const teamEntry = zaTeamEntries.find(entry => entry.dex === card.dataset.dex) || null;
            return {
            card,
            move: 'Caught in this chapter',
            reason: teamEntry
              ? 'This is on your active team already. It is not one of the named perfect counters, but it is still a real option from your current run.'
              : 'This is not one of the named perfect counters, but it is a real caught option from your current Z-A chapter and should still be part of your planning.',
            teamEntry,
            coverageTags: [],
            moveScore: 0,
            routeScore: 0,
          };});
        usedChapterFallback = picks.length > 0;
      }
      const summary = panel.querySelector(`[data-generic-gym-summary="${gym}"]`);
      const list = panel.querySelector(`[data-generic-gym-picks="${gym}"]`);
      const fallback = panel.querySelector(`[data-generic-gym-fallback="${gym}"]`);

      if (summary) {
        if (picks.length) {
          if (usedChapterFallback) {
            const teamCount = picks.filter(pick => pick.teamEntry).length;
            summary.textContent = teamCount
              ? `You do not have the perfect named ${titleCase(gym)} counters yet, so this falls back to your active team first and then your broader catches.`
              : `You have caught options in this chapter already. These are not perfect ${titleCase(gym)} counters, but they are real Z-A roster choices from your current run.`;
          } else if (gameId === 'scarlet-violet' && paldeaMode === 'gym') {
            summary.textContent = `Since you're on a Gym focus route, these are the cleanest ${titleCase(gym)} answers you already have.`;
          } else if (gameId === 'scarlet-violet' && paldeaMode === 'titan') {
            summary.textContent = `Since you're on a Titan focus route, these are the best bridge answers you can lean on before pivoting back into ${titleCase(gym)}.`;
          } else if (gameId === 'legends-za') {
            const teamCount = picks.filter(pick => pick.teamEntry).length;
            const coverageReady = picks.filter(pick => pick.teamEntry && pick.moveScore > 0).length;
            summary.textContent = teamCount
              ? `These are the best ${titleCase(gym)} answers already on your active team. ${coverageReady ? `${coverageReady} already show matching move coverage from the moves you entered.` : 'Add move names to see which of your current team members already have the right coverage.'}`
              : `Based on your caught Pokédex, these are the best ${titleCase(gym)} options right now.`;
          } else {
            summary.textContent = `Based on your caught Pokédex, these are the best ${titleCase(gym)} options right now.`;
          }
        } else {
          summary.textContent = 'Mark Pokémon caught in the Pokédex and this will suggest the best options you already have.';
        }
      }
      if (list) {
        list.innerHTML = '';
        if (!picks.length) {
          const empty = document.createElement('span');
          empty.textContent = 'No caught recommendations yet.';
          list.append(empty);
        } else {
          picks.forEach(pick => {
            const item = document.createElement('span');
            const levelNote = pick.teamEntry?.level ? ` · Lv. ${pick.teamEntry.level}` : '';
            const slotNote = pick.teamEntry?.slot ? `Slot ${pick.teamEntry.slot}${levelNote}` : '';
            const coverageNote = pick.teamEntry
              ? (pick.moveScore > 0
                  ? `Coverage ready from entered moves${pick.teamEntry.moves.length ? `: ${pick.teamEntry.moves.join(', ')}` : ''}.`
                  : `No matching move coverage entered yet${pick.teamEntry.moves.length ? `: ${pick.teamEntry.moves.join(', ')}` : '.'}`)
              : pick.reason;
            item.innerHTML = `<strong>${pick.card.dataset.displayName}${levelNote}</strong><em>${pick.move}${slotNote ? ` · ${slotNote}` : ''}</em><small>${pick.teamEntry ? `${pick.reason} ${coverageNote}` : pick.reason}</small>`;
            list.append(item);
          });
        }
      }
      if (fallback) {
        if (picks.length) {
          if (usedChapterFallback) {
            fallback.textContent = 'These fallback picks come from your active team first, then the rest of your run. Keep using the static counter list above for the most targeted matchup plan.';
          } else if (gameId === 'scarlet-violet' && paldeaMode === 'titan') {
            fallback.textContent = 'These are route-bridge suggestions for a Titan-leaning run. You can still come back later with a deeper badge-focused roster.';
          } else if (gameId === 'scarlet-violet' && paldeaMode === 'gym') {
            fallback.textContent = 'These are badge-route suggestions, not requirements. Levels, held items, and moves still matter.';
          } else if (gameId === 'legends-za') {
            fallback.textContent = 'These are suggestions, not guarantees. Team slot, level, held items, and actual moves still matter a lot in Z-A rank fights.';
          } else {
            fallback.textContent = 'These are suggestions, not requirements. Levels, held items, and moves still matter.';
          }
        } else {
          fallback.textContent = 'Catch or mark relevant team members to unlock matchup suggestions.';
        }
      }
      panel.classList.toggle('has-picks', picks.length > 0);
    });
  }

  function missingDexByTag(...tags) {
    return cards
      .filter(card => tags.some(tag => cardTags(card).includes(tag)))
      .filter(card => !state.caught?.[card.dataset.dex])
      .map(card => card.dataset.dex);
  }

  function currentZoneMissingDex() {
    if (!state.currentWildZone || state.currentWildZone === 'all') return [];
    return cards
      .filter(card => String(card.dataset.wildZones || '').split(',').map(zone => zone.trim()).includes(state.currentWildZone))
      .filter(card => !state.caught?.[card.dataset.dex])
      .map(card => card.dataset.dex);
  }

  function updateMissingReasonCard(fields, dexes, emptyText = 'None pending') {
    if (fields?.count) fields.count.textContent = String(dexes.length);
    if (fields?.list) fields.list.textContent = previewDexList(dexes, emptyText);
    markMetricCard(fields?.count, dexes.length === 0 && emptyText !== 'Pick a Wild Zone');
  }

  function markMetricCard(element, complete) {
    element?.closest('.v2-za-attention-card')?.classList.toggle('complete', Boolean(complete));
  }

  function updateZaCompletionReview(parts) {
    if (!zaCompletionReady) return;
    const postgameDex = new Set(
      cards
        .filter(card => ['postgame', 'mystery-gift', 'special'].some(tag => cardTags(card).includes(tag)))
        .map(card => card.dataset.dex)
    );
    const mainDex = cards
      .filter(card => !postgameDex.has(card.dataset.dex))
      .map(card => card.dataset.dex);
    const mainUncaught = mainDex.filter(dex => !state.caught?.[dex]);
    const wildUncaught = missingDexByTag('wild-zone');
    const evolutionUncaught = [
      ...new Set([
        ...parts.missingLevel,
        ...parts.missingStone,
        ...parts.missingTrade,
        ...parts.missingFriendship,
      ]),
    ];
    const megaDex = megaTargetDexes();
    const megaSourceMissing = megaDex.filter(dex => !String(state.verifiedLocations?.[dex] || '').trim());
    const openTotal = mainUncaught.length
      + wildUncaught.length
      + evolutionUncaught.length
      + megaSourceMissing.length
      + parts.missingPostgame.length
      + parts.needsLocationDex.length;
    const mainCaught = mainDex.length - mainUncaught.length;

    zaCompletionReady.textContent = openTotal ? `${openTotal} open` : 'Ready';
    if (zaCompletionMain) zaCompletionMain.textContent = `${mainCaught}/${mainDex.length}`;
    if (zaCompletionWild) zaCompletionWild.textContent = `${wildUncaught.length} open`;
    if (zaCompletionEvolution) zaCompletionEvolution.textContent = `${evolutionUncaught.length} open`;
    if (zaCompletionMega) zaCompletionMega.textContent = `${megaSourceMissing.length} open`;
    if (zaCompletionPostgame) zaCompletionPostgame.textContent = `${parts.missingPostgame.length} open`;
    if (zaCompletionLocation) zaCompletionLocation.textContent = `${parts.needsLocationDex.length} missing`;
    if (zaCompletionMainList) zaCompletionMainList.textContent = previewDexList(mainUncaught, 'None pending');
    if (zaCompletionWildList) zaCompletionWildList.textContent = previewDexList(wildUncaught, 'None pending');
    if (zaCompletionEvolutionList) zaCompletionEvolutionList.textContent = previewDexList(evolutionUncaught, 'None pending');
    if (zaCompletionMegaList) zaCompletionMegaList.textContent = previewDexList(megaSourceMissing, 'None pending');
    if (zaCompletionPostgameList) zaCompletionPostgameList.textContent = previewDexList(parts.missingPostgame, 'None pending');
    if (zaCompletionLocationList) zaCompletionLocationList.textContent = previewDexList(parts.needsLocationDex, 'None pending');
    markMetricCard(zaCompletionMain, mainUncaught.length === 0);
    markMetricCard(zaCompletionWild, wildUncaught.length === 0);
    markMetricCard(zaCompletionEvolution, evolutionUncaught.length === 0);
    markMetricCard(zaCompletionMega, megaSourceMissing.length === 0);
    markMetricCard(zaCompletionPostgame, parts.missingPostgame.length === 0);
    markMetricCard(zaCompletionLocation, parts.needsLocationDex.length === 0);
  }

  function previewDexList(dexes, emptyText) {
    if (!dexes.length) return emptyText;
    const names = dexes.slice(0, 3).map(dex => pokemonNameForDex(dex));
    const remaining = dexes.length - names.length;
    return remaining > 0 ? `${names.join(', ')} +${remaining} more` : names.join(', ');
  }

  function syncCards() {
    cards.forEach(card => {
      setCardCaught(card, Boolean(state.caught[card.dataset.dex]));
      const blocked = isBlockedByVersion(card);
      card.classList.toggle('version-locked', blocked);
      const ready = card.querySelector('.v2-card-ready');
      if (ready && blocked) {
        ready.textContent = `${titleCase(card.dataset.versionScope)} only`;
      } else if (ready) {
        ready.textContent = 'In V2';
      }
    });
    syncZaDetail();
    syncZaTeamPlanner();
  }

  function syncSvBattleVariants() {
    document.querySelectorAll('[data-sv-battle]').forEach(card => {
      const versionMatches = !card.dataset.svBattleVersion || card.dataset.svBattleVersion === state.version;
      const starterMatches = !card.dataset.svBattleStarter || !state.starterDex || card.dataset.svBattleStarter === String(state.starterDex);
      card.hidden = !versionMatches || !starterMatches;
    });
  }

  function syncVersion() {
    if (gameId === 'scarlet-violet') {
      document.querySelector('[data-v2-game-id="scarlet-violet"]').dataset.svVersion = state.version;
      const academy = document.querySelector('[data-sv-academy]');
      if (academy) academy.textContent = state.version === 'violet' ? 'Uva Academy' : 'Naranja Academy';
    }
    versionButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.version === state.version);
      button.setAttribute('aria-pressed', String(button.dataset.version === state.version));
    });
    if (versionLabel) versionLabel.textContent = titleCase(state.version);
    syncSvBattleVariants();
  }

  function syncStarter() {
    syncSvBattleVariants();
    starterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.genericStarter === String(state.starterDex || ''));
      button.setAttribute('aria-pressed', String(button.dataset.genericStarter === String(state.starterDex || '')));
    });
    starterProfiles.forEach(card => {
      card.classList.toggle('active', card.dataset.genericStarterProfile === String(state.starterDex || ''));
    });
    starterPlans.forEach(card => {
      card.classList.toggle('active', card.dataset.genericStarterPlan === String(state.starterDex || ''));
    });
    if (starterPlanEmpty) starterPlanEmpty.style.display = state.starterDex ? 'none' : 'block';
    const starterCard = state.starterDex ? cardByDex(state.starterDex) : null;
    if (starterLabel) starterLabel.textContent = starterCard?.dataset.displayName || 'Pending';
    const starterStatus = document.querySelector('[data-sv-starter-status]');
    if (starterStatus) starterStatus.textContent = state.starterDex
      ? `${starterCard?.dataset.displayName || 'Partner'} selected. Saved in this browser.`
      : 'Choose your first partner above.';
  }

  function matchesSearch(card) {
    const q = (search?.value || '').trim().toLowerCase();
    if (!q) return true;
    return [
      card.dataset.dex,
      card.dataset.regionalDex,
      card.dataset.name,
      card.dataset.types,
      card.dataset.note,
    ].some(value => String(value || '').includes(q));
  }

  function matchesFilter(card) {
    const caught = Boolean(state.caught[card.dataset.dex]);
    const typeFilter = pokemonTypeFilter?.value || 'all';
    if (typeFilter !== 'all') {
      const types = String(card.dataset.types || '').split(',').map(type => type.trim().toLowerCase());
      if (!types.includes(typeFilter)) return false;
    }
    const zoneFilter = zaZoneFilter?.value || 'all';
    if (zoneFilter !== 'all') {
      const zones = String(card.dataset.wildZones || '').split(',').map(zone => zone.trim());
      if (!zones.includes(zoneFilter)) return false;
    }
    const timeFilter = hgssTimeFilter?.value || 'all';
    if (!hgssMatchesTime(card, timeFilter)) return false;
    if (activeFilter === 'caught') return caught;
    if (activeFilter === 'uncaught') return !caught;
    if (activeFilter === 'guide-target') return card.dataset.guideTarget === 'true';
    const tags = String(card.dataset.tags || '').split(',');
    if (activeFilter === 'day-night') return tags.includes('day-night');
    if (activeFilter === 'morning') return hgssMatchesTime(card, 'morning');
    if (activeFilter === 'day') return hgssMatchesTime(card, 'day');
    if (activeFilter === 'night') return hgssMatchesTime(card, 'night');
    if (activeFilter === 'version-exclusive') return tags.includes('version-exclusive');
    if (activeFilter === 'gift-static') return tags.includes('gift-static');
    if (activeFilter === 'weather') return tags.includes('weather');
    if (activeFilter === 'fossil') return tags.includes('fossil');
    if (activeFilter === 'honey') return tags.includes('honey');
    if (activeFilter === 'great-marsh') return tags.includes('great-marsh');
    if (activeFilter === 'seasonal') return tags.includes('seasonal');
    if (activeFilter === 'shaking-grass') return tags.includes('shaking-grass');
    if (activeFilter === 'hidden-grotto') return tags.includes('hidden-grotto');
    if (activeFilter === 'island-scan') return tags.includes('island-scan');
    if (activeFilter === 'ultra-wormhole') return tags.includes('ultra-wormhole');
    if (activeFilter === 'wild-area') return tags.includes('wild-area');
    if (activeFilter === 'open-world') return tags.includes('open-world');
    if (activeFilter === 'province-route') return tags.includes('province-route');
    if (activeFilter === 'titan-route') return tags.includes('titan-route');
    if (activeFilter === 'team-star-route') return tags.includes('team-star-route');
    if (activeFilter === 'odd-evolution') return tags.includes('odd-evolution');
    if (activeFilter === 'paldean-form') return tags.includes('paldean-form');
    if (activeFilter === 'paradox') return tags.includes('paradox');
    if (activeFilter === 'area-zero') return tags.includes('area-zero');
    if (activeFilter === 'research-task') return tags.includes('research-task');
    if (activeFilter === 'space-time-distortion') return tags.includes('space-time-distortion');
    if (activeFilter === 'headbutt') return tags.includes('headbutt');
    if (activeFilter === 'contest') return tags.includes('contest');
    if (activeFilter === 'legendary') return tags.includes('legendary');
    if (activeFilter === 'wild-zone') return tags.includes('wild-zone');
    if (activeFilter === 'evolution') return tags.includes('evolution');
    if (activeFilter === 'level-evolution') return tags.includes('level-evolution');
    if (activeFilter === 'stone-evolution') return tags.includes('stone-evolution');
    if (activeFilter === 'trade-evolution') return tags.includes('trade-evolution');
    if (activeFilter === 'friendship-evolution') return tags.includes('friendship-evolution');
    if (activeFilter === 'special') return tags.includes('special');
    if (activeFilter === 'postgame') return tags.includes('postgame') || tags.includes('mystery-gift');
    if (activeFilter === 'mega-planning') return tags.includes('mega-planning') || tags.includes('official-mega-planning') || tags.includes('official-dlc-postgame');
    if (activeFilter === 'mega-source-review') return tags.includes('mega-source-review');
    if (activeFilter === 'needs-location') {
      return card.dataset.guideTarget === 'true' && !state.verifiedLocations?.[card.dataset.dex];
    }
    if (activeFilter === 'with-location') {
      return card.dataset.guideTarget === 'true' && Boolean(state.verifiedLocations?.[card.dataset.dex]);
    }
    return true;
  }

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const show = matchesSearch(card) && matchesFilter(card);
      card.classList.toggle('hidden', !show);
      if (gameId === 'scarlet-violet') {
        const score = svCardRouteScore(card);
        card.classList.toggle('sv-path-recommended', score > 0);
        card.classList.toggle('sv-path-muted', score < 0);
      }
      if (show) visible += 1;
    });
    orderSvCards();
    const caughtCount = Object.values(state.caught).filter(Boolean).length;
    if (caughtLabel) caughtLabel.textContent = `${caughtCount}/${cards.length}`;
    if (visibleLabel) visibleLabel.textContent = String(visible);
    updateHgssStats();
    updateEmeraldStats();
    updatePlatinumStats();
    updateBwStats();
    updateAlolaStats();
    updateXyStats();
    updateSwshStats();
    updateLetsGoStats();
    updatePlaStats();
    updateSvStats();
    updateClassicKantoStats();
    updateClassicJohtoStats();
    updateGuideStats();
    updateZaStats();
    updateZaZoneCards();
    updateZaEvolutionCards();
    updateZaMegaPanel();
  }

  function updateClassicKantoStats() {
    if (!['red-blue', 'yellow'].includes(gameId)) return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const versionCards = cards.filter(card => cardTags(card).includes('version-exclusive'));
    const versionCaught = versionCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('gift-static'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (classicKantoProgress) classicKantoProgress.textContent = `${caught}/${cards.length}`;
    if (classicKantoVersionProgress) classicKantoVersionProgress.textContent = `${versionCaught}/${versionCards.length}`;
    if (classicKantoStaticProgress) classicKantoStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (classicKantoLegendaryProgress) classicKantoLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateClassicJohtoStats() {
    if (!['gold-silver', 'crystal'].includes(gameId)) return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const timeCards = cards.filter(card => cardTags(card).includes('day-night'));
    const timeCaught = timeCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('contest') || cardTags(card).includes('gift-static'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (classicJohtoProgress) classicJohtoProgress.textContent = `${caught}/${cards.length}`;
    if (classicJohtoTimeProgress) classicJohtoTimeProgress.textContent = `${timeCaught}/${timeCards.length}`;
    if (classicJohtoStaticProgress) classicJohtoStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (classicJohtoLegendaryProgress) classicJohtoLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateHgssStats() {
    if (gameId !== 'heartgold-soulsilver') return;
    const johtoCards = cards.filter(card => Number(card.dataset.regionalDex || 0) <= 206);
    const kantoCards = cards.filter(card => Number(card.dataset.regionalDex || 0) > 206);
    const johtoCaught = johtoCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const kantoCaught = kantoCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const blocked = cards.filter(card => isBlockedByVersion(card)).length;
    const headbuttCards = cards.filter(card => cardTags(card).includes('headbutt'));
    const headbuttCaught = headbuttCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const timeCards = cards.filter(card => cardTags(card).includes('day-night'));
    const timeCaught = timeCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (hgssJohtoProgress) hgssJohtoProgress.textContent = `${johtoCaught}/${johtoCards.length}`;
    if (hgssKantoProgress) hgssKantoProgress.textContent = `${kantoCaught}/${kantoCards.length}`;
    if (hgssVersionBlocked) hgssVersionBlocked.textContent = String(blocked);
    if (hgssHeadbuttProgress) hgssHeadbuttProgress.textContent = `${headbuttCaught}/${headbuttCards.length}`;
    if (hgssTimeProgress) hgssTimeProgress.textContent = `${timeCaught}/${timeCards.length}`;
    guideTargetCards.forEach(target => {
      const scope = target.dataset.versionScope || 'both';
      const time = hgssTimeFilter?.value || 'all';
      const blockedByVersion = scope !== 'both' && scope !== state.version;
      const blockedByTime = time !== 'all' && !String(target.dataset.hgssTime || 'any').toLowerCase().includes(time);
      target.classList.toggle('version-locked', blockedByVersion);
      target.classList.toggle('hgss-time-filtered', gameId === 'heartgold-soulsilver' && blockedByTime);
    });
  }

  function updateEmeraldStats() {
    if (!['emerald', 'ruby-sapphire', 'oras'].includes(gameId)) return;
    const hoennCaught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const weatherCards = cards.filter(card => cardTags(card).includes('weather'));
    const weatherCaught = weatherCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('gift-static') || cardTags(card).includes('fossil'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (emeraldHoennProgress) emeraldHoennProgress.textContent = `${hoennCaught}/${cards.length}`;
    if (emeraldWeatherProgress) emeraldWeatherProgress.textContent = `${weatherCaught}/${weatherCards.length}`;
    if (emeraldStaticProgress) emeraldStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (emeraldLegendaryProgress) emeraldLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updatePlatinumStats() {
    if (!['diamond-pearl', 'platinum', 'bdsp'].includes(gameId)) return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const honeyCards = cards.filter(card => cardTags(card).includes('honey'));
    const honeyCaught = honeyCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('great-marsh') || cardTags(card).includes('gift-static'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (platinumSinnohProgress) platinumSinnohProgress.textContent = `${caught}/${cards.length}`;
    if (platinumHoneyProgress) platinumHoneyProgress.textContent = `${honeyCaught}/${honeyCards.length}`;
    if (platinumStaticProgress) platinumStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (platinumLegendaryProgress) platinumLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
    updatePlatinumSummary();
  }

  function updateBwStats() {
    if (!['black-white', 'black2-white2'].includes(gameId)) return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const seasonCards = cards.filter(card => cardTags(card).includes('seasonal'));
    const seasonCaught = seasonCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const shakingCards = cards.filter(card => cardTags(card).includes('shaking-grass'));
    const shakingCaught = shakingCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (bwUnovaProgress) bwUnovaProgress.textContent = `${caught}/${cards.length}`;
    if (bwSeasonProgress) bwSeasonProgress.textContent = `${seasonCaught}/${seasonCards.length}`;
    if (bwShakingProgress) bwShakingProgress.textContent = `${shakingCaught}/${shakingCards.length}`;
    if (bwLegendaryProgress) bwLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateAlolaStats() {
    if (!['sun-moon', 'usum'].includes(gameId)) return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const scanCards = cards.filter(card => cardTags(card).includes('island-scan'));
    const scanCaught = scanCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('gift-static'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary') || cardTags(card).includes('ultra-wormhole'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (alolaProgress) alolaProgress.textContent = `${caught}/${cards.length}`;
    if (alolaScanProgress) alolaScanProgress.textContent = `${scanCaught}/${scanCards.length}`;
    if (alolaStaticProgress) alolaStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (alolaLegendaryProgress) alolaLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateXyStats() {
    if (gameId !== 'x-y') return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const megaCards = cards.filter(card => cardTags(card).includes('mega-planning'));
    const megaCaught = megaCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('gift-static') || cardTags(card).includes('fossil'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (xyProgress) xyProgress.textContent = `${caught}/${cards.length}`;
    if (xyMegaProgress) xyMegaProgress.textContent = `${megaCaught}/${megaCards.length}`;
    if (xyStaticProgress) xyStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (xyLegendaryProgress) xyLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateSwshStats() {
    if (gameId !== 'sword-shield') return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const wildCards = cards.filter(card => cardTags(card).includes('wild-area'));
    const wildCaught = wildCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('gift-static') || cardTags(card).includes('fossil'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (swshProgress) swshProgress.textContent = `${caught}/${cards.length}`;
    if (swshWildProgress) swshWildProgress.textContent = `${wildCaught}/${wildCards.length}`;
    if (swshStaticProgress) swshStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (swshLegendaryProgress) swshLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateLetsGoStats() {
    if (gameId !== 'lets-go') return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const versionCards = cards.filter(card => cardTags(card).includes('version-exclusive'));
    const versionCaught = versionCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const staticCards = cards.filter(card => cardTags(card).includes('gift-static'));
    const staticCaught = staticCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (letsGoProgress) letsGoProgress.textContent = `${caught}/${cards.length}`;
    if (letsGoVersionProgress) letsGoVersionProgress.textContent = `${versionCaught}/${versionCards.length}`;
    if (letsGoStaticProgress) letsGoStaticProgress.textContent = `${staticCaught}/${staticCards.length}`;
    if (letsGoLegendaryProgress) letsGoLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updatePlaStats() {
    if (gameId !== 'legends-arceus') return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const researchCards = cards.filter(card => cardTags(card).includes('research-task'));
    const researchCaught = researchCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const distortionCards = cards.filter(card => cardTags(card).includes('space-time-distortion') || cardTags(card).includes('gift-static'));
    const distortionCaught = distortionCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (plaProgress) plaProgress.textContent = `${caught}/${cards.length}`;
    if (plaResearchProgress) plaResearchProgress.textContent = `${researchCaught}/${researchCards.length}`;
    if (plaDistortionProgress) plaDistortionProgress.textContent = `${distortionCaught}/${distortionCards.length}`;
    if (plaLegendaryProgress) plaLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateSvStats() {
    if (gameId !== 'scarlet-violet') return;
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const openCards = cards.filter(card => cardTags(card).includes('open-world'));
    const openCaught = openCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const titanCards = cards.filter(card => cardTags(card).includes('titan-route'));
    const titanCaught = titanCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const starCards = cards.filter(card => cardTags(card).includes('team-star-route'));
    const starCaught = starCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const oddCards = cards.filter(card => cardTags(card).includes('odd-evolution'));
    const oddCaught = oddCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const formCards = cards.filter(card => cardTags(card).includes('paldean-form'));
    const formCaught = formCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const paradoxCards = cards.filter(card => cardTags(card).includes('paradox'));
    const paradoxCaught = paradoxCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const areaZeroCards = cards.filter(card => cardTags(card).includes('area-zero'));
    const areaZeroCaught = areaZeroCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const legendaryCards = cards.filter(card => cardTags(card).includes('legendary'));
    const legendaryCaught = legendaryCards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    if (svProgress) svProgress.textContent = `${caught}/${cards.length}`;
    if (svOpenProgress) svOpenProgress.textContent = `${openCaught}/${openCards.length}`;
    if (svTitanProgress) svTitanProgress.textContent = `${titanCaught}/${titanCards.length}`;
    if (svStarProgress) svStarProgress.textContent = `${starCaught}/${starCards.length}`;
    if (svOddProgress) svOddProgress.textContent = `${oddCaught}/${oddCards.length}`;
    if (svFormProgress) svFormProgress.textContent = `${formCaught}/${formCards.length}`;
    if (svParadoxProgress) svParadoxProgress.textContent = `${paradoxCaught}/${paradoxCards.length}`;
    if (svAreaZeroProgress) svAreaZeroProgress.textContent = `${areaZeroCaught}/${areaZeroCards.length}`;
    if (svLegendaryProgress) svLegendaryProgress.textContent = `${legendaryCaught}/${legendaryCards.length}`;
  }

  function updateZaZoneCards() {
    let currentZoneText = 'No active zone selected.';
    zaZoneCards.forEach(zoneCard => {
      const zone = zoneCard.dataset.zaZoneCard;
      const zoneCards = cards.filter(card => String(card.dataset.wildZones || '').split(',').map(item => item.trim()).includes(zone));
      const caught = zoneCards.filter(card => Boolean(state.caught[card.dataset.dex])).length;
      const label = document.querySelector(`[data-za-zone-card-count="${zone}"]`);
      if (label) label.textContent = `${caught}/${zoneCards.length}`;
      zoneCard.classList.toggle('active', zaZoneFilter?.value === zone);
      zoneCard.classList.toggle('current', state.currentWildZone === zone);
      zoneCard.classList.toggle('complete', zoneCards.length > 0 && caught === zoneCards.length);
      if (state.currentWildZone === zone) {
        const missing = zoneCards.length - caught;
        currentZoneText = `${caught}/${zoneCards.length} caught in ${zone}; ${missing} remaining.`;
      }
    });
    if (zaCurrentZoneProgress) zaCurrentZoneProgress.textContent = currentZoneText;
  }

  function cardsForZone(zone) {
    return cards.filter(card => String(card.dataset.wildZones || '').split(',').map(item => item.trim()).includes(zone));
  }

  function setZoneCaught(zone, caught) {
    if (!zone) return;
    cardsForZone(zone).forEach(card => {
      state.caught[card.dataset.dex] = caught;
      if (!caught) delete state.caught[card.dataset.dex];
    });
    state.currentWildZone = zone;
    if (zaCurrentZone) zaCurrentZone.value = zone;
    saveState();
    syncCards();
    syncGuide();
    applyFilters();
  }

  function openZaZone(zone, filter = 'wild-zone') {
    if (!zone || zone === 'all') return;
    state.activeTab = 'pokedex';
    activeFilter = filter;
    if (zaZoneFilter) zaZoneFilter.value = zone;
    filterButtons.forEach(item => item.classList.toggle('active', item.dataset.v2GenericFilter === activeFilter));
    syncTabs();
    applyFilters();
    document.getElementById('v2-generic-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openZaEvolutionBucket(filter) {
    if (!filter) return;
    state.activeTab = 'pokedex';
    activeFilter = filter;
    if (zaZoneFilter) zaZoneFilter.value = 'all';
    filterButtons.forEach(item => item.classList.toggle('active', item.dataset.v2GenericFilter === activeFilter));
    syncTabs();
    applyFilters();
    document.getElementById('v2-generic-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateZaEvolutionCards() {
    if (!zaEvolutionCards.length) return;
    zaEvolutionCounts.forEach(label => {
      const tag = label.dataset.zaEvolutionCount;
      const matching = cards.filter(card => String(card.dataset.tags || '').split(',').includes(tag));
      const caught = matching.filter(card => Boolean(state.caught[card.dataset.dex])).length;
      label.textContent = `${caught}/${matching.length}`;
    });
    zaEvolutionCards.forEach(card => {
      const filter = card.dataset.zaEvolutionJump;
      const matching = cards.filter(item => String(item.dataset.tags || '').split(',').includes(filter));
      const caught = matching.filter(item => Boolean(state.caught[item.dataset.dex])).length;
      card.classList.toggle('active', activeFilter === filter);
      card.classList.toggle('complete', matching.length > 0 && caught === matching.length);
    });
  }

  function megaTargetDexes() {
    return [...new Set(
      guideTargetCards
        .filter(target => target.dataset.zaMegaTarget === 'true')
        .map(target => target.dataset.genericGuideTarget)
    )];
  }

  function megaTargetForDex(dex) {
    return guideTargetCards.find(target => target.dataset.zaMegaTarget === 'true' && target.dataset.genericGuideTarget === String(dex));
  }

  function updateZaMegaPanel() {
    if (!zaMegaCards.length) return;
    const megaDex = megaTargetDexes();
    const mainMega = megaDex.filter(dex => {
      const confidence = megaTargetForDex(dex)?.dataset.zaConfidence || '';
      return !confidence.includes('dlc') && !confidence.includes('postgame');
    });
    const dlcMega = megaDex.filter(dex => {
      const confidence = megaTargetForDex(dex)?.dataset.zaConfidence || '';
      return confidence.includes('dlc') || confidence.includes('postgame');
    });
    const sourceMissing = megaDex.filter(dex => !String(state.verifiedLocations?.[dex] || '').trim());
    const caughtNoSource = megaDex.filter(dex => state.caught?.[dex] && !String(state.verifiedLocations?.[dex] || '').trim());
    const open = mainMega.filter(dex => !state.caught?.[dex]).length
      + dlcMega.filter(dex => !state.caught?.[dex]).length
      + sourceMissing.length
      + caughtNoSource.length;

    if (zaMegaTotal) zaMegaTotal.textContent = `${open} open`;
    if (zaMegaMain) zaMegaMain.textContent = `${mainMega.filter(dex => state.caught?.[dex]).length}/${mainMega.length}`;
    if (zaMegaDlc) zaMegaDlc.textContent = `${dlcMega.filter(dex => state.caught?.[dex]).length}/${dlcMega.length}`;
    if (zaMegaSource) zaMegaSource.textContent = String(sourceMissing.length);
    if (zaMegaCaughtSource) zaMegaCaughtSource.textContent = String(caughtNoSource.length);
    if (zaMegaMainList) zaMegaMainList.textContent = previewDexList(mainMega.filter(dex => !state.caught?.[dex]), 'None pending');
    if (zaMegaDlcList) zaMegaDlcList.textContent = previewDexList(dlcMega.filter(dex => !state.caught?.[dex]), 'None pending');
    if (zaMegaSourceList) zaMegaSourceList.textContent = previewDexList(sourceMissing, 'None pending');
    if (zaMegaCaughtSourceList) zaMegaCaughtSourceList.textContent = previewDexList(caughtNoSource, 'None pending');
    markMetricCard(zaMegaMain, mainMega.length > 0 && mainMega.every(dex => state.caught?.[dex]));
    markMetricCard(zaMegaDlc, dlcMega.length > 0 && dlcMega.every(dex => state.caught?.[dex]));
    markMetricCard(zaMegaSource, sourceMissing.length === 0);
    markMetricCard(zaMegaCaughtSource, caughtNoSource.length === 0);
  }

  function activeGuideChapter() {
    const fallback = guideButtons[0]?.dataset.genericGuideButton || null;
    const exists = guideButtons.some(button => button.dataset.genericGuideButton === state.selectedGuideChapter);
    let active = exists ? state.selectedGuideChapter : fallback;
    if (gameId === 'platinum' && !platinumPostgameUnlocked()) {
      const panel = guidePanels.find(item => item.dataset.genericGuidePanel === active);
      if (panel?.dataset.platinumPostgame === 'true') {
        active = guidePanels.find(item => item.dataset.platinumPostgame !== 'true')?.dataset.genericGuidePanel || fallback;
      }
    }
    return active;
  }

  function platinumChapterComplete(chapterId) {
    const checks = guideChecks.filter(check => check.dataset.genericGuideChapter === chapterId);
    if (!checks.length) return false;
    return checks.every(check => (
      check.dataset.requiresGenericStarter === 'true'
        ? Boolean(state.starterDex)
        : Boolean(state.guideSteps[check.dataset.genericGuideStep])
    ));
  }

  function platinumLeagueCleared() {
    const leaguePanel = guidePanels.find(panel => panel.dataset.genericGuidePanel === 'league-cynthia');
    if (leaguePanel) return platinumChapterComplete('league-cynthia');
    return guidePanels.some(panel => {
      const chapterId = panel.dataset.genericGuidePanel;
      const title = panel.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
      const topline = panel.querySelector('.v2-chapter-topline strong')?.textContent?.trim().toLowerCase() || '';
      const subtitle = panel.querySelector('p')?.textContent?.trim().toLowerCase() || '';
      const matchesLeague = [title, topline, subtitle].some(text => (
        text.includes('league')
        || text.includes('champion')
        || text.includes('cynthia')
      ));
      return matchesLeague && platinumChapterComplete(chapterId);
    });
  }

  function platinumPostgameUnlocked() {
    if (gameId !== 'platinum') return true;
    const activeBadges = Array.isArray(state.platinumBadges) ? state.platinumBadges : new Array(8).fill(false);
    return activeBadges.every(Boolean) && platinumLeagueCleared();
  }

  function applyPlatinumLens() {
    if (gameId !== 'platinum') return;
    const unlocked = platinumPostgameUnlocked();

    guideButtons.forEach(button => {
      const panel = guidePanels.find(item => item.dataset.genericGuidePanel === button.dataset.genericGuideButton);
      button.classList.toggle('platinum-hidden', panel?.dataset.platinumPostgame === 'true' && !unlocked);
    });

    guidePanels.forEach(panel => {
      panel.classList.toggle('platinum-hidden', panel.dataset.platinumPostgame === 'true' && !unlocked);
    });
  }

  function updatePlatinumSummary() {
    if (gameId !== 'platinum') return;
    const active = activeGuideChapter();
    const activeButton = guideButtons.find(button => button.dataset.genericGuideButton === active);
    const title = activeButton?.querySelector('strong')?.textContent?.trim() || 'Twinleaf / Starter';
    const caught = cards.filter(card => Boolean(state.caught?.[card.dataset.dex])).length;
    const total = cards.length;
    const activeBadges = Array.isArray(state.platinumBadges) ? state.platinumBadges : new Array(8).fill(false);
    const earned = activeBadges.filter(Boolean).length;

    if (platinumCurrentLocation) platinumCurrentLocation.textContent = title;
    if (platinumCatchProgress) platinumCatchProgress.textContent = `${caught}/${total}`;
    if (platinumCatchProgressCopy) platinumCatchProgressCopy.textContent = `${Math.round((caught / Math.max(total, 1)) * 100)}% of the Platinum regional dex`;
    if (platinumCatchProgressFill) platinumCatchProgressFill.style.width = `${(caught / Math.max(total, 1)) * 100}%`;
    if (platinumBadgeProgress) platinumBadgeProgress.textContent = `${earned}/8`;
    platinumBadgeButtons.forEach((button, index) => {
      const isActive = Boolean(activeBadges[index]);
      button.classList.toggle('is-earned', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function handlePlatinumBadgeClick(index) {
    if (gameId !== 'platinum') return;
    if (index < 0 || index >= 8) return;
    const current = Array.isArray(state.platinumBadges) ? [...state.platinumBadges] : new Array(8).fill(false);
    current[index] = !current[index];
    state.platinumBadges = current;
    saveState();
    updatePlatinumSummary();
  }

  function syncGuideChapters() {
    const active = activeGuideChapter();
    guideButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.genericGuideButton === active);
    });
    guidePanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.genericGuidePanel === active);
    });
    applyPlatinumLens();
    syncGuideGroups();
    updatePlatinumSummary();
    syncCurrentObjective();
  }

  function syncGuideGroups() {
    if (gameId !== 'platinum' || !guideGroupSections.length) return;

    const active = activeGuideChapter();
    const activeButton = guideButtons.find(button => button.dataset.genericGuideButton === active);
    const activeGroupId = activeButton?.dataset.genericGuideGroup || null;
    let seenActive = false;

    guideGroupSections.forEach(section => {
      const groupId = section.dataset.guideGroup;
      const toggle = section.querySelector('[data-guide-group-toggle]');
      const panel = section.querySelector('[data-guide-group-panel]');
      const status = section.querySelector('[data-guide-group-status]');
      const progress = section.querySelector('[data-guide-group-progress]');
      const groupButtons = guideButtons.filter(button => (
        button.dataset.genericGuideGroup === groupId
        && !button.classList.contains('platinum-hidden')
      ));

      const visible = groupButtons.length > 0;
      section.classList.toggle('platinum-hidden', !visible);
      if (!visible) return;

      const chapterProgress = groupButtons.map(button => guideProgressForChapter(button.dataset.genericGuideButton));
      const doneSteps = chapterProgress.reduce((sum, chapter) => sum + chapter.done, 0);
      const totalSteps = chapterProgress.reduce((sum, chapter) => sum + chapter.total, 0);
      const allComplete = chapterProgress.length > 0 && chapterProgress.every(chapter => chapter.total > 0 && chapter.done === chapter.total);
      const isActiveGroup = groupId === activeGroupId;
      const isPastGroup = !seenActive && !isActiveGroup;
      const isFutureGroup = seenActive && !isActiveGroup;
      const hasStoredPreference = Object.prototype.hasOwnProperty.call(state.platinumGuideGroups || {}, groupId);
      const expanded = hasStoredPreference
        ? Boolean(state.platinumGuideGroups[groupId])
        : isActiveGroup;

      if (isActiveGroup) seenActive = true;

      section.classList.toggle('is-open', expanded);
      section.classList.toggle('is-complete', allComplete);
      section.classList.toggle('is-past', isPastGroup);
      section.classList.toggle('is-future', isFutureGroup);
      section.classList.toggle('is-collapsed', !expanded);
      if (panel) panel.hidden = !expanded;
      if (toggle) toggle.setAttribute('aria-expanded', String(expanded));

      if (status) {
        status.textContent = allComplete
          ? '✓ 100% cleared'
          : isActiveGroup
            ? 'Active stage'
            : isFutureGroup
              ? 'Upcoming stage'
              : 'In progress';
      }
      if (progress) progress.textContent = `${doneSteps}/${totalSteps} steps`;
    });

    activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function syncCurrentObjective() {
    if (!zaCurrentObjectiveTitle && !zaCurrentObjectiveNext && !zaCurrentObjectiveNote) return;
    const active = activeGuideChapter();
    const activeButton = guideButtons.find(button => button.dataset.genericGuideButton === active);
    const activeIndex = guideButtons.findIndex(button => button.dataset.genericGuideButton === active);
    const nextButton = guideButtons[activeIndex + 1];
    const title = activeButton?.querySelector('strong')?.textContent?.trim() || 'Pick a Z-A checkpoint';
    if (zaCurrentObjectiveTitle) zaCurrentObjectiveTitle.textContent = title;
    if (zaCurrentObjectiveNext) {
      zaCurrentObjectiveNext.textContent = nextButton
        ? `Next up: ${nextButton.querySelector('strong')?.textContent?.trim() || 'next checkpoint'}`
        : 'Next up: final cleanup and notes review';
    }
    if (zaCurrentObjectiveNote && zaCurrentObjectiveNote.value !== (state.currentObjectiveNote || '')) {
      zaCurrentObjectiveNote.value = state.currentObjectiveNote || '';
    }
    if (zaCurrentZone && zaCurrentZone.value !== (state.currentWildZone || 'all')) {
      zaCurrentZone.value = state.currentWildZone || 'all';
    }
  }

  function completedGuideSteps() {
    return guideChecks.filter(check => Boolean(state.guideSteps[check.dataset.genericGuideStep])).length;
  }

  function syncGuideSteps() {
    guideChecks.forEach(check => {
      const done = check.dataset.requiresGenericStarter === 'true'
        ? Boolean(state.starterDex)
        : Boolean(state.guideSteps[check.dataset.genericGuideStep]);
      check.checked = done;
      check.closest('.v2-guide-step')?.classList.toggle('done', done);
    });
  }

  function updateGuideStats() {
    if (guideCountLabel) {
      const done = guideChecks.filter(check => (
        check.dataset.requiresGenericStarter === 'true'
          ? Boolean(state.starterDex)
          : Boolean(state.guideSteps[check.dataset.genericGuideStep])
      )).length;
      guideCountLabel.textContent = `${done}/${guideChecks.length}`;
    }
    guideButtons.forEach(button => {
      const chapterId = button.dataset.genericGuideButton;
      const checks = guideChecks.filter(check => check.dataset.genericGuideChapter === chapterId);
      const complete = checks.filter(check => (
        check.dataset.requiresGenericStarter === 'true'
          ? Boolean(state.starterDex)
          : Boolean(state.guideSteps[check.dataset.genericGuideStep])
      )).length;
      const label = document.querySelector(`[data-generic-guide-progress="${chapterId}"]`);
      const localLabel = document.querySelector(`[data-generic-local-guide-count="${chapterId}"]`);
      const value = `${complete}/${checks.length}`;
      if (label) label.textContent = value;
      if (localLabel) localLabel.textContent = value;
      button.classList.toggle('complete', checks.length > 0 && complete === checks.length);
      button.classList.toggle('started', complete > 0 && complete < checks.length);
    });
    guidePanels.forEach(panel => {
      const chapterId = panel.dataset.genericGuidePanel;
      const targets = guideTargetCards.filter(target => (
        target.dataset.genericGuideTargetChapter === chapterId
        && !target.classList.contains('hidden')
      ));
      const caught = targets.filter(target => Boolean(state.caught[target.dataset.genericGuideTarget])).length;
      const label = document.querySelector(`[data-generic-target-count="${chapterId}"]`);
      if (label) label.textContent = `${caught}/${targets.length}`;
    });
  }

  function syncGuide() {
    syncGuideChapters();
    syncGuideSteps();
    syncItems();
    syncSessionSteps();
    syncVerifiedTargets();
    syncFieldNotes();
    syncVerifiedLocations();
    syncZaHideCompleted();
    guideTargetCards.forEach(target => {
      const blocked = isTargetBlockedByVersion(target);
      target.classList.toggle('version-locked', blocked);
      target.classList.toggle('hidden', blocked);
    });
    applyZaTargetFilter();
    updateGuideStats();
    updateGenericGymHelpers();
    updateZaStats();
  }

  function syncTabs() {
    const exists = tabButtons.some(button => button.dataset.v2GenericTab === state.activeTab);
    const active = exists ? state.activeTab : 'guide';
    state.activeTab = active;
    tabButtons.forEach(button => button.classList.toggle('active', button.dataset.v2GenericTab === active));
    tabPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.v2GenericPanel === active));
  }

  function syncItems() {
    itemChecks.forEach(check => {
      const done = Boolean(state.checkedItems[check.dataset.genericItemId]);
      check.checked = done;
      check.closest('.v2-item-card')?.classList.toggle('done', done);
    });
    const total = new Set(itemChecks.map(check => check.dataset.genericItemId)).size;
    const done = new Set(
      itemChecks
        .filter(check => Boolean(state.checkedItems[check.dataset.genericItemId]))
        .map(check => check.dataset.genericItemId)
    ).size;
    if (itemCountLabel) itemCountLabel.textContent = `${done}/${total}`;
  }

  function setTypeMode(mode) {
    const isDefense = mode === 'defense';
    typeGrid?.classList.toggle('v2-type-defense-mode', isDefense);
    typeModeButtons.forEach(button => button.classList.toggle('active', button.dataset.genericTypeMode === mode));
  }

  function filterTypeRows() {
    const q = (typeSearch?.value || '').trim().toLowerCase();
    typeRows.forEach(row => {
      const blob = (row.dataset.searchText || row.dataset.typeName || '').toLowerCase();
      row.style.display = (!q || blob.includes(q)) ? '' : 'none';
    });
  }

  function pokemonNameForDex(dex) {
    const card = cardByDex(dex);
    return card?.dataset.displayName || `#${String(dex).padStart(3, '0')}`;
  }

  function pokemonLabelForDex(dex) {
    const card = cardByDex(dex);
    if (!card) return `#${String(dex).padStart(3, '0')}`;
    const regionalDex = card.dataset.regionalDex;
    if (regionalDex) {
      return `#${String(regionalDex).padStart(3, '0')} ${card.dataset.displayName} (Nat #${String(dex).padStart(3, '0')})`;
    }
    return `#${String(dex).padStart(3, '0')} ${card.dataset.displayName}`;
  }

  function chapterTitleForId(chapterId) {
    const button = guideButtons.find(item => item.dataset.genericGuideButton === chapterId);
    return button?.querySelector('strong')?.textContent?.trim() || chapterId;
  }

  function guideProgressForChapter(chapterId) {
    const checks = guideChecks.filter(check => check.dataset.genericGuideChapter === chapterId);
    const done = checks.filter(check => (
      check.dataset.requiresGenericStarter === 'true'
        ? Boolean(state.starterDex)
        : Boolean(state.guideSteps[check.dataset.genericGuideStep])
    )).length;
    return { done, total: checks.length };
  }

  function exportMissingLine(label, dexes) {
    return `- ${label}: ${dexes.length ? previewDexList(dexes, 'None pending') : 'None pending'}`;
  }

  function buildZaNotesExport() {
    const active = activeGuideChapter();
    const verified = Object.keys(state.verifiedTargets || {}).sort((a, b) => Number(a) - Number(b));
    const caught = Object.keys(state.caught || {}).sort((a, b) => Number(a) - Number(b));
    const notes = Object.entries(state.fieldNotes || {})
      .filter(([, value]) => String(value || '').trim())
      .map(([chapterId, value]) => `- ${chapterTitleForId(chapterId)}: ${String(value).trim()}`);
    const locations = Object.entries(state.verifiedLocations || {})
      .filter(([, value]) => String(value || '').trim())
      .sort(([dexA], [dexB]) => Number(dexA) - Number(dexB))
      .map(([dex, value]) => `- ${pokemonLabelForDex(dex)}: ${String(value).trim()}`);
    const sessionSteps = zaSessionChecks.map(check => {
      const label = check.closest('label')?.querySelector('span')?.textContent?.trim() || check.dataset.zaSessionStep;
      return `- ${state.zaSessionSteps?.[check.dataset.zaSessionStep] ? '[x]' : '[ ]'} ${label}`;
    });
    const missingByReason = [
      exportMissingLine('Current zone uncaught', currentZoneMissingDex()),
      exportMissingLine('Level evolutions needed', missingDexByTag('level-evolution')),
      exportMissingLine('Stone evolutions needed', missingDexByTag('stone-evolution')),
      exportMissingLine('Trade evolutions needed', missingDexByTag('trade-evolution')),
      exportMissingLine('Friendship/time evolutions needed', missingDexByTag('friendship-evolution')),
      exportMissingLine('Special/postgame needed', missingDexByTag('postgame', 'mystery-gift', 'special')),
    ];
    const megaDex = megaTargetDexes();
    const megaMain = megaDex.filter(dex => {
      const confidence = megaTargetForDex(dex)?.dataset.zaConfidence || '';
      return !confidence.includes('dlc') && !confidence.includes('postgame');
    });
    const megaDlc = megaDex.filter(dex => {
      const confidence = megaTargetForDex(dex)?.dataset.zaConfidence || '';
      return confidence.includes('dlc') || confidence.includes('postgame');
    });
    const megaSourceMissing = megaDex.filter(dex => !String(state.verifiedLocations?.[dex] || '').trim());
    const megaCaughtNoSource = megaDex.filter(dex => state.caught?.[dex] && !String(state.verifiedLocations?.[dex] || '').trim());
    const megaPlanning = [
      exportMissingLine('Main-game Mega lines uncaught', megaMain.filter(dex => !state.caught?.[dex])),
      exportMissingLine('DLC/Postgame Mega lines uncaught', megaDlc.filter(dex => !state.caught?.[dex])),
      exportMissingLine('Mega source/location note missing', megaSourceMissing),
      exportMissingLine('Caught Mega lines without source note', megaCaughtNoSource),
    ];
    const postgameDex = new Set(
      cards
        .filter(card => ['postgame', 'mystery-gift', 'special'].some(tag => cardTags(card).includes(tag)))
        .map(card => card.dataset.dex)
    );
    const mainDex = cards.filter(card => !postgameDex.has(card.dataset.dex)).map(card => card.dataset.dex);
    const wildUncaught = missingDexByTag('wild-zone');
    const evolutionUncaught = [...new Set([
      ...missingDexByTag('level-evolution'),
      ...missingDexByTag('stone-evolution'),
      ...missingDexByTag('trade-evolution'),
      ...missingDexByTag('friendship-evolution'),
    ])];
    const completionReview = [
      exportMissingLine('Main Lumiose dex uncaught', mainDex.filter(dex => !state.caught?.[dex])),
      exportMissingLine('Wild Zone uncaught', wildUncaught),
      exportMissingLine('Evolution cleanup', evolutionUncaught),
      exportMissingLine('Special/postgame cleanup', missingDexByTag('postgame', 'mystery-gift', 'special')),
    ];

    return [
      'Pokemon Legends: Z-A V2 playtest notes',
      `Current checkpoint: ${chapterTitleForId(active)}`,
      `Current Wild Zone: ${state.currentWildZone && state.currentWildZone !== 'all' ? state.currentWildZone : '(none)'}`,
      `Current objective note: ${state.currentObjectiveNote || '(none)'}`,
      '',
      'Session checklist:',
      ...(sessionSteps.length ? sessionSteps : ['- (none)']),
      '',
      'Missing by reason:',
      ...missingByReason,
      '',
      'Mega planning:',
      ...megaPlanning,
      '',
      'Completion review:',
      ...completionReview,
      '',
      'Chapter notes:',
      ...(notes.length ? notes : ['- (none)']),
      '',
      'Verified targets:',
      ...(verified.length ? verified.map(dex => `- ${pokemonLabelForDex(dex)}`) : ['- (none)']),
      '',
      'Verified locations:',
      ...(locations.length ? locations : ['- (none)']),
      '',
      'Caught targets:',
      ...(caught.length ? caught.map(dex => `- ${pokemonLabelForDex(dex)}`) : ['- (none)']),
    ].join('\n');
  }

  versionButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.version = button.dataset.version;
      saveState();
      syncVersion();
      syncCards();
      applyFilters();
    });
  });

  svPathButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.paldeaPathMode = button.dataset.svPathMode || 'balanced';
      saveState();
      syncSvPathMode();
    });
  });

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.activeTab = button.dataset.v2GenericTab;
      saveState();
      syncTabs();
      applyFilters();
      document.getElementById('v2-generic-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.v2GenericFilter;
      filterButtons.forEach(item => item.classList.toggle('active', item === button));
      applyFilters();
    });
  });

  zaTargetFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeZaTargetFilter = button.dataset.zaTargetFilter;
      applyZaTargetFilter();
      updateZaAttention();
    });
  });

  zaScopeFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeZaScopeFilter = button.dataset.zaScopeFilter;
      state.zaScope = activeZaScopeFilter;
      saveState();
      applyZaTargetFilter();
      updateZaAttention();
    });
  });

  zaConfidenceFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeZaConfidenceFilter = button.dataset.zaConfidenceFilter;
      applyZaTargetFilter();
      updateZaAttention();
    });
  });

  caughtChecks.forEach(check => {
    check.addEventListener('click', event => event.stopPropagation());
    check.addEventListener('change', () => {
      if (isStarterDex(check.dataset.genericCaught)) {
        if (check.checked) {
          if (state.starterDex && state.starterDex !== check.dataset.genericCaught) {
            delete state.caught[state.starterDex];
          }
          state.starterDex = check.dataset.genericCaught;
          state.caught[state.starterDex] = true;
          state.guideSteps['start-starter'] = true;
        } else if (state.starterDex === check.dataset.genericCaught) {
          delete state.caught[state.starterDex];
          state.starterDex = null;
          delete state.guideSteps['start-starter'];
        }
        saveState();
        syncCards();
        syncStarter();
        syncGuide();
        applyFilters();
        return;
      }
      state.caught[check.dataset.genericCaught] = check.checked;
      if (!check.checked) delete state.caught[check.dataset.genericCaught];
      saveState();
      syncCards();
      syncGuide();
      applyFilters();
    });
  });

  starterButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (state.starterDex && state.starterDex !== button.dataset.genericStarter) {
        delete state.caught[state.starterDex];
      }
      state.starterDex = button.dataset.genericStarter;
      state.caught[state.starterDex] = true;
      state.guideSteps['start-starter'] = true;
      saveState();
      syncCards();
      syncStarter();
      syncGuide();
      applyFilters();
    });
  });

  clearStarterButton?.addEventListener('click', () => {
    if (state.starterDex) {
      delete state.caught[state.starterDex];
    }
    state.starterDex = null;
    delete state.guideSteps['start-starter'];
    saveState();
    syncCards();
    syncStarter();
    syncGuide();
    applyFilters();
  });

  guideButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.selectedGuideChapter = button.dataset.genericGuideButton;
      if (gameId === 'platinum' && button.dataset.genericGuideGroup) {
        state.platinumGuideGroups = {
          ...(state.platinumGuideGroups || {}),
          [button.dataset.genericGuideGroup]: true,
        };
      }
      saveState();
      syncGuide();
      guidePanels.find(panel => panel.dataset.genericGuidePanel === state.selectedGuideChapter)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  guideGroupToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      if (gameId !== 'platinum') return;
      const groupId = toggle.dataset.guideGroupToggle;
      const current = Boolean(state.platinumGuideGroups?.[groupId]);
      state.platinumGuideGroups = {
        ...(state.platinumGuideGroups || {}),
        [groupId]: !current,
      };
      saveState();
      syncGuide();
      toggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  platinumBadgeButtons.forEach((button, index) => {
    button.addEventListener('click', () => handlePlatinumBadgeClick(index));
  });

  platinumTargetToggles.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const card = button.closest('.v2-target-card');
      const expanded = !card?.classList.contains('expanded');
      card?.classList.toggle('expanded', expanded);
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      button.textContent = expanded ? 'Hide' : 'Details';
    });
  });

  guideChecks.forEach(check => {
    check.addEventListener('change', () => {
      if (check.dataset.requiresGenericStarter === 'true' && !state.starterDex) {
        check.checked = false;
        syncGuideSteps();
        return;
      }
      state.guideSteps[check.dataset.genericGuideStep] = check.checked;
      if (!check.checked) delete state.guideSteps[check.dataset.genericGuideStep];
      saveState();
      syncGuide();
    });
  });

  itemChecks.forEach(check => {
    check.addEventListener('change', () => {
      state.checkedItems[check.dataset.genericItemId] = check.checked;
      if (!check.checked) delete state.checkedItems[check.dataset.genericItemId];
      saveState();
      syncItems();
    });
  });

  zaVerifiedChecks.forEach(check => {
    check.addEventListener('click', event => event.stopPropagation());
    check.addEventListener('change', () => {
      state.verifiedTargets = state.verifiedTargets || {};
      state.verifiedTargets[check.dataset.zaVerified] = check.checked;
      if (!check.checked) delete state.verifiedTargets[check.dataset.zaVerified];
      saveState();
      syncVerifiedTargets();
      updateZaStats();
    });
  });

  zaNoteInputs.forEach(input => {
    input.addEventListener('input', () => {
      state.fieldNotes = state.fieldNotes || {};
      state.fieldNotes[input.dataset.zaFieldNote] = input.value;
      if (!input.value.trim()) delete state.fieldNotes[input.dataset.zaFieldNote];
      saveState();
      syncFieldNotes();
      updateZaStats();
    });
  });

  zaSessionChecks.forEach(check => {
    check.addEventListener('change', () => {
      state.zaSessionSteps = state.zaSessionSteps || {};
      state.zaSessionSteps[check.dataset.zaSessionStep] = check.checked;
      if (!check.checked) delete state.zaSessionSteps[check.dataset.zaSessionStep];
      saveState();
      syncSessionSteps();
    });
  });

  zaLocationInputs.forEach(input => {
    input.addEventListener('click', event => event.stopPropagation());
    input.addEventListener('input', () => {
      state.verifiedLocations = state.verifiedLocations || {};
      state.verifiedLocations[input.dataset.zaLocation] = input.value;
      if (!input.value.trim()) delete state.verifiedLocations[input.dataset.zaLocation];
      saveState();
      syncVerifiedLocations();
      updateZaStats();
      applyFilters();
    });
  });

  zaDetailLocation?.addEventListener('input', () => {
    if (!selectedDex) return;
    state.verifiedLocations = state.verifiedLocations || {};
    state.verifiedLocations[selectedDex] = zaDetailLocation.value;
    if (!zaDetailLocation.value.trim()) delete state.verifiedLocations[selectedDex];
    saveState();
    syncVerifiedLocations();
    updateZaStats();
    applyFilters();
  });

  zaDetailCaughtToggle?.addEventListener('change', () => {
    if (!selectedDex) return;
    const card = cardByDex(selectedDex);
    if (!card) return;
    state.caught[selectedDex] = zaDetailCaughtToggle.checked;
    if (!zaDetailCaughtToggle.checked) delete state.caught[selectedDex];
    if (isStarterDex(selectedDex)) state.starterDex = zaDetailCaughtToggle.checked ? selectedDex : null;
    saveState();
    syncCards();
    syncStarter();
    syncGuide();
    applyFilters();
  });

  zaDetailVerifiedToggle?.addEventListener('change', () => {
    if (!selectedDex) return;
    state.verifiedTargets = state.verifiedTargets || {};
    state.verifiedTargets[selectedDex] = zaDetailVerifiedToggle.checked;
    if (!zaDetailVerifiedToggle.checked) delete state.verifiedTargets[selectedDex];
    saveState();
    syncVerifiedTargets();
    updateZaStats();
    applyFilters();
  });

  zaDetailInfo?.addEventListener('click', () => {
    if (!selectedDex || typeof window.openDetailDrawer !== 'function') return;
    const card = cardByDex(selectedDex);
    if (!card) return;
    window.openDetailDrawer(Number(card.dataset.dex), card.dataset.displayName, Number(card.dataset.dex));
  });

  zaDetailGuideJump?.addEventListener('click', () => {
    if (!selectedDex) return;
    const target = guideTargetForDex(selectedDex);
    if (!target) return;
    state.activeTab = 'guide';
    state.selectedGuideChapter = target.dataset.genericGuideTargetChapter || activeGuideChapter();
    saveState();
    syncTabs();
    syncGuide();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  zaCorrectionForm?.addEventListener('submit', event => {
    if (!selectedDex) {
      event.preventDefault();
      return;
    }
    const note = window.prompt('What should be corrected for this Z-A entry?');
    if (!note || !note.trim()) {
      event.preventDefault();
      return;
    }
    if (zaCorrectionDetails) {
      zaCorrectionDetails.value = `${zaCorrectionDetails.value}${note.trim()}`;
    }
  });

  zaCurrentObjectiveNote?.addEventListener('input', () => {
    state.currentObjectiveNote = zaCurrentObjectiveNote.value;
    if (!state.currentObjectiveNote.trim()) state.currentObjectiveNote = '';
    saveState();
  });

  zaCurrentZone?.addEventListener('change', () => {
    state.currentWildZone = zaCurrentZone.value || 'all';
    saveState();
    updateZaZoneCards();
  });

  zaOpenCurrentZoneButton?.addEventListener('click', () => {
    openZaZone(state.currentWildZone || 'all');
  });

  zaOpenCurrentZoneUncaughtButton?.addEventListener('click', () => {
    openZaZone(state.currentWildZone || 'all', 'uncaught');
  });

  zaCopyNotesButton?.addEventListener('click', async () => {
    const text = buildZaNotesExport();
    try {
      await navigator.clipboard.writeText(text);
      if (zaCopyStatus) zaCopyStatus.textContent = 'Copied Z-A notes. Paste them back here when you want me to turn them into guide updates.';
    } catch {
      window.prompt('Copy Z-A notes:', text);
      if (zaCopyStatus) zaCopyStatus.textContent = 'Clipboard was blocked, so I opened a manual copy prompt.';
    }
  });

  zaClearSessionButton?.addEventListener('click', () => {
    state.zaSessionSteps = {};
    saveState();
    syncSessionSteps();
  });

  zaHideCompletedButton?.addEventListener('click', () => {
    state.zaHideCompleted = !state.zaHideCompleted;
    saveState();
    syncZaHideCompleted();
  });

  zaAttentionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.zaAttentionJump;
      if (action === 'uncaught') {
        state.activeTab = 'pokedex';
        activeFilter = 'uncaught';
        filterButtons.forEach(item => item.classList.toggle('active', item.dataset.v2GenericFilter === activeFilter));
        syncTabs();
        applyFilters();
        document.getElementById('v2-generic-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (action === 'needs-location') {
        state.activeTab = 'pokedex';
        activeFilter = 'needs-location';
        filterButtons.forEach(item => item.classList.toggle('active', item.dataset.v2GenericFilter === activeFilter));
        syncTabs();
        applyFilters();
        document.getElementById('v2-generic-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (action === 'needs-verification') {
        state.activeTab = 'guide';
        activeZaTargetFilter = 'needs-verification';
        syncTabs();
        applyZaTargetFilter();
        document.querySelector('.v2-za-verify-filter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (action === 'field-notes') {
        state.activeTab = 'guide';
        syncTabs();
        const firstNote = zaNoteInputs.find(input => String(state.fieldNotes?.[input.dataset.zaFieldNote] || '').trim());
        (firstNote?.closest('.v2-za-note-panel') || document.querySelector('.v2-za-session-card'))
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (action === 'current-zone-missing') {
        openZaZone(state.currentWildZone || 'all', 'uncaught');
        return;
      }
      if (['level-evolution', 'stone-evolution', 'trade-evolution', 'friendship-evolution', 'postgame'].includes(action)) {
        openZaEvolutionBucket(action);
      }
    });
  });

  zaMegaCards.forEach(card => {
    card.addEventListener('click', () => {
      const action = card.dataset.zaMegaJump;
      if (action === 'main' || action === 'dlc') {
        state.activeTab = 'guide';
        activeZaConfidenceFilter = action === 'main' ? 'mega' : 'dlc';
        activeZaTargetFilter = 'all';
        activeZaScopeFilter = action === 'main' ? 'main' : 'all';
        state.zaScope = activeZaScopeFilter;
        saveState();
        syncTabs();
        applyZaTargetFilter();
        document.querySelector('.v2-za-verify-filter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (action === 'needs-source' || action === 'caught-no-source') {
        openZaEvolutionBucket('mega-planning');
      }
    });
  });

  zaZoneCards.forEach(zoneCard => {
    zoneCard.addEventListener('click', () => {
      state.currentWildZone = zoneCard.dataset.zaZoneCard;
      saveState();
      if (zaCurrentZone) zaCurrentZone.value = state.currentWildZone;
      openZaZone(state.currentWildZone);
    });
  });

  function handleZoneActionKey(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.currentTarget.click();
  }

  zaZoneMarkAllButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      setZoneCaught(button.dataset.zaZoneMarkAll, true);
    });
    button.addEventListener('keydown', handleZoneActionKey);
  });

  zaZoneClearButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      setZoneCaught(button.dataset.zaZoneClear, false);
    });
    button.addEventListener('keydown', handleZoneActionKey);
  });

  zaEvolutionCards.forEach(card => {
    card.addEventListener('click', () => {
      openZaEvolutionBucket(card.dataset.zaEvolutionJump);
    });
  });

  resetButton?.addEventListener('click', () => {
    const ok = window.confirm('Reset local V2 shell progress for this game? V1 data is not touched.');
    if (!ok) return;
    localStorage.removeItem(storageKey);
    state = loadState();
    activeZaScopeFilter = state.zaScope || 'main';
    refreshShell();
  });

  zaTeamSlotSelects.forEach(select => {
    select.addEventListener('change', () => {
      const slot = String(select.dataset.zaTeamSlot || '');
      if (!slot) return;
      state.zaTeamSlots = state.zaTeamSlots || {};
      state.zaTeamLevels = state.zaTeamLevels || {};
      if (select.value) {
        state.zaTeamSlots[slot] = select.value;
      } else {
        delete state.zaTeamSlots[slot];
        delete state.zaTeamLevels[slot];
      }
      saveState();
      syncZaTeamPlanner();
      syncGuide();
    });
  });

  zaTeamLevelInputs.forEach(input => {
    input.addEventListener('input', () => {
      const slot = String(input.dataset.zaTeamLevel || '');
      if (!slot || !state.zaTeamSlots?.[slot]) return;
      state.zaTeamLevels = state.zaTeamLevels || {};
      const value = input.value.trim();
      if (!value) {
        delete state.zaTeamLevels[slot];
      } else {
        const numeric = Math.max(1, Math.min(100, Number(value)));
        if (Number.isFinite(numeric)) {
          state.zaTeamLevels[slot] = numeric;
        }
      }
      saveState();
      syncZaTeamPlanner();
      syncGuide();
    });
  });

  zaTeamMoveInputs.forEach(input => {
    input.addEventListener('input', () => {
      const key = String(input.dataset.zaTeamMove || '');
      const slot = key.split('-')[0] || '';
      if (!slot || !state.zaTeamSlots?.[slot]) return;
      state.zaTeamMoves = state.zaTeamMoves || {};
      const value = input.value.trim();
      if (value) {
        state.zaTeamMoves[key] = value;
      } else {
        delete state.zaTeamMoves[key];
      }
      saveState();
      syncZaTeamPlanner();
      syncGuide();
    });
  });

  typeModeButtons.forEach(button => {
    button.addEventListener('click', () => setTypeMode(button.dataset.genericTypeMode));
  });

  typeSearch?.addEventListener('input', filterTypeRows);

  infoButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const card = cardByDex(button.dataset.genericInfo);
      if (!card || typeof window.openDetailDrawer !== 'function') return;
      window.openDetailDrawer(Number(card.dataset.dex), card.dataset.displayName, Number(card.dataset.dex));
    });
  });

  cards.forEach(card => {
    card.querySelector('.v2-card-caught')?.addEventListener('click', event => {
      event.stopPropagation();
    });
    card.addEventListener('click', event => {
      if (event.target.closest('.v2-card-info, .v2-card-caught')) return;
      selectedDex = card.dataset.dex;
      syncZaDetail();
      if (zaDetailPanel && gameId === 'legends-za') {
        openZaDetailModal();
        zaDetailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const check = card.querySelector('[data-generic-caught]');
      if (!check) return;
      check.checked = !check.checked;
      check.dispatchEvent(new Event('change', { bubbles: true }));
    });
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.click();
    });
  });

  search?.addEventListener('input', applyFilters);
  pokemonTypeFilter?.addEventListener('change', applyFilters);
  zaZoneFilter?.addEventListener('change', applyFilters);
  hgssTimeFilter?.addEventListener('change', applyFilters);

  function refreshShell() {
    syncCards();
    syncVersion();
    syncSvPathMode();
    syncStarter();
    syncZaTeamPlanner();
    syncTabs();
    syncGuide();
    filterTypeRows();
    applyFilters();
    applyPlatinumLens();
    updatePlatinumSummary();
  }

  setTypeMode('offense');
  refreshShell();
  loadServerState();
})();
