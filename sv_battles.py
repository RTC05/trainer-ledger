"""First-clear boss rosters; rematches deliberately use separate data."""

ROSTERS = "https://pokemondb.net/scarlet-violet/gymleaders-elitefour"
STAR = "https://www.serebii.net/scarletviolet/starfallstreet.shtml"
LEAGUE = "https://www.serebii.net/scarletviolet/elitefour.shtml"
NEMONA = "https://www.serebii.net/scarletviolet/victoryroad.shtml"
CLAVELL = "https://marriland.com/scarlet-violet/walkthrough/starfall-street/finale/"
FINALE_GUIDE = "https://www.nintendolife.com/guides/pokemon-scarlet-and-violet-"

# Name, first-clear roster, ace's Tera type, preparation advice.
GYMS = {
    "katy": ("Katy", [("Nymble", 14), ("Tarountula", 14), ("Teddiursa", 15)], "bug",
             "Use your Fire or Flying partner. Teddiursa's defensive type becomes Bug, not Normal; keep your Bug counter healthy rather than switching to Fighting for its original type."),
    "brassius": ("Brassius", [("Petilil", 16), ("Smoliv", 16), ("Sudowoodo", 17)], "grass",
                 "Fire and Flying attacks help, but Sudowoodo retains Rock coverage after becoming Grass. A Flying weakness still matters even when your own attack is super effective."),
    "iono": ("Iono", [("Wattrel", 23), ("Bellibolt", 23), ("Luxio", 23), ("Mismagius", 24)], "electric",
             "Ground works on Bellibolt and Luxio, not Flying-type Wattrel or Levitate Mismagius. Have a strong neutral attack for her ace; Terastallizing does not remove its ability."),
    "kofu": ("Kofu", [("Veluza", 29), ("Wugtrio", 29), ("Crabominable", 30)], "water",
             "Grass or Electric offense is useful. Choose a healthy attacker rather than assuming every Water opponent is slow. Crabominable becomes Water for its defensive matchups."),
    "larry": ("Larry", [("Komala", 35), ("Dudunsparce", 35), ("Staraptor", 36)], "normal",
              "Fighting hits the whole team effectively once Staraptor becomes Normal. Keep a backup for its Flying attacks; your Fighting partner is not automatically a safe switch."),
    "ryme": ("Ryme", [("Banette", 41), ("Mimikyu", 41), ("Houndstone", 41), ("Toxtricity", 42)], "ghost",
             "This is a double battle. Prepare both lead slots, break Mimikyu's Disguise, and focus damage on one opponent. Normal attacks cannot hit Ghost targets; avoid hurting your own partner with spread moves."),
    "tulip": ("Tulip", [("Farigiraf", 44), ("Gardevoir", 44), ("Espathra", 44), ("Florges", 45)], "psychic",
              "Dark attacks help, but do not use Ghost against Normal/Psychic Farigiraf. Gardevoir's Fairy typing makes a lone Dark attacker risky. Keep a second answer for her special attackers."),
    "grusha": ("Grusha", [("Frosmoth", 47), ("Beartic", 47), ("Cetitan", 47), ("Altaria", 48)], "ice",
               "Fire, Steel, Rock or Fighting coverage is useful. Treat Altaria as Ice after it Terastallizes; do not plan around its usual Dragon/Flying defensive weaknesses."),
}

STAR_TEAMS = {
    "giacomo": ("Giacomo", [("Pawniard", 21)], "dark", 20,
                "Pawniard is especially vulnerable to Fighting. The vehicle is Dark, not ordinary Revavroom's Steel/Poison combination. Its Intimidate makes a special or Fairy option a useful backup."),
    "mela": ("Mela", [("Torkoal", 27)], "fire", 26,
             "Torkoal starts sun, weakening Water damage and strengthening Fire. Ground or Rock is a useful alternative. The vehicle gains Speed, so do not rely on always moving first."),
    "atticus": ("Atticus", [("Skuntank", 32), ("Muk", 32), ("Revavroom", 33)], "poison", 32,
                "Ground covers all four foes. Psychic cannot hit Skuntank. He has both a normal Revavroom and a separate Poison vehicle; bring poison healing and avoid unnecessary switches through Toxic Spikes."),
    "ortega": ("Ortega", [("Azumarill", 50), ("Wigglytuff", 50), ("Dachsbun", 51)], "fairy", 50,
               "Use Steel or Poison damage, but account for Azumarill's Water attacks. Fire does not work on Dachsbun's Well-Baked Body. Dragon attacks fail against Fairy opponents."),
    "eri": ("Eri", [("Toxicroak", 55), ("Passimian", 55), ("Lucario", 55), ("Annihilape", 56)], "fighting", 56,
            "Do not rely on one Fairy or Psychic attacker for every opponent. Lucario has Dark coverage and Annihilape has Ghost attacks. Prefer special damage against the vehicle as its Stamina raises Defense when hit."),
}

