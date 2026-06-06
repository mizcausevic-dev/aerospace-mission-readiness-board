import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from aerospace_mission_board import build_pack  # noqa: E402


class PackTest(unittest.TestCase):
    def test_pack_prioritizes_hold_mission(self):
        pack = build_pack("fixtures/mission-readiness.json")
        self.assertEqual(pack["findings"][0]["missionId"], "ORBITAL-DAWN-4")
        self.assertEqual(pack["holdMissions"], 2)
        self.assertIn("ORBITAL-DAWN-4", pack["primaryRecommendation"])


if __name__ == "__main__":
    unittest.main()
