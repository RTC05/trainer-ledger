/* ─────────────────────────────────────────────────
   Gym / Trial / Grand Trial / Elite Four data
   Each entry: { leader, title, location, types[], emoji }
   types[] = the types the leader uses (for matchup calc)
   ─────────────────────────────────────────────────*/

'use strict';

const _kanto = [
  { leader:'Brock',    title:'Gym 1',      location:'Pewter City',   types:['rock','ground'],          emoji:'🪨' },
  { leader:'Misty',    title:'Gym 2',      location:'Cerulean City', types:['water'],                  emoji:'💧' },
  { leader:'Lt. Surge',title:'Gym 3',      location:'Vermilion City',types:['electric'],               emoji:'⚡' },
  { leader:'Erika',    title:'Gym 4',      location:'Celadon City',  types:['grass'],                  emoji:'🌿' },
  { leader:'Koga',     title:'Gym 5',      location:'Fuchsia City',  types:['poison'],                 emoji:'☠️' },
  { leader:'Sabrina',  title:'Gym 6',      location:'Saffron City',  types:['psychic'],                emoji:'🔮' },
  { leader:'Blaine',   title:'Gym 7',      location:'Cinnabar Island',types:['fire'],                  emoji:'🔥' },
  { leader:'Giovanni', title:'Gym 8',      location:'Viridian City', types:['ground','poison'],        emoji:'🌑' },
  { leader:'Lorelei',  title:'Elite Four', location:'Indigo Plateau',types:['ice','water'],            emoji:'❄️' },
  { leader:'Bruno',    title:'Elite Four', location:'Indigo Plateau',types:['fighting','rock'],        emoji:'🥊' },
  { leader:'Agatha',   title:'Elite Four', location:'Indigo Plateau',types:['ghost','poison'],         emoji:'👻' },
  { leader:'Lance',    title:'Elite Four', location:'Indigo Plateau',types:['dragon','flying'],        emoji:'🐉' },
  { leader:'Blue',     title:'Champion',   location:'Indigo Plateau',types:['normal','fire','water','grass','psychic'],emoji:'🏆' },
];

// FRLG keeps Koga as Fuchsia Gym Leader (Janine is GSC/HGSS-era)
const _kantoFRLG = [
  ..._kanto,
];

const _johto = [
  { leader:'Falkner',  title:'Gym 1',      location:'Violet City',   types:['flying','normal'],        emoji:'🦅' },
  { leader:'Bugsy',    title:'Gym 2',      location:'Azalea Town',   types:['bug'],                    emoji:'🐛' },
  { leader:'Whitney',  title:'Gym 3',      location:'Goldenrod City',types:['normal'],                 emoji:'🎀' },
  { leader:'Morty',    title:'Gym 4',      location:'Ecruteak City', types:['ghost'],                  emoji:'👻' },
  { leader:'Chuck',    title:'Gym 5',      location:'Cianwood City', types:['fighting'],               emoji:'💪' },
  { leader:'Jasmine',  title:'Gym 6',      location:'Olivine City',  types:['steel'],                  emoji:'⚙️' },
  { leader:'Pryce',    title:'Gym 7',      location:'Mahogany Town', types:['ice'],                    emoji:'❄️' },
  { leader:'Clair',    title:'Gym 8',      location:'Blackthorn City',types:['dragon'],                emoji:'🐉' },
  { leader:'Will',     title:'Elite Four', location:'Indigo Plateau',types:['psychic'],                emoji:'🔮' },
  { leader:'Koga',     title:'Elite Four', location:'Indigo Plateau',types:['poison','psychic'],       emoji:'☠️' },
  { leader:'Bruno',    title:'Elite Four', location:'Indigo Plateau',types:['fighting','rock'],        emoji:'🥊' },
  { leader:'Karen',    title:'Elite Four', location:'Indigo Plateau',types:['dark'],                   emoji:'🌑' },
  { leader:'Lance',    title:'Champion',   location:'Indigo Plateau',types:['dragon','flying'],        emoji:'🏆' },
];

