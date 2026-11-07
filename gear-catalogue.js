'use strict';
// Verified LC identities, rarities and Lv.80 promotion stats from StarRailRes.
const expandedLightCones=[
  {
    "id": "23000",
    "name": "Night on the Milky Way",
    "path": "Erudition",
    "rarity": 5,
    "base": {
      "hp": 1164.24,
      "atk": 582.12,
      "def": 396.9
    }
  },
  {
    "id": "23001",
    "name": "In the Night",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23002",
    "name": "Something Irreplaceable",
    "path": "Destruction",
    "rarity": 5,
    "base": {
      "hp": 1164.24,
      "atk": 582.12,
      "def": 396.9
    }
  },
  {
    "id": "23003",
    "name": "But the Battle Isn't Over",
    "path": "Harmony",
    "rarity": 5,
    "base": {
      "hp": 1164.24,
      "atk": 529.2,
      "def": 463.05
    }
  },
  {
    "id": "23004",
    "name": "In the Name of the World",
    "path": "Nihility",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23005",
    "name": "Moment of Victory",
    "path": "Preservation",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 476.28,
      "def": 595.35
    }
  },
  {
    "id": "23006",
    "name": "Patience Is All You Need",
    "path": "Nihility",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23007",
    "name": "Incessant Rain",
    "path": "Nihility",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23008",
    "name": "Echoes of the Coffin",
    "path": "Abundance",
    "rarity": 5,
    "base": {
      "hp": 1164.24,
      "atk": 582.12,
      "def": 396.9
    }
  },
  {
    "id": "23009",
    "name": "The Unreachable Side",
    "path": "Destruction",
    "rarity": 5,
    "base": {
      "hp": 1270.08,
      "atk": 582.12,
      "def": 330.75
    }
  },
  {
    "id": "23010",
    "name": "Before Dawn",
    "path": "Erudition",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23011",
    "name": "She Already Shut Her Eyes",
    "path": "Preservation",
    "rarity": 5,
    "base": {
      "hp": 1270.08,
      "atk": 423.36,
      "def": 529.2
    }
  },
  {
    "id": "23012",
    "name": "Sleep Like the Dead",
    "path": "The Hunt",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23013",
    "name": "Time Waits for No One",
    "path": "Abundance",
    "rarity": 5,
    "base": {
      "hp": 1270.08,
      "atk": 476.28,
      "def": 463.05
    }
  },
  {
    "id": "23014",
    "name": "I Shall Be My Own Sword",
    "path": "Destruction",
    "rarity": 5,
    "base": {
      "hp": 1164.24,
      "atk": 582.12,
      "def": 396.9
    }
  },
  {
    "id": "23036",
    "name": "Time Woven Into Gold",
    "path": "Remembrance",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 635.04,
      "def": 396.9
    }
  },
  {
    "id": "23053",
    "name": "Dazzled by a Flowery World",
    "path": "Elation",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 582.12,
      "def": 463.05
    }
  },
  {
    "id": "23055",
    "name": "Colors for Tomorrow",
    "path": "Elation",
    "rarity": 5,
    "base": {
      "hp": 1058.4,
      "atk": 476.28,
      "def": 595.35
    }
  },
  {
    "id": "21050",
    "name": "Victory In a Blink",
    "path": "Remembrance",
    "rarity": 4,
    "base": {
      "hp": 846.72,
      "atk": 476.28,
      "def": 396.9
    }
  },
  {
    "id": "21064",
    "name": "Mushy Shroomy's Adventures",
    "path": "Elation",
    "rarity": 4,
    "base": {
      "hp": 846.72,
      "atk": 476.28,
      "def": 396.9
    }
  },
  {
    "id": "21065",
    "name": "Today's Good Luck",
    "path": "Elation",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 529.2,
      "def": 396.9
    }
  },
  {
    "id": "21066",
    "name": "A Little Getaway",
    "path": "Elation",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 423.36,
      "def": 396.9
    }
  },
  {
    "id": "21002",
    "name": "Day One of My New Life",
    "path": "Preservation",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 370.44,
      "def": 463.05
    }
  },
  {
    "id": "21003",
    "name": "Only Silence Remains",
    "path": "The Hunt",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 476.28,
      "def": 330.75
    }
  },
  {
    "id": "21004",
    "name": "Memories of the Past",
    "path": "Harmony",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 423.36,
      "def": 396.9
    }
  },
  {
    "id": "21005",
    "name": "The Moles Welcome You",
    "path": "Destruction",
    "rarity": 4,
    "base": {
      "hp": 1058.4,
      "atk": 476.28,
      "def": 264.6
    }
  },
  {
    "id": "21006",
    "name": "The Birth of the Self",
    "path": "Erudition",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 476.28,
      "def": 330.75
    }
  },
  {
    "id": "21007",
    "name": "Shared Feeling",
    "path": "Abundance",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 423.36,
      "def": 396.9
    }
  },
  {
    "id": "21008",
    "name": "Eyes of the Prey",
    "path": "Nihility",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 476.28,
      "def": 330.75
    }
  },
  {
    "id": "21009",
    "name": "Landau's Choice",
    "path": "Preservation",
    "rarity": 4,
    "base": {
      "hp": 952.56,
      "atk": 423.36,
      "def": 396.9
    }
  }
];
