'use strict';
// Unconditional property bonuses only, S1 through S5. Situational triggers are
// intentionally kept separate from these verified stat properties.
const cataloguePassiveProperties={
  "21002": [
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.16
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.18
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.2
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.22
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.24
      }
    ]
  ],
  "21003": [
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.16
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.2
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.24
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.28
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.32
      }
    ]
  ],
  "21004": [
    [
      {
        "type": "BreakDamageAddedRatioBase",
        "value": 0.28
      }
    ],
    [
      {
        "type": "BreakDamageAddedRatioBase",
        "value": 0.35
      }
    ],
    [
      {
        "type": "BreakDamageAddedRatioBase",
        "value": 0.42
      }
    ],
    [
      {
        "type": "BreakDamageAddedRatioBase",
        "value": 0.49
      }
    ],
    [
      {
        "type": "BreakDamageAddedRatioBase",
        "value": 0.56
      }
    ]
  ],
  "21005": [
    [],
    [],
    [],
    [],
    []
  ],
  "21006": [
    [],
    [],
    [],
    [],
    []
  ],
  "21007": [
    [
      {
        "type": "HealRatioBase",
        "value": 0.1
      }
    ],
    [
      {
        "type": "HealRatioBase",
        "value": 0.125
      }
    ],
    [
      {
        "type": "HealRatioBase",
        "value": 0.15
      }
    ],
    [
      {
        "type": "HealRatioBase",
        "value": 0.175
      }
    ],
    [
      {
        "type": "HealRatioBase",
        "value": 0.2
      }
    ]
  ],
  "21008": [
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.2
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.25
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.3
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.35
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.4
      }
    ]
  ],
  "21009": [
    [],
    [],
    [],
    [],
    []
  ],
  "21050": [
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.12
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.15
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.18
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.21
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.24
      }
    ]
  ],
  "21064": [
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.12
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.14
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.16
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.18
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.2
      }
    ]
  ],
  "21065": [
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.12
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.14
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.16
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.18
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.2
      }
    ]
  ],
  "21066": [
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.2
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.25
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.3
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.35
      }
    ],
    [
      {
        "type": "ElationDamageAddedRatioBase",
        "value": 0.4
      }
    ]
  ],
  "23000": [
    [],
    [],
    [],
    [],
    []
  ],
  "23001": [
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.18
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.21
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.24
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.27
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.3
      }
    ]
  ],
  "23002": [
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.24
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.28
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.32
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.36
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.4
      }
    ]
  ],
  "23003": [
    [
      {
        "type": "SPRatioBase",
        "value": 0.1
      }
    ],
    [
      {
        "type": "SPRatioBase",
        "value": 0.12
      }
    ],
    [
      {
        "type": "SPRatioBase",
        "value": 0.14
      }
    ],
    [
      {
        "type": "SPRatioBase",
        "value": 0.16
      }
    ],
    [
      {
        "type": "SPRatioBase",
        "value": 0.18
      }
    ]
  ],
  "23004": [
    [],
    [],
    [],
    [],
    []
  ],
  "23005": [
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.24
      },
      {
        "type": "StatusProbabilityBase",
        "value": 0.24
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.28
      },
      {
        "type": "StatusProbabilityBase",
        "value": 0.28
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.32
      },
      {
        "type": "StatusProbabilityBase",
        "value": 0.32
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.36
      },
      {
        "type": "StatusProbabilityBase",
        "value": 0.36
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.4
      },
      {
        "type": "StatusProbabilityBase",
        "value": 0.4
      }
    ]
  ],
  "23006": [
    [
      {
        "type": "AllDamageTypeAddedRatio",
        "value": 0.24
      }
    ],
    [
      {
        "type": "AllDamageTypeAddedRatio",
        "value": 0.28
      }
    ],
    [
      {
        "type": "AllDamageTypeAddedRatio",
        "value": 0.32
      }
    ],
    [
      {
        "type": "AllDamageTypeAddedRatio",
        "value": 0.36
      }
    ],
    [
      {
        "type": "AllDamageTypeAddedRatio",
        "value": 0.4
      }
    ]
  ],
  "23007": [
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.24
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.28
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.32
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.36
      }
    ],
    [
      {
        "type": "StatusProbabilityBase",
        "value": 0.4
      }
    ]
  ],
  "23008": [
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.24
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.28
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.32
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.36
      }
    ],
    [
      {
        "type": "AttackAddedRatio",
        "value": 0.4
      }
    ]
  ],
  "23009": [
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.18
      },
      {
        "type": "HPAddedRatio",
        "value": 0.18
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.21
      },
      {
        "type": "HPAddedRatio",
        "value": 0.21
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.24
      },
      {
        "type": "HPAddedRatio",
        "value": 0.24
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.27
      },
      {
        "type": "HPAddedRatio",
        "value": 0.27
      }
    ],
    [
      {
        "type": "CriticalChanceBase",
        "value": 0.3
      },
      {
        "type": "HPAddedRatio",
        "value": 0.3
      }
    ]
  ],
  "23010": [
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.36
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.42
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.48
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.54
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.6
      }
    ]
  ],
  "23011": [
    [
      {
        "type": "HPAddedRatio",
        "value": 0.24
      },
      {
        "type": "SPRatioBase",
        "value": 0.12
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.28
      },
      {
        "type": "SPRatioBase",
        "value": 0.14
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.32
      },
      {
        "type": "SPRatioBase",
        "value": 0.16
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.36
      },
      {
        "type": "SPRatioBase",
        "value": 0.18
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.4
      },
      {
        "type": "SPRatioBase",
        "value": 0.2
      }
    ]
  ],
  "23012": [
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.3
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.35
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.4
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.45
      }
    ],
    [
      {
        "type": "CriticalDamageBase",
        "value": 0.5
      }
    ]
  ],
  "23013": [
    [
      {
        "type": "HPAddedRatio",
        "value": 0.18
      },
      {
        "type": "HealRatioBase",
        "value": 0.12
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.21
      },
      {
        "type": "HealRatioBase",
        "value": 0.14
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.24
      },
      {
        "type": "HealRatioBase",
        "value": 0.16
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.27
      },
      {
        "type": "HealRatioBase",
        "value": 0.18
      }
    ],
    [
      {
        "type": "HPAddedRatio",
        "value": 0.3
      },
      {
        "type": "HealRatioBase",
        "value": 0.2
      }
    ]
  ],
  "23036": [
    [
      {
        "type": "BaseSpeed",
        "value": 12
      }
    ],
    [
      {
        "type": "BaseSpeed",
        "value": 14
      }
    ],
    [
      {
        "type": "BaseSpeed",
        "value": 16
      }
    ],
    [
      {
        "type": "BaseSpeed",
        "value": 18
      }
    ],
    [
      {
        "type": "BaseSpeed",
        "value": 20
      }
    ]
  ],
  "23055": [
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.48
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.6
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.72
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.84
      }
    ],
    [
      {
        "type": "DefenceAddedRatio",
        "value": 0.96
      }
    ]
  ]
};