// HGSS adds the full Kanto gym circuit after E4
const _johtoHGSS = [
  ..._johto,
  { leader:'Brock',    title:'Kanto Gym 1',location:'Pewter City',   types:['rock','ground'],          emoji:'🪨' },
  { leader:'Misty',    title:'Kanto Gym 2',location:'Cerulean City', types:['water'],                  emoji:'💧' },
  { leader:'Lt. Surge',title:'Kanto Gym 3',location:'Vermilion City',types:['electric'],               emoji:'⚡' },
  { leader:'Erika',    title:'Kanto Gym 4',location:'Celadon City',  types:['grass'],                  emoji:'🌿' },
  { leader:'Janine',   title:'Kanto Gym 5',location:'Fuchsia City',  types:['poison'],                 emoji:'☠️' },
  { leader:'Sabrina',  title:'Kanto Gym 6',location:'Saffron City',  types:['psychic'],                emoji:'🔮' },
  { leader:'Blaine',   title:'Kanto Gym 7',location:'Seafoam Islands',types:['fire'],                  emoji:'🔥' },
  { leader:'Blue',     title:'Kanto Gym 8',location:'Viridian City', types:['normal','fire','water','grass','psychic'],emoji:'🏅' },
];

const _hoenn = [
  { leader:'Roxanne',  title:'Gym 1',      location:'Rustboro City', types:['rock'],                   emoji:'🪨' },
  { leader:'Brawly',   title:'Gym 2',      location:'Dewford Town',  types:['fighting'],               emoji:'🥊' },
  { leader:'Wattson',  title:'Gym 3',      location:'Mauville City', types:['electric'],               emoji:'⚡' },
  { leader:'Flannery', title:'Gym 4',      location:'Lavaridge Town',types:['fire'],                   emoji:'🔥' },
  { leader:'Norman',   title:'Gym 5',      location:'Petalburg City',types:['normal'],                 emoji:'⬜' },
  { leader:'Winona',   title:'Gym 6',      location:'Fortree City',  types:['flying'],                 emoji:'🦅' },
  { leader:'Tate & Liza',title:'Gym 7',    location:'Mossdeep City', types:['psychic'],                emoji:'🔮' },
  { leader:'Wallace',  title:'Gym 8',      location:'Sootopolis City',types:['water'],                 emoji:'💧' },
  { leader:'Sidney',   title:'Elite Four', location:'Ever Grande City',types:['dark'],                 emoji:'🌑' },
  { leader:'Phoebe',   title:'Elite Four', location:'Ever Grande City',types:['ghost'],                emoji:'👻' },
  { leader:'Glacia',   title:'Elite Four', location:'Ever Grande City',types:['ice'],                  emoji:'❄️' },
  { leader:'Drake',    title:'Elite Four', location:'Ever Grande City',types:['dragon'],               emoji:'🐉' },
  { leader:'Steven',   title:'Champion',   location:'Ever Grande City',types:['steel','rock','ground'],emoji:'🏆' },
];

const _hoennORAS = [
  ..._hoenn.slice(0, 7),
  { leader:'Wallace',  title:'Gym 8',      location:'Sootopolis City',types:['water'],                 emoji:'💧' },
  ..._hoenn.slice(8, 12),
  { leader:'Steven',   title:'Champion',   location:'Ever Grande City',types:['steel','rock','ground'],emoji:'🏆' },
];

const _sinnohDPBDSP = [
  { leader:'Roark',    title:'Gym 1',      location:'Oreburgh City', types:['rock'],                   emoji:'🪨' },
  { leader:'Gardenia', title:'Gym 2',      location:'Eterna City',   types:['grass'],                  emoji:'🌿' },
  { leader:'Maylene',  title:'Gym 3',      location:'Veilstone City',types:['fighting'],               emoji:'🥊' },
  { leader:'Crasher Wake',title:'Gym 4',   location:'Pastoria City', types:['water'],                  emoji:'💧' },
  { leader:'Fantina',  title:'Gym 5',      location:'Hearthome City',types:['ghost'],                  emoji:'👻' },
  { leader:'Byron',    title:'Gym 6',      location:'Canalave City', types:['steel'],                  emoji:'⚙️' },
  { leader:'Candice',  title:'Gym 7',      location:'Snowpoint City',types:['ice'],                    emoji:'❄️' },
  { leader:'Volkner',  title:'Gym 8',      location:'Sunyshore City',types:['electric'],               emoji:'⚡' },
  { leader:'Aaron',    title:'Elite Four', location:'Pokémon League', types:['bug'],                   emoji:'🐛' },
  { leader:'Bertha',   title:'Elite Four', location:'Pokémon League', types:['ground'],                emoji:'🌍' },
  { leader:'Flint',    title:'Elite Four', location:'Pokémon League', types:['fire'],                  emoji:'🔥' },
  { leader:'Lucian',   title:'Elite Four', location:'Pokémon League', types:['psychic'],               emoji:'🔮' },
  { leader:'Cynthia',  title:'Champion',   location:'Pokémon League', types:['dragon','ghost','ground','water','grass'],emoji:'🏆' },
];