ELITE = [
    ("Rika", [("Whiscash", 57), ("Camerupt", 57), ("Donphan", 57), ("Dugtrio", 57), ("Clodsire", 58)], "ground",
     "Use Grass on Whiscash and Water on Camerupt. Clodsire has Water Absorb: change to Grass or Ice once it becomes Ground rather than healing it with Water attacks."),
    ("Poppy", [("Copperajah", 58), ("Magnezone", 58), ("Bronzong", 58), ("Corviknight", 58), ("Tinkaton", 59)], "steel",
     "Bring Fire as well as Ground. Bronzong's Levitate and Corviknight's Flying typing stop ordinary Ground attacks. Tinkaton becomes pure Steel defensively."),
    ("Larry: Elite Four", [("Tropius", 59), ("Oricorio", 59), ("Altaria", 59), ("Staraptor", 59), ("Flamigo", 60)], "flying",
     "This Larry uses Flying, not his gym's Normal team. Ice is excellent for Tropius and Altaria; Electric or Rock helps elsewhere. His Oricorio is the Electric/Flying Pom-Pom form."),
    ("Hassel: Elite Four", [("Noivern", 60), ("Haxorus", 60), ("Dragalge", 60), ("Flapple", 60), ("Baxcalibur", 61)], "dragon",
     "Fairy is useful, but Poison/Dragon Dragalge is not weak to Fairy. Ice, Ground or Psychic can cover that gap. Keep the Fairy partner healthy for Tera Dragon Baxcalibur."),
    ("Geeta: Champion", [("Espathra", 61), ("Gogoat", 61), ("Veluza", 61), ("Avalugg", 61), ("Kingambit", 61), ("Glimmora", 62)], "rock",
     "Prepare several types rather than one sweeper: Dark for Psychic foes, special Fire for Avalugg, Fighting for Kingambit and Water/Ground/Grass for Tera Rock Glimmora. This is the initial Champion team, not a later rematch."),
]

FINALES = {
    "arven": ("Arven", [("Greedent", 58), ("Cloyster", 59), ("Scovillain", 60), ("Toedscruel", 61), ("Garganacl", 62), ("Mabosstiff", 63)], "dark",
              "Fighting covers Greedent, Garganacl and Mabosstiff. Use special Electric or Grass damage on Cloyster rather than attacking its strong physical Defense. Ice is excellent against Toedscruel. Heal before this fight: finishing a Titan does not mean your team is ready for Arven."),
    "penny": ("Penny / Cassiopeia", [("Umbreon", 62), ("Vaporeon", 62), ("Jolteon", 62), ("Flareon", 62), ("Leafeon", 62), ("Sylveon", 63)], "fairy",
              "Bring multiple attack types for the Eevee evolutions. Ground handles Jolteon and Flareon; Grass handles Vaporeon; Fire handles Leafeon. Keep a Steel or Poison attacker healthy for Sylveon rather than relying on a Dragon partner."),
}

