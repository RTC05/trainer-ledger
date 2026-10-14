"""Base-game Paldea route, with selected catches and dependable nearby rewards.

This is a practical playthrough, not an exhaustive overworld spawn/item catalog.
National identities are resolved from the regional dex rather than hand-entered.
"""

from sv_academy import build_academy
from sv_battles import attach_battles

MAP = "https://www.serebii.net/pokearth/paldea/"
SV = "https://www.serebii.net/scarletviolet/"
NL = "https://www.nintendolife.com/guides/pokemon-scarlet-and-violet-"


def build_playthrough(entries, target_factory):
    by_name = {entry["name"].casefold(): entry for entry in entries}
    chapters, items = [], []

    def stop(key, title, level, goal, steps, catches=(), pickups=(), tip="", sources=(), kind="travel"):
        chapter_id = "sv-route-" + key
        chapter = {
            "id": chapter_id, "title": title, "stage": level,
            "chapter_focus": kind, "objective_kind": kind,
            "subtitle": "Recommended base-game route. Catch suggestions are useful options, not a requirement to replace your team.",
            "primary_goal": {"label": "Primary goal", "title": goal, "detail": level},
            "guide_steps": [
                {"id": f"{chapter_id}-{index}", "label": label, "detail": detail, "category": "story"}
                for index, (label, detail) in enumerate(steps, 1)
            ],
            "pokemon_targets": [],
            "sources": [{"label": label, "url": url} for label, url in sources],
            "target_heading": "Recommended catches",
        }
        if tip:
            chapter["strategy_callout"] = {"label": "Before you move on", "title": "Team and route advice", "detail": tip}
        for name, where, why, *options in catches:
            option = options[0] if options else {}
            entry = by_name[name.casefold()]
            target = target_factory(
                entry["dex"], entry["name"], where, option.get("when", "During this stop"), why,
                method=option.get("method", "Wild encounter"),
                timing=option.get("timing", "Explore the listed habitat"),
                version=option.get("version", "both"), confidence="Location sourced",
                tip=option.get("tip", why), levels=option.get("levels", "Check the encounter level before battling"),
                tags=option.get("tags", ["open-world", "province-route"]),
            )
            target["display_dex"] = entry["regional_dex"]
            chapter["pokemon_targets"].append(target)
        for item_key, label, detail in pickups:
            items.append({"id": "sv-route-item-" + item_key, "chapter_id": chapter_id,
                          "chapter": title, "label": label, "detail": detail,
                          "kind": "route", "optional": True})
        chapters.append(chapter)
        return chapter

    opening = stop("opening", "Cabo Poco and Poco Path", "Opening | suggested team Lv. 5-8",
        "Choose your starter and reach Los Platos", [
            ("Choose Scarlet or Violet and your starter", "Set your version in this guide. Meet Nemona at her house, choose a starter, and complete your first battle."),
            ("Follow Nemona onto Poco Path", "Complete the catching lesson, then catch a few partners along the path before following the story toward the lighthouse."),
            ("Help the stranded legendary", "Follow the story through Inlet Grotto, meet Arven, and continue toward Los Platos with Nemona."),
        ], catches=[
            ("Sprigatito", "Cabo Poco", "Grass starter; add a Flying or Fire partner before Katy.", {"method": "Starter choice"}),
            ("Fuecoco", "Cabo Poco", "Fire starter; a comfortable answer to the first two gyms.", {"method": "Starter choice"}),
            ("Quaxly", "Cabo Poco", "Water starter; useful for Klawf, with a Flying partner for the first gyms.", {"method": "Starter choice"}),
            ("Lechonk", "Poco Path", "Easy early registration and a spare Normal attacker."),
            ("Pawmi", "Poco Path", "Electric coverage for Water and Flying opponents later."),
            ("Fletchling", "Poco Path", "A useful early Flying attacker for Katy and Brassius."),
            ("Hoppip", "Poco Path", "An early Grass option if you chose Fuecoco."),
            ("Tarountula", "Poco Path", "Catch one for the dex while following the main path."),
        ], tip="You do not need six permanent team members immediately. Catch different species for dex rewards and keep a few flexible slots.",
        sources=[("Opening walkthrough", NL + "beginners-guide-best-early-pokemon-provinces-tms")])
    opening["guide_steps"][0].update(id="sv-starter", requires_starter=True)

    stop("los-platos", "Los Platos and South Province (Area One)", "Opening | suggested team Lv. 8-12",
        "Build your first coverage options before Mesagoza", [
            ("Heal at Los Platos", "Follow the Pokemon Center tutorial. Restock basic Poke Balls and explore the nearby fields and ponds before continuing north."),
            ("Look around ponds for a Water or Ground partner", "Paldean Wooper is Poison/Ground and already immune to Electric attacks; Psyduck provides immediate Water coverage. Ralts is optional and rare, so do not stall the whole journey hunting it."),
            ("Follow the road to Mesagoza", "Talk to trainers to battle them; walking past does not start fights. Heal before Nemona's battle at the city entrance."),
        ], catches=[
            ("Paldean Wooper", "South Province (Area One), ponds", "Ground coverage; evolves into Clodsire at Lv. 20."),
            ("Psyduck", "South Province (Area One), water edges", "Water attacks help against the early Rock Titan."),
            ("Ralts", "South Province (Area One), near Los Platos", "A rare optional Psychic/Fairy partner for later Fighting opponents."),
            ("Fidough", "Los Platos surroundings", "Fairy coverage for Giacomo; evolves into Dachsbun at Lv. 26."),
            ("Flamigo", "South Province (Area One), wetland areas", "Strong immediate Flying/Fighting coverage without needing evolution."),
            ("Azurill", "South Province (Area One), pond edges", "A long-term Water/Fairy option; Huge Power is the useful offensive ability."),
        ], pickups=[("thunder-wave", "TM082 Thunder Wave", "Defeat four trainers in South Province (Area One), then speak to the League representative by Mesagoza's south Pokemon Center. Paralysis helps with catches; Ground and Electric targets need another approach.")],
        sources=[("Area One map and encounters", MAP + "southprovinceareaone.shtml")])

    stop("academy", "Mesagoza and the Academy", "Before the Treasure Hunt",
        "Unlock free exploration and your catching toolkit", [
            ("Complete the academy introduction", "Follow the Team Star encounter, classes and story conversations until the Treasure Hunt begins and you can ride Koraidon or Miraidon."),
            ("Choose the west gate for Cortondo", "The recommended route mixes gyms, Titans and Team Star by difficulty. Boss levels do not scale to your team; map suggestions are not a difficulty ranking."),
            ("Return to Jacq after 30 registrations", "Visit the Biology Lab once you have caught 30 different Paldea species. Claim his False Swipe TMs and the separate rewards in your Pokedex's milestone screen."),
        ], pickups=[
            ("false-swipe", "TM057 False Swipe: Jacq's 30-species reward", "Talk to Jacq in the Biology Lab after registering 30 caught species for five copies. A compatible catcher can lower a target to 1 HP; Ghost types are immune to this Normal move."),
            ("dex-stones", "Dex milestone evolution stones", "Claim the Thunder Stone at 30 registrations, Fire Stone at 60 and Water Stone at 80 from the Pokedex rewards screen. These are separate from Jacq's rewards."),
        ], tip="Gym badges raise the level at which newly caught Pokemon reliably obey. Titan and Team Star badges do not substitute for gym badges. Avoid building your early team around an over-levelled catch.",
        sources=[("Dex rewards", SV + "pokedexcompletion.shtml"), ("Suggested progression", NL + "gym-order-which-path-should-i-do-first")])

    stop("katy", "South Province (Area Two) and Cortondo", "Gym 1 | Katy's ace Lv. 15",
        "Win the Bug Badge and collect a useful Flying TM", [
            ("Take Mesagoza's west road to Cortondo", "Explore the olive fields and register the Pokemon Center. Catch Smoliv if you need Grass coverage, or use Fletchling from Poco Path for the gym."),
            ("Finish the Olive Roll test", "Register at the gym, go to the marked olive field, and push the giant olive through the course into its goal. Return to reception afterward."),
            ("Battle Katy", "Use Fire, Flying or Rock damage. Her Teddiursa becomes Bug type when it Terastallizes, so keep your Bug counter ready for the final Pokemon."),
        ], catches=[
            ("Smoliv", "South Province (Area Two), olive fields", "Grass damage for Klawf now and Kofu later."),
            ("Tinkatink", "South Province (Area Two), ruins", "Fairy/Steel typing gives a useful long-term defensive partner."),
            ("Snom", "Cortondo, NPC trade", "Trade a Flabebe to the NPC on the main street for an early Snom.", {"method": "In-game trade", "levels": "Lv. 10"}),
        ], pickups=[
            ("aerial-ace", "TM027 Aerial Ace", "Defeat five trainers in South Province (Area Two) and claim the reward from the League representative at Cortondo. Useful for a compatible Flying attacker before Brassius."),
            ("pounce", "TM021 Pounce", "Collect Katy's reward after winning the gym.")],
        sources=[("Katy and Olive Roll", NL + "cortondo-gym-bug-badge-how-to-beat-leader-katy"), ("Area Two map", MAP + "southprovinceareatwo.shtml"), ("NPC trades", SV + "ingametrades.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml")], kind="gym")

    stop("klawf", "South Province (Area Three): Klawf", "Titan 1 | suggested team Lv. 16-18",
        "Unlock Dash and pick up the Shell Bell", [
            ("Fly to Mesagoza and leave through the east gate", "Follow the canyon road toward Artazon. Battle local trainers while searching the rocky ground for Nacli and Charcadet."),
            ("Follow the Stony Cliff Titan marker", "Approach the giant Klawf on the cliff. Defeat its first phase, follow it, and finish the second fight with Arven."),
            ("Finish the sandwich scene and revisit the canyon", "Dash is now available; it is not a climbing upgrade. The former Titan becomes a separate catch after the story battle, so return to its location if you want it."),
        ], catches=[
            ("Nacli", "South Province (Area Three), rocky terrain", "Rock coverage and a durable eventual Garganacl."),
            ("Charcadet", "South Province (Area Three), scattered wild spawns", "Rare Fire option. Its evolution requires version-specific armor from Zapapico, not just levels."),
            ("Klawf", "South Province (Area Three), canyon", "Wild Klawf are available; the former Titan is a separate Lv. 16 encounter after the Titan quest.")],
        pickups=[("shell-bell", "Free Shell Bell", "Defeat six trainers in South Province (Area Three), then return to the League representative at its Pokemon Center. Give it to an attacker for healing when it deals damage.")],
        tip="Bring Water, Grass or Fighting damage. Quaxly or Psyduck helps immediately; a Fuecoco team benefits from adding Smoliv or another Grass/Water partner.",
        sources=[("Klawf route", NL + "the-stony-cliff-titan"), ("Area Three and Shell Bell", MAP + "southprovinceareathree.shtml"), ("Shell Bell cross-check", "https://www.thonky.com/pokemon-scarlet-violet/south-province-area-three"), ("Former Titans", SV + "titanpokemon.shtml")], kind="titan")

    stop("brassius", "Artazon", "Gym 2 | Brassius's ace Lv. 17",
        "Complete Sunflora Hide-and-Seek and win the Grass Badge", [
            ("Continue east from the Klawf canyon into Artazon", "Heal and register at the gym. Keep your Fire or Flying attacker from Katy in the team."),
            ("Collect ten Sunflora", "Start the test at the Sunflora lawn, search around town, and return there with ten followers. Some Sunflora require a battle."),
            ("Return to the gym and fight Brassius", "His Sudowoodo becomes Grass type but retains Rock attacks. A Flying attacker can hit hard but should not ignore that retaliation."),
        ], pickups=[("trailblaze", "TM020 Trailblaze", "Brassius awards this after the gym. Teach it to a compatible physical attacker that needs Grass coverage and a Speed boost.")],
        tip="Next, fly back to Cortondo for the western Titan and Dark Crew. Do not follow the east road all the way to Mela simply because her base is nearby; she is a later fight.",
        sources=[("Artazon test and battle", NL + "artazon-gym-grass-badge-how-to-beat-leader-brassius")], kind="gym")

    stop("bombirdier", "West Province (Area One): Bombirdier", "Titan 2 | suggested team Lv. 20-22",
        "Unlock swimming before the coastal route", [
            ("Return to Cortondo and travel northwest", "Follow the road into West Province (Area One), register Centers, and approach the Open Sky Titan marker."),
            ("Climb the boulder path", "Dodge rolling rocks, fight Bombirdier, then follow it to the second battle with Arven."),
            ("Complete the sandwich scene", "Swimming now lets your ride enter water. It does not make distant lake encounters safe at your current level."),
        ], catches=[
            ("Mankey", "West Province (Area One)", "Fighting coverage for Giacomo and Larry; keep it for the Primeape/Annihilape line."),
            ("Mudbray", "West Province (Area One)", "A sturdy Ground option for later Electric and Poison fights."),
            ("Bombirdier", "West Province (Area One), former Titan site", "Return after the Titan quest to catch the Lv. 20 former Titan.", {"method": "Post-Titan static encounter", "levels": "Lv. 20"})],
        pickups=[("clear-amulet", "Clear Amulet: optional regional reward", "After nine trainer wins in West Province (Area One), speak to its League representative. The holder is protected from opponents lowering its stats; collect it if you are already battling through this region.")],
        tip="Pawmi's Electric attacks or Nacli's Rock attacks are useful. Avoid bringing only Fighting damage against this Flying/Dark opponent.",
        sources=[("Bombirdier", NL + "the-open-sky-titan"), ("West Area One map", MAP + "westprovinceareaone.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml"), ("Former Titans", SV + "titanpokemon.shtml")], kind="titan")

    stop("giacomo", "West Province (Area One): Dark Crew", "Star 1 | Giacomo's strongest foe Lv. 21",
        "Clear the Segin Squad before returning east", [
            ("Approach the Dark Crew base in West Province (Area One)", "Heal, then put three healthy Pokemon suitable for Dark opponents at the front of the party."),
            ("Clear the gate and Star Barrage", "Ring the bell when ready. Defeat 30 Pokemon within ten minutes using your first three; use the base's healing points as needed."),
            ("Fight Giacomo and his Starmobile", "Use Fighting, Fairy or Bug attacks. Flamigo, Mankey or Fidough's line can provide coverage."),
        ], pickups=[("foul-play", "TM062 Foul Play", "Collect the TM and LP after clearing Giacomo's base.")],
        tip="Team Star's boss vehicles cannot be caught. Afterward, fly to Artazon and follow the eastern route toward Levincia.",
        sources=[("Giacomo and base mechanics", NL + "dark-crew-base-how-to-beat-boss-giacomo")], kind="star")

    stop("east-one", "East Province (Area One)", "Travel | suggested team Lv. 22-24",
        "Collect a useful held item on the way to Levincia", [
            ("Travel northeast from Artazon", "Follow roads through East Province (Area One) toward Area Two and Levincia, registering Pokemon Centers as you go."),
            ("Battle five local trainers", "Claim Loaded Dice from the Area One League representative. Save it for a Pokemon using suitable multi-hit attacks."),
            ("Prepare an Iono team", "Keep a Ground attacker, but also bring a strong neutral attack for her final Pokemon. Heal before entering the gym route."),
        ], pickups=[("loaded-dice", "Loaded Dice", "Reward for five East Province (Area One) trainer wins at the local League representative. Particularly useful later with moves such as Bullet Seed and Icicle Spear.")],
        sources=[("Trainer rewards", SV + "leaguechallenge.shtml")])

    stop("iono", "East Province (Area Two) and Levincia", "Gym 3 | Iono's ace Lv. 24",
        "Win the Electric Badge and unlock a solo Gengar trade", [
            ("Explore Area Two on the Levincia approach", "Catch Magnemite if you need Electric/Steel coverage. Use the coastal area for an optional Pincurchin hunt if you want the NPC trade."),
            ("Complete Iono's camera test", "Register at the gym, find Clavell in each scene and defeat the intervening trainers."),
            ("Handle Iono's immunities", "Ground attacks work on Luxio and Bellibolt, but not Wattrel or Levitate Mismagius. Use a strong neutral attack on Electric-Tera Mismagius."),
        ], catches=[
            ("Magnemite", "East Province (Area Two)", "Electric/Steel coverage for Water foes and useful resistances."),
            ("Gengar", "Levincia, NPC beside the central battle court", "Trade Pincurchin for Haunter, which evolves into Gengar on receipt. No second player is needed.", {"method": "In-game trade evolution", "levels": "Lv. 25"})],
        pickups=[("volt-switch", "TM048 Volt Switch", "Iono's gym reward. An Electric attack that also switches the user out."),
                 ("stomping-tantrum", "TM084 Stomping Tantrum", "Defeat six trainers in East Province (Area Two); collect the League reward at Levincia for physical Ground coverage.")],
        sources=[("Iono", NL + "levincia-gym-electric-badge-how-to-beat-leader-iono"), ("Area Two map", MAP + "eastprovinceareatwo.shtml"), ("Gengar trade", SV + "ingametrades.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml")], kind="gym")

    stop("mela", "East Province (Area One): Fire Crew", "Star 2 | Mela's strongest foe Lv. 27",
        "Clear the Schedar Squad", [
            ("Return to the Fire Crew marker", "From the eastern Centers, travel to Mela's base in East Province (Area One). Prepare Water, Ground or Rock coverage."),
            ("Win the gate fight and Star Barrage", "Choose your first three Pokemon before ringing the bell. Clear 30 opponents within ten minutes."),
            ("Defeat Mela", "Torkoal's sunlight weakens Water attacks and strengthens Fire attacks. Ground or Rock damage gives an alternative while the sun is active."),
        ], pickups=[("flame-charge", "TM038 Flame Charge", "Collect Mela's reward; it can give a compatible physical attacker Fire coverage and a Speed increase.")],
        tip="Psyduck, the Quaxly line, Nacli or Mudbray can help. Heal before the Starmobile rather than relying on a single weakened counter.",
        sources=[("Mela", NL + "fire-crew-base-how-to-beat-boss-mela")], kind="star")

    stop("orthworm", "East Province (Area Three): Orthworm", "Titan 3 | suggested team Lv. 29-31",
        "Unlock the higher jump and reach Zapapico", [
            ("Head north from Levincia into the mining area", "Follow the Lurking Steel Titan marker through East Province (Area Three)."),
            ("Chase Orthworm through its tunnels", "Trigger its first battle, follow its retreat, then finish the second fight with Arven."),
            ("Use the new higher jump", "Finish the sandwich scene, then use the higher jump for accessible ledges. Continue to Zapapico for the Charcadet armor trade."),
        ], catches=[
            ("Orthworm", "East Province (Area Three), former Titan site", "A defensive Steel partner available as a Lv. 29 static catch after this quest.", {"method": "Post-Titan static encounter", "levels": "Lv. 29"}),
            ("Growlithe", "East Province (Area Three)", "A Fire option if you skipped Fuecoco and Charcadet."),
            ("Larvitar", "East Province (Area Three)", "Scarlet-only long-term Tyranitar project.", {"version": "scarlet"}),
            ("Bagon", "East Province (Area Three)", "Violet-only long-term Salamence project.", {"version": "violet"})],
        tip="Do not use Ground attacks: Orthworm's Earth Eater heals it. Fire and Fighting are the straightforward offensive options.",
        sources=[("Orthworm", NL + "the-lurking-steel-titan"), ("Area Three map", MAP + "eastprovinceareathree.shtml"), ("Former Titans", SV + "titanpokemon.shtml")], kind="titan")

    stop("zapapico", "Zapapico: Charcadet evolution detour", "Optional | around Lv. 30",
        "Get the correct armor for your version", [
            ("Find the armor trader by the small fountain", "In Scarlet, collect ten Bronzor Fragments from Bronzor. In Violet, collect ten Sinistea Chips from Sinistea."),
            ("Trade the materials and use the armor", "Auspicious Armor evolves Charcadet into Armarouge in Scarlet. Malicious Armor gives Ceruledge in Violet; the other armor requires trading."),
            ("Choose whether to stay or return later", "Bronzor can be found around ruins. Sinistea occurs in East Province (Area Three) and around Alfornada; postpone the hunt if the available encounters are too strong."),
        ], catches=[
            ("Sinistea", "East Province (Area Three), near Zapapico", "Violet players need its materials for Malicious Armor; both versions can catch it.")],
        pickups=[("armor", "Auspicious Armor / Malicious Armor", "Trade ten of your version's required materials at Zapapico. Use the armor from the bag on Charcadet."),
                 ("punching-glove", "Punching Glove", "Seven trainer wins in East Province (Area Three) earn this from the League representative at Zapapico. Useful for compatible punching moves.")],
        sources=[("Charcadet armor", "https://game8.co/games/Pokemon-Scarlet-Violet/archives/396749"), ("Area Three map", MAP + "eastprovinceareathree.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml")])

    stop("kofu", "Cascarrafa and Porto Marinada", "Gym 4 | Kofu's ace Lv. 30",
        "Deliver the wallet, learn auctions, and win the Water Badge", [
            ("Fly west and reach Cascarrafa", "Use your western fast-travel points. Approach the gym to receive Kofu's wallet and the instruction to follow him to Porto Marinada."),
            ("Deliver the wallet at Porto Marinada's market", "Travel across the desert without engaging the much stronger Titan yet. Complete Kofu's auction test using the supplied money."),
            ("Return to Cascarrafa for Kofu", "Use Electric or Grass damage against his Water team and Water-Tera Crabominable. Prepare healing before starting."),
        ], pickups=[("chilling-water", "TM022 Chilling Water", "Collect Kofu's gym reward; the attack lowers the opponent's Attack."),
                 ("focus-sash", "Focus Sash: Porto Marinada detour", "Defeat four trainers in West Province (Area Two), then speak to the League representative at Porto Marinada. This can save its full-health holder from one knockout, but is consumed in ordinary battles.")],
        tip="Pawmi's evolved line, Magnemite, Smoliv's line or your Grass starter can cover this gym. Auctions are optional after the test; do not spend your entire supply budget on a bid.",
        sources=[("Kofu and auction", NL + "cascarrafa-gym-water-badge-how-to-beat-leader-kofu"), ("Trainer rewards", SV + "leaguechallenge.shtml")], kind="gym")

    stop("atticus", "Tagtree Thicket: Poison Crew", "Star 3 | Atticus's strongest foe Lv. 33",
        "Clear the Navi Squad with Ground coverage", [
            ("Fly back to the eastern side and enter Tagtree Thicket", "Reach the Poison Crew marker from the East Province (Area Three) side. Explore the painted-tree woodland before the base."),
            ("Prepare three healthy attackers for the barrage", "Ground attacks are particularly useful against the Poison crew. Psychic alone will not cover the Dark/Poison Skuntank."),
            ("Clear the base and defeat Atticus", "Bring poison cures and keep your Ground attacker healthy for the boss team and Starmobile."),
        ], catches=[("Grafaiai", "Tagtree Thicket", "A local Poison/Normal catch for your dex; not your primary Poison Crew counter.")],
        pickups=[("gunk-shot", "TM102 Gunk Shot", "Claim Atticus's reward after clearing the base.")],
        tip="Mudbray's evolved Mudsdale or Clodsire can fill the Ground role. Do not assume every Poison opponent is weak to Psychic.",
        sources=[("Atticus", NL + "poison-crew-base-how-to-beat-boss-atticus"), ("Tagtree map", MAP + "tagtreethicket.shtml")], kind="star")

    stop("larry", "West Province (Area Three) and Medali", "Gym 5 | Larry's ace Lv. 36",
        "Win the Normal Badge and collect the Amulet Coin", [
            ("Travel to Medali through the western roads", "Explore West Province (Area Three) while working toward nine local trainer wins for the Amulet Coin."),
            ("Solve the Treasure Eatery order", "Register at the gym and gather clues, or order: grilled rice balls, medium serving, extra crispy Fire Blast style, with lemon."),
            ("Fight Larry", "Fighting attacks hit his Normal team hard. His Normal-Tera Staraptor still has Flying damage, so do not send in a fragile Fighting Pokemon without a backup."),
        ], catches=[
            ("Shroomish", "West Province (Area Three)", "A catching-team project: keep it unevolved until it learns Spore at Lv. 40, then evolve for Breloom with Spore."),
            ("Ditto", "West Province (Area Three), disguised as other Pokemon", "Useful for breeding. Lock on and check the name rather than trusting the overworld appearance."),
            ("Eevee", "West Province (Area Three), near Medali", "Optional rare catch for whichever evolution fills a team gap."),
            ("Girafarig", "West Province (Area Three)", "Can evolve into Farigiraf after levelling up knowing Twin Beam.")],
        pickups=[("amulet-coin", "Amulet Coin", "Defeat nine trainers in West Province (Area Three) and collect the reward from the League representative at Medali. Have its holder participate to increase prize money."),
                 ("facade", "TM025 Facade", "Larry's gym reward. A physical Normal attack with extra power when the user has certain status conditions.")],
        sources=[("Larry and secret order", NL + "medali-gym-normal-badge-how-to-beat-leader-larry"), ("Medali surroundings", MAP + "westprovinceareathree.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml"), ("Shroomish moves", "https://www.serebii.net/pokedex-sv/shroomish/")], kind="gym")

    stop("ryme", "Dalizapa Passage and Montenevera", "Gym 6 | Ryme's ace Lv. 42",
        "Prepare a pair of attackers for the Ghost gym", [
            ("Use Dalizapa Passage to reach the mountain roads", "Register its Pokemon Center and follow the mountain route to Montenevera. Rare Frigibax is an optional search, not a reason to stop progression."),
            ("Collect the Lucky Egg and begin the concert test", "If this is your sixth gym challenge, Jacq gives you the Lucky Egg. Equip it on a teammate that needs experience."),
            ("Win the double battles", "Prepare your first two Pokemon together. Dark attacks are useful; avoid Earthquake beside a vulnerable ally. Ryme's Toxtricity becomes Ghost type."),
        ], catches=[
            ("Frigibax", "Dalizapa Passage", "Rare Dragon/Ice project for Baxcalibur; its final evolution is at Lv. 54."),
            ("Sneasel", "Dalizapa Passage / snowy mountain slopes", "A Dark/Ice option; Weavile later needs a Razor Claw and a nighttime level-up.")],
        pickups=[("expert-belt", "Expert Belt", "Defeat four trainers in Dalizapa Passage and collect the League representative's reward. Boosts super-effective attacks."),
                 ("lucky-egg", "Lucky Egg from Jacq", "Given when entering your sixth gym challenge, whichever gym you choose. Equip it to increase its holder's experience gains."),
                 ("shadow-ball", "TM114 Shadow Ball", "Ryme's reward; useful special Ghost coverage for a compatible teammate.")],
        sources=[("Ryme", NL + "montenevera-gym-ghost-badge-how-to-beat-leader-ryme"), ("Passage map", MAP + "dalizapapassage.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml"), ("Lucky Egg timing", "https://www.gamepur.com/guides/where-to-get-a-lucky-egg-in-pokemon-scarlet-and-violet")], kind="gym")

    stop("quaking-earth", "Asado Desert: Quaking Earth Titan", "Titan 4 | suggested team Lv. 44-46",
        "Unlock gliding and catch your version's former Titan", [
            ("Return to Cascarrafa and enter Asado Desert", "Follow the Quaking Earth marker. Bring Water coverage and healing before approaching the Titan."),
            ("Fight the version-specific Titan twice", "Scarlet has Ground/Fighting Great Tusk; Violet has Ground/Steel Iron Treads. Water is effective against both. Fairy is useful against Great Tusk, not Iron Treads."),
            ("Finish the sandwich scene", "Gliding is now available. Return to the desert afterward for the separate Lv. 45 former-Titan catch."),
        ], catches=[
            ("Great Tusk", "Asado Desert, former Titan location", "Scarlet's early Paradox catch, available before Area Zero after this quest.", {"version": "scarlet", "method": "Post-Titan static encounter", "levels": "Lv. 45"}),
            ("Iron Treads", "Asado Desert, former Titan location", "Violet's early Paradox catch, available before Area Zero after this quest.", {"version": "violet", "method": "Post-Titan static encounter", "levels": "Lv. 45"})],
        pickups=[("earthquake", "TM149 Earthquake", "Defeat five trainers in Asado Desert and claim the League reward at Cascarrafa. Excellent physical Ground coverage; in doubles it also hits adjacent allies.")],
        sources=[("Quaking Earth battle", NL + "the-quaking-earth-titan"), ("Former Titans", SV + "titanpokemon.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml")], kind="titan")

    stop("tulip", "Alfornada Cavern and Alfornada", "Gym 7 | Tulip's ace Lv. 45",
        "Cross the southwest cavern and win the Psychic Badge", [
            ("Return to West Province (Area One) and head southwest", "Follow the route through Alfornada Cavern using your improved jump. Register Alfornada's Center on arrival."),
            ("Complete Emotional Spectrum Practice", "Register at the gym and follow Dendra's emotion prompts and trainer battles."),
            ("Battle Tulip", "Dark, Ghost and Bug attacks help. Her Gardevoir has Fairy coverage, so a Dark attacker is not automatically a safe switch into everything."),
        ], catches=[("Sinistea", "South Province (Area Six), around Alfornada", "A second opportunity for Violet's armor materials if you postponed Zapapico.")],
        pickups=[("psychic", "TM120 Psychic", "Tulip's reward for special Psychic coverage."),
                 ("flare-blitz", "TM165 Flare Blitz", "Defeat seven trainers in South Province (Area Six); collect the League reward at Alfornada. Powerful physical Fire damage with recoil.")],
        sources=[("Tulip", NL + "alfornada-gym-psychic-badge-how-to-beat-leader-tulip"), ("Area Six", MAP + "southprovinceareasix.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml")], kind="gym")

    stop("grusha", "Glaseado Mountain", "Gym 8 | Grusha's ace Lv. 48",
        "Finish the gym circuit", [
            ("Fly back to the mountain and reach Glaseado Gym", "Heal and check your Fire, Fighting, Rock or Steel coverage. Explore the snowfields if you want an Ice partner."),
            ("Complete the Snow Slope Run", "Register at the gym and finish the marked ride course before returning to reception."),
            ("Defeat Grusha", "His Altaria becomes Ice type but retains Dragon coverage. Keep a healthy second attacker rather than relying on one Fire Pokemon."),
        ], catches=[("Cetoddle", "Glaseado Mountain, snowfields", "A bulky Ice option; evolves with an Ice Stone."),
                    ("Snorunt", "Glaseado Mountain", "A female can become Froslass with a Dawn Stone; either sex can become Glalie at Lv. 42.")],
        pickups=[("ice-spinner", "TM124 Ice Spinner", "Grusha's gym reward; physical Ice coverage for a compatible attacker.")],
        sources=[("Grusha", NL + "glaseado-gym-ice-badge-how-to-beat-leader-grusha"), ("Mountain map", MAP + "glaseadomountain.shtml")], kind="gym")

    stop("ortega", "North Province (Area Three): Fairy Crew", "Star 4 | Ortega's strongest foe Lv. 51",
        "Clear the Ruchbah Squad", [
            ("Descend toward the northern Fairy Crew base", "Use the North Province (Area Three) marker and register a nearby Center. Bring Steel or Poison coverage."),
            ("Clear the gate and timed barrage", "Put your three prepared Pokemon first in the party before starting."),
            ("Defeat Ortega", "Azumarill has Water coverage, so do not rely on Fire types solely to resist Fairy attacks. Keep your Steel or Poison attacker healthy."),
        ], pickups=[("dazzling-gleam", "TM079 Dazzling Gleam", "Collect Ortega's reward. Special Fairy coverage also helps against the coming Dragon and Fighting objectives.")],
        tip="A developed Tinkatink line, Magnemite line or Clodsire can fill useful roles here; choose based on the moves your actual team knows.",
        sources=[("Ortega", NL + "fairy-crew-base-how-to-beat-boss-ortega")], kind="star")

    stop("false-dragon", "Casseroya Lake: False Dragon Titan", "Titan 5 | suggested team Lv. 55-57",
        "Complete the Titan path and unlock climbing", [
            ("Swim to the False Dragon marker in Casseroya Lake", "Prepare for several battles. Interact with the conspicuous Tatsugiri on the island to start the encounter."),
            ("Fight Dondozo, then Tatsugiri", "Electric or Grass attacks help against Water-type Dondozo. Bring Fairy coverage for Dragon/Water Tatsugiri instead of assuming both opponents share weaknesses."),
            ("Finish the final sandwich scene", "Your ride can now climb. Arven's finale becomes available, but heal and prepare for a full team battle before following him."),
        ], catches=[("Dondozo", "Casseroya Lake", "Catch a regular wild one separately from the Titan fights."),
                    ("Tatsugiri", "Casseroya Lake, islands and water", "Regular wild catches are available; the former Titan is a separate Lv. 57 catch after the quest."),
                    ("Dratini", "Casseroya Lake", "A late Dragonite project if you want a Dragon partner.")],
        pickups=[("hydro-pump", "TM142 Hydro Pump", "Seven Casseroya Lake trainer wins earn this from the local League representative. Powerful but less accurate than many other Water attacks.")],
        sources=[("False Dragon", NL + "the-false-dragon-titan"), ("Lake map", MAP + "casseroyalake.shtml"), ("Former Titans", SV + "titanpokemon.shtml"), ("Trainer rewards", SV + "leaguechallenge.shtml")], kind="titan")

    stop("eri", "North Province (Area Two): Fighting Crew", "Star 5 | Eri's strongest foe Lv. 56",
        "Finish the five Team Star bases", [
            ("Travel to the northeastern Fighting Crew marker", "Use your ride upgrades to reach North Province (Area Two). Heal before approaching the gate."),
            ("Prepare for the barrage", "Flying and Fairy coverage are useful. Bring three healthy participants and clear the timed base challenge."),
            ("Defeat Eri", "Her team includes Lucario and Annihilape, so one Fairy attack will not solve every matchup. Bring alternatives for Steel and Ghost combinations."),
        ], catches=[("Bisharp", "North Province (Area Two), bamboo groves", "Later Kingambit project: use a Bisharp to defeat three leader Bisharp holding Leader's Crests, then level it up.")],
        pickups=[("close-combat", "TM167 Close Combat", "Eri's reward: strong physical Fighting coverage at the cost of the user's defenses.")],
        sources=[("Eri", NL + "fighting-crew-base-how-to-beat-boss-eri"), ("Bamboo region", MAP + "northprovinceareatwo.shtml")], kind="star")

    stop("league", "Pokemon League and Nemona", "Finales | suggested team Lv. 60-66",
        "Finish Victory Road", [
            ("Stock supplies and travel northwest from Mesagoza", "You need eight gym badges for the League. Bring healing, status cures and a team covering several types."),
            ("Answer Rika's interview consistently", "Give your correct school: Naranja in Scarlet or Uva in Violet. Remember the goal you choose and match the gym, leader and type when asked."),
            ("Clear the Elite Four and Champion", "Prepare for Ground, Steel, Flying and Dragon teams, then Geeta. You can use bag items between battles; restore HP and PP."),
            ("Meet Nemona for the final rival battle", "Follow her invitation to Mesagoza. Victory Road is complete only after this battle, not just the League."),
        ], sources=[("League walkthrough", NL + "how-to-beat-the-elite-four-and-champion")], kind="finale")

    stop("arven", "Poco Path Lighthouse: Arven", "Finales | suggested team Lv. 60-65",
        "Finish Path of Legends", [
            ("Return after all five Titans", "Follow Arven's request to the Poco Path lighthouse and complete the lab conversation."),
            ("Heal before Arven's battle", "His team is much stronger than the early Titans. Bring varied coverage and a Fighting, Bug or Fairy answer to Mabosstiff."),
            ("Finish the conversation about the crater", "Complete Victory Road and Starfall Street as well before heading to the Zero Gate."),
        ], sources=[("Arven finale", NL + "how-to-beat-arven")], kind="finale")

    stop("penny", "Mesagoza and the Academy: Starfall Finale", "Finales | suggested team Lv. 60-65",
        "Resolve Cassiopeia's challenge", [
            ("Finish all five Team Star bases", "Follow the call to Mesagoza and battle Clavell at the academy entrance."),
            ("Go to the academy schoolyard at night", "Use the academy's room navigation to reach the schoolyard, rather than searching the city streets."),
            ("Defeat Cassiopeia and finish the follow-up scenes", "Prepare coverage for the Eevee evolutions and finish the director's office and Penny conversations to complete Starfall Street."),
        ], sources=[("Starfall finale", NL + "how-to-beat-cassiopeia")], kind="finale")

    stop("area-zero", "The Way Home: Area Zero", "Story ending | suggested team Lv. 65-70",
        "Finish the base-game story", [
            ("Meet your friends at Zero Gate", "Complete all three story finales, then follow the crater invitation. Bring Poke Balls and healing before descending."),
            ("Visit all four research stations", "Follow the party down through Area Zero and release each station's lock. Use station beds to heal; do not skip the terminals."),
            ("Enter Zero Lab and complete the finale", "Prepare for different Paradox teams in Scarlet and Violet. In the final scripted phase, follow the prompt to use your partner legendary."),
        ], tip="Keep the first descent focused on the story. Return after the credits with full ride access for a deliberate Paradox and legendary catch trip.",
        sources=[("Area Zero walkthrough", NL + "the-great-crater-of-paldea-what-is-area-zero"), ("Final battle", NL + "how-to-beat-the-final-boss")], kind="finale")

    stop("postgame", "Postgame: Rematches and Academy Ace", "Postgame | after the credits",
        "Unlock the repeatable tournament and finish your catching tools", [
            ("Return to the academy for the postgame request", "Complete Geeta's inspection by rematching all eight gym leaders, then report back."),
            ("Complete the Academy Ace Tournament", "Prepare a full team for four consecutive battles. This is repeatable after its first clear."),
            ("Return to Area Zero for catches", "Explore for your version's Paradox species and the additional Koraidon or Miraidon near the bottom. Save before the separate legendary encounter."),
            ("Finish the Paldea dex and visit Jacq", "The base-game regional dex has 400 entries. Plan trades for the other starters, version exclusives and trade evolutions; claim the Shiny Charm from Jacq when complete."),
        ], pickups=[("shiny-charm", "Shiny Charm", "Register all 400 Paldea species and speak to Jacq in the Biology Lab. Seeing a species alone does not count.")],
        sources=[("Academy Ace", SV + "academyacetournament.shtml"), ("Dex completion", SV + "pokedexcompletion.shtml")], kind="postgame")

    school_visits = {
        "academy": "At reception, try the introductory subjects. Classes are optional; do not wait here for lessons that require more gym badges. Use the Academy notebook at the end of this route list as your school checklist.",
        "brassius": "With two gym badges, return to school for Languages and Art. Check exclamation marks on the room map for teacher conversations.",
        "iono": "With three gym badges, lesson 3 and each subject's midterm become available after its earlier lessons. Passing a midterm needs 3 of 5 answers.",
        "larry": "With five gym badges, return for lessons 4 and 5 and the next teacher conversations. Titan and Star badges do not count toward these class unlocks.",
        "tulip": "With seven gym badges, take lesson 6 and each final after its earlier classes. Passing a final needs 4 of 5 answers. Check the room map again for friendship events.",
        "postgame": "Finish any remaining teacher conversations, Miriam's story and Clavell's reward. School activities remain available after the credits; use the Academy notebook checklist.",
    }
    for chapter in chapters:
        key = chapter["id"].removeprefix("sv-route-")
        if key in school_visits:
            chapter["school_visit"] = school_visits[key]
    for index, chapter in enumerate(chapters):
        if index + 1 < len(chapters):
            chapter["next_stop"] = {"id": chapters[index + 1]["id"], "title": chapters[index + 1]["title"]}
    chapters.append(build_academy())
    attach_battles(chapters, entries)
    return chapters, items