const _sinnohPlatinum = [
  { leader:'Roark',    title:'Gym 1',      location:'Oreburgh City', types:['rock'],                   emoji:'🪨' },
  { leader:'Gardenia', title:'Gym 2',      location:'Eterna City',   types:['grass'],                  emoji:'🌿' },
  { leader:'Maylene',  title:'Gym 3',      location:'Veilstone City',types:['fighting'],               emoji:'🥊' },
  { leader:'Wake',     title:'Gym 4',      location:'Pastoria City', types:['water'],                  emoji:'💧' },
  { leader:'Fantina',  title:'Gym 5',      location:'Hearthome City',types:['ghost'],                  emoji:'👻' },
  { leader:'Byron',    title:'Gym 6',      location:'Canalave City', types:['steel'],                  emoji:'⚙️' },
  { leader:'Candice',  title:'Gym 7',      location:'Snowpoint City',types:['ice'],                    emoji:'❄️' },
  { leader:'Volkner',  title:'Gym 8',      location:'Sunyshore City',types:['electric'],               emoji:'⚡' },
  { leader:'Aaron',    title:'Elite Four', location:'Pokémon League', types:['bug'],                   emoji:'🐛' },
  { leader:'Bertha',   title:'Elite Four', location:'Pokémon League', types:['ground'],                emoji:'🌍' },
  { leader:'Flint',    title:'Elite Four', location:'Pokémon League', types:['fire'],                  emoji:'🔥' },
  { leader:'Lucian',   title:'Elite Four', location:'Pokémon League', types:['psychic'],               emoji:'🔮' },
  { leader:'Cynthia',  title:'Champion',   location:'Pokémon League', types:['dragon','ghost','ground','water','grass'],emoji:'🏆' },
];

const _unova = [
  { leader:'Cilan / Chili / Cress',title:'Gym 1',location:'Striaton City',types:['grass','fire','water'],emoji:'🍃' },
  { leader:'Lenora',   title:'Gym 2',      location:'Nacrene City',  types:['normal'],                 emoji:'⬜' },
  { leader:'Burgh',    title:'Gym 3',      location:'Castelia City', types:['bug'],                    emoji:'🐛' },
  { leader:'Elesa',    title:'Gym 4',      location:'Nimbasa City',  types:['electric'],               emoji:'⚡' },
  { leader:'Clay',     title:'Gym 5',      location:'Driftveil City',types:['ground'],                 emoji:'🌍' },
  { leader:'Skyla',    title:'Gym 6',      location:'Mistralton City',types:['flying'],                emoji:'🦅' },
  { leader:'Brycen',   title:'Gym 7',      location:'Icirrus City',  types:['ice'],                    emoji:'❄️' },
  { leader:'Drayden / Iris',title:'Gym 8', location:'Opelucid City', types:['dragon'],                 emoji:'🐉' },
  { leader:'Shauntal', title:'Elite Four', location:'Pokémon League', types:['ghost'],                 emoji:'👻' },
  { leader:'Marshal',  title:'Elite Four', location:'Pokémon League', types:['fighting'],              emoji:'🥊' },
  { leader:'Grimsley', title:'Elite Four', location:'Pokémon League', types:['dark'],                  emoji:'🌑' },
  { leader:'Caitlin',  title:'Elite Four', location:'Pokémon League', types:['psychic'],               emoji:'🔮' },
  { leader:'Alder',    title:'Champion',   location:'Pokémon League', types:['bug','normal','fire','fighting'],emoji:'🏆' },
];

