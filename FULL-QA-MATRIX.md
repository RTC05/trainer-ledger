# Full QA Matrix — PokéDex + Gym Accuracy

_Last updated: 2026-04-04_

This matrix tracks per-game verification for:
- Gym/Challenge roster accuracy
- Dex data integrity (no duplicate row collisions, coherent numbering)
- Version-difference handling (where paired versions differ)

Legend:
- ✅ Verified (code + data integrity pass complete)
- 🟡 Structurally clean, needs canonical/manual roster verification
- ⚪ Placeholder / future content

---

## Current integrity snapshot (from audit tooling)

- Global dex integrity audit (`audit_games.py`): **issues_found=0**
- Known prior duplication issues repaired for: **sun-moon, usum, sword-shield view layering**
- Startup migration now auto-normalizes duplicate regional dex numbers per game.

---

## Per-game QA table

| Game ID | Gen | Gym entries | Expected regional (slug) | DB total | Sources (regional/dlc/national) | Version split modeled | Status | Notes |
|---|---:|---:|---:|---:|---|---|---|---|
| red-blue | 1 | 13 | 151 | 151 | 151/0/0 | red,blue | 🟡 | Canonical Kanto lineup present. |
| yellow | 1 | 13 | 151 | 151 | 151/0/0 | yellow | 🟡 | Uses Kanto roster baseline. |
| gold-silver | 2 | 13 | 251 | 251 | 251/0/0 | gold,silver | 🟡 | Johto league roster loaded. |
| crystal | 2 | 13 | 251 | 251 | 251/0/0 | crystal | 🟡 | Shares Johto baseline (manual Crystal specifics pending). |
| ruby-sapphire | 3 | 13 | 135 | 135 | 135/0/0 | ruby,sapphire | 🟡 | Hoenn baseline loaded. |
| emerald | 3 | 13 | 135 | 135 | 135/0/0 | emerald | 🟡 | Shares Hoenn baseline (Emerald-specific E4/team differences pending). |
| firered-leafgreen | 3 | 13 | 151 | 151 | 151/0/0 | firered,leafgreen | ✅ | Fixed: Gym 5 correctly Koga (not Janine). |
| diamond-pearl | 4 | 13 | 107 | 107 | 107/0/0 | diamond,pearl | 🟡 | Sinnoh DP roster loaded. |
| platinum | 4 | 13 | 107 | 107 | 107/0/0 | platinum | ✅ | Split into dedicated Platinum roster bucket. |
| heartgold-soulsilver | 4 | 21 | 251 | 251 | 251/0/0 | heartgold,soulsilver | 🟡 | Includes Kanto postgame gyms. |
| black-white | 5 | 13 | 156 | 156 | 156/0/0 | black,white | 🟡 | Unova BW roster loaded. |
| black2-white2 | 5 | 13 | 156 | 301 | 301/0/0 | black-2,white-2 | 🟡 | Updated-Unova dex intentionally larger than BW. |
| x-y | 6 | 13 | 72 | 72 | 72/0/0 | x,y | 🟡 | Kalos central/coastal/mountain merged sequence. |
| oras | 6 | 13 | 135 | 135 | 135/0/0 | omega-ruby,alpha-sapphire | ✅ | Fixed: Wallace gym leader, Steven champion. |
| sun-moon | 7 | 16 | 88 | 309 | 309/0/0 | sun,moon | ✅ | Fixed duplicate dex numbering normalization. |
| usum | 7 | 16 | 88 | 405 | 405/0/0 | ultra-sun,ultra-moon | ✅ | Fixed duplicate dex numbering normalization. |
| lets-go | 7 | 13 | 153 | 153 | 153/0/0 | lets-go-pikachu,lets-go-eevee | 🟡 | Kanto + Meltan/Melmetal slug behavior retained. |
| sword-shield | 8 | 11 | 96 | 905 | 400/0/505 | sword,shield | ✅ | Regional/National coexistence stable; audit clean by source bucket. |
| bdsp | 8 | 13 | 107 | 107 | 107/0/0 | brilliant-diamond,shining-pearl | 🟡 | Sinnoh subset configured. |
| legends-arceus | 8 | 0 | 96 | 242 | 242/0/0 | legends-arceus | ✅ | Numbering context fix shipped (Game Dex vs National labels). |
| scarlet-violet | 9 | 13 | 120 | 120 | 120/0/0 | scarlet,violet | 🟡 | Base Paldea + DLC scaffolding in place. |
| legends-za | 9 | 0 | 72 | 72 | 72/0/0 | - | ✅ | Corrected to Gen 9. |
| winds-waves | 10 | 0 | 1025 | 0 | 0/0/0 | - | ⚪ | Gen 10 placeholder only. |

---

## Change log of QA repairs completed in this pass

1. **Legends Z-A** corrected from Gen 10 → **Gen 9**.
2. Added **Winds/Waves** Gen 10 placeholder game entry.
3. **FR/LG gym fix:** reverted Gym 5 leader to **Koga**.
4. **ORAS gym/champion fix:** Gym 8 **Wallace**, Champion **Steven**.
5. Split **Platinum** gym roster bucket from generic Sinnoh mapping.
6. Added loader + DB safeguards against duplicate regional dex-number collisions.
7. Added game-aware Arceus detail-drawer numbering labels.

---

## Next manual verification queue (canonical accuracy pass)

Priority A (version-sensitive roster details):
- yellow
- crystal
- emerald
- diamond-pearl vs platinum
- black-white vs black2-white2
- sun-moon vs usum
- scarlet-violet (league/champion event-path nuances)

Priority B (encounter/dex composition per paired versions):
- firered vs leafgreen exclusives (surface in UI notes)
- ruby vs sapphire exclusives
- diamond vs pearl exclusives
- sword vs shield exclusives
- scarlet vs violet exclusives

---

## Acceptance criteria for “fully verified”

A game moves from 🟡 to ✅ only when:
1. Gym/challenge roster cross-checked against canonical source.
2. Version-specific differences are either:
   - represented in data, or
   - documented in a visible game note/changelog entry.
3. Dex integrity checks pass (already automated).
4. Manual UI sanity pass confirms no dual-number confusion.
