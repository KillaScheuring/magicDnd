export const getFormConfig = (cardType) => {
    switch (cardType){
        case "Creature":
            return {
                "powerAboveVanilla": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Power",
                        "smallScreen": "Creature power",
                        "largeScreen": "Creature power",
                    },
                    "helperText": "+1 point per power above vanilla. (No discount for below)"
                },
                "toughnessAboveVanilla": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Toughness",
                        "smallScreen": "Creature Toughness",
                        "largeScreen": "Creature Toughness",
                    },
                    "helperText": "+1 point per toughness above vanilla. (No discount for below)"
                },
                "abilities": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Abilities",
                        "smallScreen": "Number of abilities",
                        "largeScreen": "Number of abilities",
                    },
                    "helperText": "+1 point per ability."
                },
                "wordyAbilities": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Wordy Abilities",
                        "smallScreen": "Wordy Abilities",
                        "largeScreen": "Wordy Abilities",
                    },
                    "helperText": "+3 more points for an ability if that ability is 10 words or more."
                },
                "evasionAbilities": {
                    "multiplier": 2,
                    "label": {
                        "equation": "Evasion Abilities",
                        "smallScreen": "Evasion Abilities",
                        "largeScreen": "Evasion Abilities",
                    },
                    "helperText": "+2 more points if that ability is evasion of some kind. (Flying, Shadow, Menace, Trample, etc.)"
                },
                "protectionAbilities": {
                    "multiplier": 2,
                    "label": {
                        "equation": "Protection Abilities",
                        "smallScreen": "Protection Abilities",
                        "largeScreen": "Protection Abilities",
                    },
                    "helperText": "+2 more points if that ability is a protection ability. (Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc.)"
                },
                "stupidAbilities": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Stupid Abilities",
                        "smallScreen": "Stupid Abilities",
                        "largeScreen": "Stupid Abilities",
                    },
                    "helperText": "+5 points if that ability is inherently stupid. (Specifically: Annihilator, Infect, Cascade, & Affinity)"
                },
                "creaturesRemoved": {
                    "multiplier": 7,
                    "label": {
                        "equation": "Removal",
                        "smallScreen": "Creatures destroyed or removed",
                        "largeScreen": "Abilities that destroy or remove creatures",
                    },
                    "helperText": "+7 points if the ability destroys or exiles another creature."
                },
                "monarchOrInit": {
                    "multiplier": 10,
                    "label": {
                        "equation": "Monarch/Initiative",
                        "smallScreen": "Monarch/Initiative",
                        "largeScreen": "Monarch/Initiative",
                    },
                    "helperText": "+10 points if the ability introduces the Monarch or Initiative."
                },
                "searchesLibrary": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Searches",
                        "smallScreen": "Searches library",
                        "largeScreen": "Searches library",
                    },
                    "helperText": "+5 points if it triggers a search of a library."
                },
                "manaAbilities": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Mana Abilities",
                        "smallScreen": "Number of mana abilities",
                        "largeScreen": "Number of mana abilities",
                    },
                    "helperText": "+5 points for a mana ability."
                }
            }
        case "Non-Creature Artifact":
            return {
                "nonManaAbilities": {
                    "multiplier": 2,
                    "label": {
                        "equation": "Non-Mana Abilities",
                        "smallScreen": "Non-mana abilities",
                        "largeScreen": "Non-mana abilities",
                    },
                    "helperText": "+2 points per non-mana ability."
                },
                "wordyAbilities": {
                    "multiplier": 4,
                    "label": {
                        "equation": "Wordy Abilities",
                        "smallScreen": "Wordy Abilities",
                        "largeScreen": "Wordy Abilities",
                    },
                    "helperText": "+4 points if that ability is 10 words or more."
                },
                "addedMana": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Mana Added",
                        "smallScreen": "Mana added in a turn",
                        "largeScreen": "Amount of mana added in a turn",
                    },
                    "helperText": "+4 points if that ability is 10 words or more."
                }
            }
        case "Non-Creature Enchantment/Battle":
            return {
                "abilities": {
                    "multiplier": 2,
                    "label": {
                        "equation": "Abilities",
                        "smallScreen": "Number of abilities",
                        "largeScreen": "Number of abilities",
                    },
                    "helperText": "+2 points per ability."
                },
                "wordyAbilities": {
                    "multiplier": 4,
                    "label": {
                        "equation": "Wordy Abilities",
                        "smallScreen": "Wordy Abilities",
                        "largeScreen": "Wordy Abilities",
                    },
                    "helperText": "+4 points if that ability is 10 words or more."
                },
                "beginsInPlay": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Begins in Play",
                        "smallScreen": "Begins in play",
                        "largeScreen": "Begins in play",
                    },
                    "helperText": "+5 points if it can begin the game in play."
                },
                "controlPermanent": {
                    "multiplier": 9,
                    "label": {
                        "equation": "Controls a Permanent",
                        "smallScreen": "Controls a permanent",
                        "largeScreen": "Gains control of a permanent",
                    },
                    "helperText": "+9 points if it can gain control of a permanent."
                },
                "pacify": {
                    "multiplier": 8,
                    "label": {
                        "equation": "Pacifies/Arrests/Exiles",
                        "smallScreen": "Pacify/Arrest/Exile",
                        "largeScreen": "Pacify/Arrest/Exile",
                    },
                    "helperText": "+8 points if it can pacify, arrest, or exile."
                }
            }
        case "Non-Basic Land":
            return {
                "colorsProducedOrFetched": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Colors",
                        "smallScreen": "Number of colors produced or lands fetched",
                        "largeScreen": "Colors produced or lands fetched",
                    },
                    "helperText": "+3 points per color it can produce. (OR FETCH!)"
                },
                "landType": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Basic Land Type",
                        "smallScreen": "Basic land type",
                        "largeScreen": "Basic land type",
                    },
                    "helperText": "+5 points if it has basic land types."
                },
                "subType": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Land Subtype",
                        "smallScreen": "Subtype",
                        "largeScreen": "Subtype",
                    },
                    "helperText": "+5 points if it has a land subtype."
                },
                "manLand": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Creature",
                        "smallScreen": "Make/become creature",
                        "largeScreen": "Make/become creature",
                    },
                    "helperText": "+5 points if it can make or become a creature."
                },
                "nonManaAbilities": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Non-Mana Abilities",
                        "smallScreen": "Non-Mana Abilities",
                        "largeScreen": "Non-Mana Abilities",
                    },
                    "helperText": "+3 points for each non-mana ability. (Not including coming into play tapped or untapped)"
                },
                "untapped": {
                    "multiplier": 4,
                    "label": {
                        "equation": "Untapped",
                        "smallScreen": "Untapped",
                        "largeScreen": "Enters Untapped",
                    },
                    "helperText": "+4 points if it can come into play untapped."
                },
                "addedMana": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Mana",
                        "smallScreen": "Added mana",
                        "largeScreen": "Added mana",
                    },
                    "helperText": "+5, +12, or +21 points depending on how much mana it can make"
                }
            }
        case "Planeswalker":
            return {
                "loyalty": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Loyalty",
                        "smallScreen": "Starting loyalty",
                        "largeScreen": "Starting loyalty",
                    },
                    "helperText": "+3 points per starting loyalty."
                },
                "plusAbilities": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Plus Abilities",
                        "smallScreen": "Plus (or 0) abilities",
                        "largeScreen": "Number of plus (or 0) abilities",
                    },
                    "helperText": "+3 points per “+” ability (or 0 ability)."
                },
                "minusAbilities": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Minus Abilities",
                        "smallScreen": "Minus abilities",
                        "largeScreen": "Number of minus abilities",
                    },
                    "helperText": "+1 point per “-“ ability."
                },
                "staticAbilities": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Static Abilities",
                        "smallScreen": "Static abilities",
                        "largeScreen": "Number of static abilities",
                    },
                    "helperText": "+3 points per static ability."
                },
            }
        default:
            return {
                "damage": {
                    "multiplier": 2,
                    "label": {
                        "equation": "Damage",
                        "smallScreen": "Damage/life lost",
                        "largeScreen": "Damage/life lost to opponent",
                    },
                    "helperText": "+2 points for each damage done/life lost to op."
                },
                "life": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Life",
                        "smallScreen": "Life gained by player",
                        "largeScreen": "Life gained",
                    },
                    "helperText": "+1 point for each life gained."
                },
                "cardsDrawn": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Drawn",
                        "smallScreen": "Cards drawn by player",
                        "largeScreen": "Cards drawn",
                    },
                    "helperText": "+3 points for every card drawn."
                },
                "cardsLookedAt": {
                    "multiplier": 1,
                    "label": {
                        "equation": "Cards Looked at",
                        "smallScreen": "Cards looked at",
                        "largeScreen": "Cards looked at and not drawn",
                    },
                    "helperText": "+1 point for every card looked at but not drawn."
                },
                "creaturesRemoved": {
                    "multiplier": 8,
                    "label": {
                        "equation": "Creatures Killed",
                        "smallScreen": "Creatures destroyed or removed",
                        "largeScreen": "Creatures destroyed or removed",
                    },
                    "helperText": "+8 points for each creature destroyed or removed."
                },
                "extraTurns": {
                    "multiplier": 20,
                    "label": {
                        "equation": "Extra Turns",
                        "smallScreen": "Extra turns added",
                        "largeScreen": "Extra turns added",
                    },
                    "helperText": "+20 points per extra turn taken."
                },
                "tutorsTop": {
                    "multiplier": 9,
                    "label": {
                        "equation": "Tutors Top",
                        "smallScreen": "Tutors to top",
                        "largeScreen": "Tutors to top",
                    },
                    "helperText": "+9 points if card tutors to top of library."
                },
                "tutorsBoard": {
                    "multiplier": 11,
                    "label": {
                        "equation": "Tutor Board/Hand",
                        "smallScreen": "Tutors to hand/board",
                        "largeScreen": "Tutors to hand/board",
                    },
                    "helperText": "+11 points if card tutors to hand/board."
                },
                "countersSpell": {
                    "multiplier": 9,
                    "label": {
                        "equation": "Counters Spell",
                        "smallScreen": "Counters Spell",
                        "largeScreen": "Counters Spell",
                    },
                    "helperText": "+9 points if card can counter a spell."
                },
                "landRemoved": {
                    "multiplier": 7,
                    "label": {
                        "equation": "Land Removal",
                        "smallScreen": "Destroys/removes land",
                        "largeScreen": "Destroys/removes land",
                    },
                    "helperText": "+7 points if card destroys or exiles a land."
                },
                "cardsDiscarded": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Discard",
                        "smallScreen": "Opponent discards",
                        "largeScreen": "Cards opponent discards",
                    },
                    "helperText": "+3 points for each card an opponent discarded."
                },
                "storm": {
                    "multiplier": 8,
                    "label": {
                        "equation": "Storm",
                        "smallScreen": "Storm",
                        "largeScreen": "Storm",
                    },
                    "helperText": "+8 points if card has storm"
                },
                "cascade": {
                    "multiplier": 5,
                    "label": {
                        "equation": "Cascade",
                        "smallScreen": "Cascade",
                        "largeScreen": "Cascade",
                    },
                    "helperText": "+5 points if card has cascade"
                },
                "monarchOrInit": {
                    "multiplier": 10,
                    "label": {
                        "equation": "Monarch/Initiative",
                        "smallScreen": "Monarch/Initiative",
                        "largeScreen": "Adds Monarch/Initiative",
                    },
                    "helperText": "+10 points if card introduces the Monarch or Initiative"
                },
                "boardWipe": {
                    "multiplier": 10,
                    "label": {
                        "equation": "Monarch/Initiative",
                        "smallScreen": "Monarch/Initiative",
                        "largeScreen": "Adds Monarch/Initiative",
                    },
                    "helperText": "+10 points if card can wipe the board"
                },
                "wordyAbilities": {
                    "multiplier": 3,
                    "label": {
                        "equation": "Wordy Abilities",
                        "smallScreen": "Wordy abilities",
                        "largeScreen": "Wordy abilities",
                    },
                    "helperText": "+3 more points for an ability if that ability is 10 words or more."
                },
            }
    }
}