const _unova2 = [
  { leader:'Cheren',   title:'Gym 1',      location:'Aspertia City', types:['normal'],                 emoji:'⬜' },
  { leader:'Roxie',    title:'Gym 2',      location:'Virbank City',  types:['poison'],                 emoji:'☠️' },
  { leader:'Burgh',    title:'Gym 3',      location:'Castelia City', types:['bug'],                    emoji:'🐛' },
  { leader:'Elesa',    title:'Gym 4',      location:'Nimbasa City',  types:['electric'],               emoji:'⚡' },
  { leader:'Clay',     title:'Gym 5',      location:'Driftveil City',types:['ground'],                 emoji:'🌍' },
  { leader:'Skyla',    title:'Gym 6',      location:'Mistralton City',types:['flying'],                emoji:'🦅' },
  { leader:'Drayden',  title:'Gym 7',      location:'Opelucid City', types:['dragon'],                 emoji:'🐉' },
  { leader:'Marlon',   title:'Gym 8',      location:'Humilau City',  types:['water'],                  emoji:'💧' },
  { leader:'Shauntal', title:'Elite Four', location:'Pokémon League', types:['ghost'],                 emoji:'👻' },
  { leader:'Marshal',  title:'Elite Four', location:'Pokémon League', types:['fighting'],              emoji:'🥊' },
  { leader:'Grimsley', title:'Elite Four', location:'Pokémon League', types:['dark'],                  emoji:'🌑' },
  { leader:'Caitlin',  title:'Elite Four', location:'Pokémon League', types:['psychic'],               emoji:'🔮' },
  { leader:'Iris',     title:'Champion',   location:'Pokémon League', types:['dragon'],               emoji:'🏆' },
];

const _kalos = [
  { leader:'Viola',    title:'Gym 1',      location:'Santalune City',types:['bug'],                    emoji:'🐛' },
  { leader:'Grant',    title:'Gym 2',      location:'Cyllage City',  types:['rock'],                   emoji:'🪨' },
  { leader:'Korrina',  title:'Gym 3',      location:'Shalour City',  types:['fighting'],               emoji:'🥊' },
  { leader:'Ramos',    title:'Gym 4',      location:'Coumarine City',types:['grass'],                  emoji:'🌿' },
  { leader:'Clemont',  title:'Gym 5',      location:'Lumiose City',  types:['electric'],               emoji:'⚡' },
  { leader:'Valerie',  title:'Gym 6',      location:'Laverre City',  types:['fairy'],                  emoji:'🧚' },
  { leader:'Olympia',  title:'Gym 7',      location:'Anistar City',  types:['psychic'],                emoji:'🔮' },
  { leader:'Wulfric',  title:'Gym 8',      location:'Snowbelle City',types:['ice'],                    emoji:'❄️' },
  { leader:'Malva',    title:'Elite Four', location:'Pokémon League', types:['fire'],                  emoji:'🔥' },
  { leader:'Siebold',  title:'Elite Four', location:'Pokémon League', types:['water'],                 emoji:'💧' },
  { leader:'Wikstrom', title:'Elite Four', location:'Pokémon League', types:['steel'],                 emoji:'⚙️' },
  { leader:'Drasna',   title:'Elite Four', location:'Pokémon League', types:['dragon'],                emoji:'🐉' },
  { leader:'Diantha',  title:'Champion',   location:'Pokémon League', types:['fairy','ghost','dragon','psychic'],emoji:'🏆' },
];

const _alola = [
  { leader:'Ilima',    title:'Trial 1',    location:'Melemele Island',types:['normal'],                emoji:'⬜' },
  { leader:'Hala',     title:'Grand Trial',location:'Iki Town',       types:['fighting'],              emoji:'🥊' },
  { leader:'Lana',     title:'Trial 2',    location:'Akala Island',   types:['water'],                 emoji:'💧' },
  { leader:'Kiawe',    title:'Trial 3',    location:'Akala Island',   types:['fire'],                  emoji:'🔥' },
  { leader:'Mallow',   title:'Trial 4',    location:'Akala Island',   types:['grass'],                 emoji:'🌿' },
  { leader:'Olivia',   title:'Grand Trial',location:'Konikoni City',  types:['rock'],                  emoji:'🪨' },
  { leader:'Sophocles',title:'Trial 5',    location:"Ula'ula Island", types:['electric'],              emoji:'⚡' },
  { leader:'Acerola',  title:'Trial 6',    location:"Ula'ula Island", types:['ghost'],                 emoji:'👻' },
  { leader:'Nanu',     title:'Grand Trial',location:'Po Town',        types:['dark'],                  emoji:'🌑' },
  { leader:'Mina',     title:'Trial 7',    location:'Poni Island',    types:['fairy'],                 emoji:'🧚' },
  { leader:'Hapu',     title:'Grand Trial',location:'Exeggutor Island',types:['ground'],               emoji:'🌍' },
  { leader:'Hala',     title:'Elite Four', location:'Pokémon League', types:['fighting'],              emoji:'🥊' },
  { leader:'Olivia',   title:'Elite Four', location:'Pokémon League', types:['rock'],                  emoji:'🪨' },
  { leader:'Acerola',  title:'Elite Four', location:'Pokémon League', types:['ghost'],                 emoji:'👻' },
  { leader:'Kahili',   title:'Elite Four', location:'Pokémon League', types:['flying'],                emoji:'🦅' },
  { leader:'Kukui / Hau',title:'Champion', location:'Pokémon League', types:['normal','fire','rock','water','fighting'],emoji:'🏆' },
];