# The key is the PLAYER'S starter, never the opponent's starter.
CLAVELL_VARIANTS = {
    906: ([("Gyarados", 60), ("Amoonguss", 60), ("Skeledirge", 61)], "fire"),
    909: ([("Houndoom", 60), ("Amoonguss", 60), ("Quaquaval", 61)], "water"),
    912: ([("Houndoom", 60), ("Gyarados", 60), ("Meowscarada", 61)], "grass"),
}
NEMONA_VARIANTS = {906: ("Quaquaval", "water"), 909: ("Meowscarada", "grass"), 912: ("Skeledirge", "fire")}
AREA_ZERO = {
    "scarlet": ("AI Sada (Scarlet)", [("Slither Wing", 66), ("Scream Tail", 66), ("Brute Bonnet", 66), ("Flutter Mane", 66), ("Sandy Shocks", 66), ("Roaring Moon", 67)], None,
                "Flying is especially effective against Slither Wing; Bug against Brute Bonnet; Fairy against Roaring Moon. Keep a Steel answer for Flutter Mane and switch away from dangerous matchups instead of depending on a single attacker."),
    "violet": ("AI Turo (Violet)", [("Iron Moth", 66), ("Iron Bundle", 66), ("Iron Hands", 66), ("Iron Jugulis", 66), ("Iron Thorns", 66), ("Iron Valiant", 67)], None,
               "Ground is especially effective against Iron Moth and Iron Thorns, but cannot hit Flying-type Iron Jugulis. Preserve an answer to fast Iron Bundle and a Fairy, Flying or Psychic attack for Iron Valiant."),
}


def attach_battles(chapters, entries):
    by_name = {e["name"].casefold(): e for e in entries}

    def briefing(name, party, tera, advice, vehicle=None):
        team = []
        for index, (species, level) in enumerate(party):
            entry = by_name[species.casefold()]
            types = entry["types"]
            if species == "Oricorio":
                types = ["electric", "flying"]
            team.append({"name": species, "dex": entry["dex"], "level": level,
                         "types": types, "tera": tera if index == len(party) - 1 and not vehicle else None})
        return {"name": name, "team": team, "advice": advice, "vehicle": vehicle}

    for chapter in chapters:
        key = chapter["id"].removeprefix("sv-route-")
        if key in GYMS:
            chapter["battle_briefings"] = [briefing(*GYMS[key])]
        elif key in STAR_TEAMS:
            name, party, element, level, advice = STAR_TEAMS[key]
            chapter["battle_briefings"] = [briefing(name, party, None, advice, {"type": element, "level": level})]
        elif key == "league":
            chapter["battle_briefings"] = [briefing(*row) for row in ELITE]
            for starter, (ace, element) in NEMONA_VARIANTS.items():
                row = briefing("Nemona: final rival battle", [("Lycanroc", 65), ("Goodra", 65), ("Dudunsparce", 65), ("Orthworm", 65), ("Pawmot", 65), (ace, 66)], element,
                               "Your starter has the basic type advantage against her ace. Do not use Ground against Orthworm's Earth Eater, Electric against Pawmot's Volt Absorb, or Grass against Goodra's Sap Sipper. Fire/Fighting for Orthworm and Fairy/Ice for Goodra give safer attack choices.")
                row["starter"] = starter
                chapter["battle_briefings"].append(row)
            chapter["sources"].append({"label": "Nemona finale and abilities", "url": NEMONA})
        elif key in FINALES:
            chapter["battle_briefings"] = []
            if key == "penny":
                for starter, (party, element) in CLAVELL_VARIANTS.items():
                    row = briefing("Clavell: academy entrance", [("Oranguru", 60), ("Abomasnow", 60), ("Polteageist", 60)] + party, element,
                                   "Clavell uses the starter strong against yours, not Nemona's starter. Bring Dark for Oranguru and Polteageist, Fire for Abomasnow, and coverage for the three partners shown below. Oranguru is Normal/Psychic, so Ghost attacks fail.")
                    row["starter"] = starter
                    chapter["battle_briefings"].append(row)
                chapter["sources"].append({"label": "Clavell's starter-dependent team", "url": CLAVELL})
            chapter["battle_briefings"].append(briefing(*FINALES[key]))
        elif key == "area-zero":
            chapter["battle_briefings"] = []
            for version, data in AREA_ZERO.items():
                row = briefing(*data)
                row["version"] = version
                chapter["battle_briefings"].append(row)
        if chapter.get("battle_briefings"):
            chapter["sources"].append({"label": "First-clear enemy rosters", "url": ROSTERS})
            if key in STAR_TEAMS:
                chapter["sources"].append({"label": "Starmobile mechanics", "url": STAR})
            if key == "league":
                chapter["sources"].append({"label": "League abilities and Tera types", "url": LEAGUE})
