export const rarityToMultiplier = [
    {label: "Common", value: 1},
    {label: "Uncommon", value: 2},
    {label: "Rare", value: 3},
    {label: "Mythic+", value: 4},
];

export const rarityToLevel = {
    common: 0,
    uncommon: 1,
    rare: 2,
    mythic: 3,
    bonus: 3,
    special: 3,
};

export const cardTypeToManaCostMultiplier = [
    {label: "Instant", value: 3},
    {label: "Sorcery", value: 2},
    {label: "Non-Creature Artifact", value: 5},
    {label: "Non-Creature Enchantment/Battle", value: 4},
    {label: "Non-Basic Land", value: 0},
    {label: "Planeswalker", value: 5},
    {label: "Creature", value: 1},
];

export const bannedOrRestricted = [
    "Ali from Cairo",
    "Ancestral Recall",
    "Berserk",
    "Black Lotus",
    "Braingeyser",
    "Dingus Egg",
    "Gauntlet of Might",
    "Icy Manipulator",
    "Mox Emerald",
    "Mox Jet",
    "Mox Pearl",
    "Mox Ruby",
    "Mox Sapphire",
    "Orcish Oriflamme",
    "Rukh Egg",
    "Sol Ring",
    "Timetwister",
    "Time Vault",
    "Time Walk",
    "Shahrazad",
    "Channel",
    "Copy Artifact",
    "Demonic Tutor",
    "Regrowth",
    "Wheel of Fortune",
    "Candelabra of Tawnos",
    "Feldon's Cane",
    "Ivory Tower",
    "Library of Alexandria",
    "Mishra's Workshop",
    "Chaos Orb",
    "Falling Star",
    "Mind Twist",
    "Mirror Universe",
    "Recall",
    "Sword of the Ages",
    "Underworld Dreams",
    "Divine Intervention",
    "Maze of Ith",
    "Balance",
    "Fork",
    "Zuran Orb",
    "Black Vise",
    "Land Tax",
    "Hymn to Tourach",
    "Strip Mine",
    "Fastbond",
    "Thawing Glaciers",
    "Serendib Efreet",
    "Juggernaut",
    "Kird Ape",
    "Mana Crypt",
    "Squandered Resources",
    "Hypnotic Specter",
    "Cursed Scroll",
    "Tolarian Academy",
    "Windfall",
    "Stroke of Genius",
    "Dream Halls",
    "Earthcraft",
    "Fluctuator",
    "Lotus Petal",
    "Recurring Nightmare",
    "Time Spiral",
    "Memory Jar",
    "Mind Over Matter",
    "Gaea's Cradle",
    "Serra's Sanctum",
    "Voltaic Key",
    "Yawgmoth's Bargain",
    "Yawgmoth's Will",
    "Crop Rotation",
    "Doomsday",
    "Enlightened Tutor",
    "Frantic Search",
    "Grim Monolith",
    "Hurkyl's Recall",
    "Mana Vault",
    "Mox Diamond",
    "Mystical Tutor",
    "Tinker",
    "Vampiric Tutor",
    "Dark Ritual",
    "Lin Sivvi, Defiant Hero",
    "Rishadan Port",
    "Demonic Consultation",
    "Necropotence",
    "Replenish",
    "Survival of the Fittest",
    "Fact or Fiction",
    "Test of Endurance",
    "Entomb",
    "Burning Wish",
    "Cunning Wish",
    "Death Wish",
    "Golden Wish",
    "Living Wish",
    "Ring of Ma'ruf",
    "Gush",
    "Mind's Desire",
    "Goblin Lackey",
    "Goblin Recruiter",
    "Hermit Druid",
    "Ancient Tomb",
    "Oath of Druids",
    "Chrome Mox",
    "Lion's Eye Diamond",
    "Skullclamp",
    "Metalworker",
    "Bazaar of Baghdad",
    "Illusionary Mask",
    "Mana Drain",
    "Worldgorger Dragon",
    "Beacon of Immortality",
    "Arcbound Ravager",
    "Disciple of the Vault",
    "Darksteel Citadel",
    "Ancient Den",
    "Great Furnace",
    "Seat of the Synod",
    "Tree of Tales",
    "Vault of Whispers",
    "Trinisphere",
    "Biorhythm",
    "Panoptic Mirror",
    "Sway of the Stars",
    "Upheaval",
    "Aether Vial",
    "Imperial Seal",
    "Personal Tutor",
    "Erayo, Soratami Ascendant",
    "Crucible of Worlds",
    "Heartless Hidetsugu",
    "Kaervek the Merciless",
    "Niv-Mizzet, the Firemind",
    "Coalition Victory",
    "Rofellos, Llanowar Emissary",
    "Flash",
    "Gifts Ungiven",
    "Kokusho, the Evening Star",
    "Limited Resources",
    "Brainstorm",
    "Merchant Scroll",
    "Ponder",
    "Grindstone",
    "Karakas",
    "Protean Hulk",
    "Riftsweeper",
    "Sensei's Divining Top",
    "Cranial Plating",
    "Braids, Cabal Minion",
    "Thirst for Knowledge",
    "Painter's Servant",
    "Staff of Domination",
    "Sword of the Meek",
    "Hypergenesis",
    "Emrakul, the Aeons Torn",
    "Jace, the Mind Sculptor",
    "Stoneforge Mystic",
    "Ancestral Vision",
    "Ancient Den,",
    "Bitterblossom",
    "Dark Depths",
    "Dread Return",
    "Glimpse of Nature",
    "Golgari Grave-Troll",
    "Mental Misstep",
    "Umezawa's Jitte",
    "Valakut, the Molten Pinnacle",
    "Preordain",
    "Blazing Shoal",
    "Cloudpost",
    "Green Sun's Zenith",
    "Rite of Flame",
    "Punishing Fire",
    "Wild Nacatl",
    "Intangible Virtue",
    "Lingering Souls",
    "Griselbrand",
    "Sundering Titan",
    "Primeval Titan",
    "Worldfire",
    "Bloodbraid Elf",
    "Seething Song",
    "Empty the Warrens",
    "Grapeshot",
    "Invigorate",
    "Trade Secrets",
    "Second Sunrise",
    "Temporal Fissure",
    "Sylvan Primordial",
    "Deathrite Shaman",
    "Dig Through Time",
    "Treasure Cruise",
    "Birthing Pod",
    "Chalice of the Void",
    "Prophet of Kruphix",
    "Splinter Twin",
    "Summer Bloom",
    "Cloud of Faeries",
    "Eye of Ugin",
    "Lodestone Golem",
    "Peregrine Drake",
    "Emrakul, the Promised End",
    "Smuggler's Copter",
    "Reflector Mage",
    "Gitaxian Probe",
    "Felidar Guardian",
    "Leovold, Emissary of Trest",
    "Aetherworks Marvel",
    "Thorn of Amethyst",
    "Monastery Mentor",
    "Ashnod's Coupon",
    "Double Cross",
    "Double Deal",
    "Double Dip",
    "Double Play",
    "Double Take",
    "Enter the Dungeon",
    "Magical Hacker",
    "Mox Lotus",
    "Once More With Feeling",
    "R&D's Secret Lair",
    "Richard Garfield, Ph.D.",
    "Staying Power",
    "Time Machine",
    "Attune with Aether",
    "Rogue Refiner",
    "Ramunap Ruins",
    "Rampaging Ferocidon",
    "Baral, Chief of Compliance",
    "Sorcerous Spyglass",
    "Krark-Clan Ironworks",
    "Nexus of Fate",
    "Daze",
    "High Tide",
    "Sinkhole",
    "Bridge from Below",
    "Iona, Shield of Emeria",
    "Paradox Engine",
    "Hogaak, Arisen Necropolis",
    "Faithless Looting",
    "Karn, the Great Creator",
    "Mystic Forge",
    "Field of the Dead",
    "Arcum's Astrolabe",
    "Bloodstained Mire",
    "Flooded Strand",
    "Polluted Delta",
    "Windswept Heath",
    "Wooded Foothills",
    "Leyline of Abundance",
    "Oath of Nissa",
    "Veil of Summer",
    "Oko, Thief of Crowns",
    "Once Upon a Time",
    "Wrenn and Six",
    "Narset, Parter of Veils",
    "Mox Opal",
    "Mycosynth Lattice",
    "Golos, Tireless Pilgrim",
    "Underworld Breach",
    "Lutri, the Spellchaser",
    "Drannith Magistrate",
    "Winota, Joiner of Forces",
    "Lurrus of the Dream-Den",
    "Zirda, the Dawnwaker",
    "Agent of Treachery",
    "Fires of Invention",
    "Burning-Tree Emissary",
    "Expedition Map",
    "Mystic Sanctuary",
    "Cauldron Familiar",
    "Growth Spiral",
    "Teferi, Time Raveler",
    " Wilderness Reclamation",
    "Runed Halo",
    "Teferi, Time Raveler ",
    "Wilderness Reclamation",
    "Gideon's Intervention",
    "Inverter of Truth",
    "Kethis, the Hidden Hand",
    "Walking Ballista",
    "Uro, Titan of Nature's Wrath",
    "Omnath, Locus of Creation",
    "Lucky Clover",
    "Escape to the Wilds",
    "Fall from Favor",
    "Balustrade Spy",
    "Undercity Informer",
    "Simian Spirit Guide",
    "Tibalt's Trickery",
    "Dreadhorde Arcanist",
    "Counterspell",
    "Lightning Bolt",
    "Natural Order",
    "Swords to Plowshares",
    "Tainted Pact",
    "Thassa's Oracle",
    "Time Warp",
    "Hullbreacher",
    "The Book of Exalted Deeds",
    "Chatterstorm",
    "Sojourner's Companion",
    "Pithing Needle",
    "Memory Lapse",
    "Ugin, the Spirit Dragon",
    "Atog",
    "Bonder's Ornament",
    "Prophetic Prism",
    "Alrund's Epiphany",
    "Divide by Zero",
    "Faceless Haven",
    "Ragavan, Nimble Pilferer",
    "A-Teferi, Time Raveler",
    "A-Fires of Invention",
    "Galvanic Relay",
    "Expressive Iteration",
    "Grinning Ignus",
    "A-Winota, Joiner of Forces",
    "Aarakocra Sneak",
    "Stirring Bard",
    "Underdark Explorer",
    "Vicious Battlerager",
    "The Meathook Massacre",
    "Yorion, Sky Nomad",
    "Mishra's Bauble",
    "Phyrexian Revoker",
    "White Plume Adventurer",
    "Ad Nauseam",
    "Expropriate",
    "Jeweled Lotus",
    "Mana Geyser",
    "Primal Surge",
    "Saheeli, the Gifted",
    "Tooth and Nail",
    "Fable of the Mirror-Breaker",
    "Invoke Despair",
    "Reckoner Bankbuster ",
    "Reflection of Kiki-Jiki",
    "Blood Moon",
    "Intruder Alarm",
    "Sneak Attack",
    "Spreading Seas",
    "Geological Appraiser",
    "Fury",
    "Up the Beanstalk",
    "Monastery Swiftspear",
    "Show and Tell",
    "Violent Outburst",
    "Commandeer",
    "Force of Vigor",
    "Reanimate",
    "All That Glitters"
]