const _galar = [
  { leader:'Milo',     title:'Gym 1',      location:'Turffield',     types:['grass'],                  emoji:'🌿' },
  { leader:'Nessa',    title:'Gym 2',      location:'Hulbury',       types:['water'],                  emoji:'💧' },
  { leader:'Kabu',     title:'Gym 3',      location:'Motostoke',     types:['fire'],                   emoji:'🔥' },
  { leader:'Bea / Allister',title:'Gym 4', location:'Stow-on-Side',  types:['fighting','ghost'],       emoji:'🥊' },
  { leader:'Opal',     title:'Gym 5',      location:'Ballonlea',     types:['fairy'],                  emoji:'🧚' },
  { leader:'Gordie / Melony',title:'Gym 6',location:'Circhester',    types:['rock','ice'],             emoji:'🪨' },
  { leader:'Piers',    title:'Gym 7',      location:'Spikemuth',     types:['dark'],                   emoji:'🌑' },
  { leader:'Raihan',   title:'Gym 8',      location:'Hammerlocke',   types:['dragon'],                 emoji:'🐉' },
  { leader:'Marnie',   title:'Semi-Final', location:'Champion Cup',   types:['dark'],                  emoji:'🌑' },
  { leader:'Hop',      title:'Semi-Final', location:'Champion Cup',   types:['normal','dragon','fire'],emoji:'🌟' },
  { leader:'Leon',     title:'Champion',   location:'Champion Cup',   types:['fire','dragon','water','normal'],emoji:'🏆' },
];

const _paldea = [
  { leader:'Katy',     title:'Gym 1',      location:'Cortondo',      types:['bug'],                    emoji:'🐛' },
  { leader:'Brassius', title:'Gym 2',      location:'Artazon',       types:['grass'],                  emoji:'🌿' },
  { leader:'Iono',     title:'Gym 3',      location:'Levincia',      types:['electric'],               emoji:'⚡' },
  { leader:'Kofu',     title:'Gym 4',      location:'Cascarrafa',    types:['water'],                  emoji:'💧' },
  { leader:'Larry',    title:'Gym 5',      location:'Medali',        types:['normal'],                 emoji:'⬜' },
  { leader:'Ryme',     title:'Gym 6',      location:'Montenevera',   types:['ghost'],                  emoji:'👻' },
  { leader:'Tulip',    title:'Gym 7',      location:'Alfornada',     types:['psychic'],                emoji:'🔮' },
  { leader:'Grusha',   title:'Gym 8',      location:'Glaseado',      types:['ice'],                    emoji:'❄️' },
  { leader:'Rika',     title:'Elite Four', location:'Pokémon League', types:['ground'],                emoji:'🌍' },
  { leader:'Poppy',    title:'Elite Four', location:'Pokémon League', types:['steel'],                 emoji:'⚙️' },
  { leader:'Larry',    title:'Elite Four', location:'Pokémon League', types:['flying','normal'],       emoji:'🦅' },
  { leader:'Hassel',   title:'Elite Four', location:'Pokémon League', types:['dragon'],                emoji:'🐉' },
  { leader:'Geeta',    title:'Champion',   location:'Pokémon League', types:['normal','fairy','bug','electric'],emoji:'🏆' },
];

/* ── Main export ── */
window.GYM_DATA = {
  'red-blue':           _kanto,
  'yellow':             _kanto,
  'firered-leafgreen':  _kantoFRLG,
  'lets-go':            _kanto,
  'gold-silver':        _johto,
  'crystal':            _johto,
  'heartgold-soulsilver': _johtoHGSS,
  'ruby-sapphire':      _hoenn,
  'emerald':            _hoenn,
  'oras':               _hoennORAS,
  'diamond-pearl':      _sinnohDPBDSP,
  'platinum':           _sinnohPlatinum,
  'bdsp':               _sinnohDPBDSP,
  'black-white':        _unova,
  'black2-white2':      _unova2,
  'x-y':                _kalos,
  'sun-moon':           _alola,
  'usum':               _alola,
  'sword-shield':       _galar,
  'scarlet-violet':     _paldea,
  /* These games have no traditional gym circuit */
  'legends-arceus':     [],
  'legends-za':         [],
  'winds-waves':        [],
  'pokemon-go':         [],
};