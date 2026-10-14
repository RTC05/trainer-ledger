"""Structural regression checks; source review is still required for game facts."""
import unittest
from collections import Counter

from starlette.requests import Request

from app_templates import templates
from v2_data import v2_game_context, _v2_game_library


class PaldeaPlaythroughTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.context = v2_game_context("scarlet-violet")
        cls.chapters = cls.context["generic_guide_chapters"]
        cls.entries = cls.context["v2_entries"]

    def test_full_regional_dex(self):
        self.assertEqual(sorted(e["regional_dex"] for e in self.entries), list(range(1, 401)))
        self.assertEqual(len({e["dex"] for e in self.entries}), 400)
        wooper = next(e for e in self.entries if e["dex"] == 194)
        self.assertEqual(wooper["types"], ["poison", "ground"])

    def test_all_main_objectives(self):
        kinds = Counter(c["objective_kind"] for c in self.chapters)
        self.assertEqual(kinds["gym"], 8)
        self.assertEqual(kinds["titan"], 5)
        self.assertEqual(kinds["star"], 5)
        ids = [c["id"] for c in self.chapters]
        for key in ("league", "arven", "penny"):
            self.assertLess(ids.index("sv-route-" + key), ids.index("sv-route-area-zero"))

    def test_ids_and_item_ownership(self):
        ids = [c["id"] for c in self.chapters]
        self.assertEqual(len(ids), len(set(ids)))
        steps = [s["id"] for c in self.chapters for s in c["guide_steps"]]
        self.assertEqual(len(steps), len(set(steps)))
        items = self.context["generic_guide_items"]
        self.assertEqual(len(items), len({i["id"] for i in items}))
        for item in items:
            self.assertIn(item["chapter_id"], ids)
            self.assertIn(item, self.context["generic_guide_items_by_chapter"][item["chapter_id"]])

    def test_targets_match_real_dex_identities(self):
        by_dex = {e["dex"]: e for e in self.entries}
        for chapter in self.chapters:
            targets = chapter["pokemon_targets"]
            self.assertEqual(len(targets), len({t["dex"] for t in targets}))
            for target in targets:
                entry = by_dex[target["dex"]]
                self.assertEqual(target["name"], entry["name"])
                self.assertEqual(target["display_dex"], entry["regional_dex"])
                self.assertIn(target["version_availability"], ("both", "scarlet", "violet"))

    def test_starter_gate_and_sources(self):
        starter = self.chapters[0]["guide_steps"][0]
        self.assertEqual(starter["id"], "sv-starter")
        self.assertTrue(starter["requires_starter"])
        for chapter in self.chapters:
            self.assertTrue(chapter["sources"])
            self.assertTrue(all(s["url"].startswith("https://") for s in chapter["sources"]))

    def test_library_does_not_claim_exhaustive_completion(self):
        game = next(g for g in _v2_game_library() if g["id"] == "scarlet-violet")
        self.assertEqual(game["status"], "Playable now")
        self.assertNotIn("100%", str(game))

    def test_real_template_renders_trackers_and_sources(self):
        request = Request({"type": "http", "method": "GET", "path": "/v2/game/scarlet-violet", "headers": [], "session": {}})
        html = templates.get_template("v2_game_preview.html").render(
            **self.context, request=request, current_user=None)
        self.assertIn("Recommended catches", html)
        self.assertIn("Area maps and sources", html)
        self.assertNotIn("Paldea route spine", html)
        self.assertNotIn("pre-Roark", html)
        self.assertNotIn("raids, DLC", html)
        self.assertIn('data-sv-academy', html)
        self.assertIn('data-sv-starter-status role="status"', html)
        self.assertIn('/static/sv-guide.css?v=', html)
        for dex in (906, 909, 912):
            self.assertIn(f'data-generic-starter="{dex}" aria-pressed="false"', html)
        self.assertIn('data-requires-generic-starter="true"', html)
        for chapter in self.chapters:
            self.assertIn('data-generic-guide-panel="' + chapter["id"] + '"', html)
            for step in chapter["guide_steps"]:
                self.assertIn('data-generic-guide-step="' + step["id"] + '"', html)


if __name__ == "__main__":
    unittest.main()
