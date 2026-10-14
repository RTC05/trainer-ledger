# Scarlet/Violet playthrough coverage

## Implemented

- Base-game recommended order through 8 gyms, 5 Titans, 5 Star bases, the three
  story finales, Area Zero and the postgame rematch/tournament introduction.
- 28 stops, 86 sequential actions, 31 nearby reward reminders.
- Selected useful catches with habitat, purpose, acquisition method and explicit
  version restrictions where applicable. National identities come from the
  existing 400-entry Paldea regional dex; display numbers remain regional.
- Chapter-level map/walkthrough source links, rather than unsupported completion
  claims. Sources are stored beside each chapter in `sv_playthrough.py`.
- Starter gate, existing caught tracking and browser-saved checklist integration.

## Research notes

Encounter habitats were checked against Serebii's Paldea area pages. Objective
order, gym tests and battle details were checked against Nintendo Life's
Scarlet/Violet walkthrough. Reward counts use Serebii's area, League challenge,
NPC trade and dex-reward pages. Source URLs are available within each guide stop.

The Shell Bell reward is a source conflict: Serebii's aggregate League table
lists seven trainers, while its South Province Area Three page and Thonky's
area walkthrough specify six. This guide uses six and links the corroboration.

Suggested team levels and recommended partners are advice, not encounter tables
or guarantees. The route is one difficulty-oriented path, not the only valid one.

## Not yet exhaustive

This is not a complete spawn catalog or an inventory of every fixed, hidden,
random or respawning item. Outstanding depth includes individual stake routes,
full Area Zero encounter tables, every unusual evolution, raid unlock details,
academy side conversations and a complete province-by-province item ledger.
DLC and time-limited events are excluded. Do not label this guide 100% complete.

The rewritten steps have new IDs. Existing caught Pokemon and starter settings
remain; old chapter/item completion flags are not mapped to potentially different
tasks. Users with an older Scarlet/Violet run may need to recheck completed steps.

## Verification

Run `.venv/bin/python -m unittest test_sv_playthrough -v`.
Tests cover regional numbering, identities, objective counts/order, unique IDs,
item ownership, starter gating, sources, honest library status and real template
rendering. These validate structure, not the truth of every gameplay fact.

Manual browser checks: starter selection, step count update, route switching,
catch and item accordion clicks, Nacli/Shell Bell tracking and reload persistence.
Phone-width catch cards were checked at 390px and corrected for clipping.
All 23 game contexts also rendered through the shared template without errors.
