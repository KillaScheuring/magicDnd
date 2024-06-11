export const getStorage = (key) => {
    return JSON.parse(localStorage.getItem(key) || "{}")
}

export const setStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const colors = ["W", "U", "B", "R", "G", "C"]

export const sortColors = (a, b) => colors.indexOf(a) - colors.indexOf(b)

export const exampleCardData = {
    cardName: "Wurmcoil Engine",
    exp: 48,
    cardRarity: {label: "Common", value: 1},
    banned: false,
    after2020: false,
    faces: [
        {
            cardName: "Wurmcoil Engine",
            color: "Colorless",
            convertedManaCost: 6,
            cardType: {label: "Creature", value: 1},
            legendary: false,
            xOrStar: false,
            playersCant: false,

            // Instant/Sorcery
            damage: 0, // Damage/life lost to opponent
            life: 0, // Life gained
            cardsDrawn: 0, // Cards drawn
            cardsLookedAt: 0, // Cards looked at and not drawn
            creaturesRemoved: 0, // Creatures destroyed or removed
            extraTurns: 0, // Extra turns added
            tutorsTop: false, // Tutors to the top of library?
            tutorsBoard: false, // Tutors to the hand or board?
            countersSpell: false, // Counters a spell?
            landRemoved: false, // Destroys or removes a land?
            cardsDiscarded: 0, // Cards opponent discards
            storm: false, // Has storm?
            cascade: false, // Has cascade?
            monarchOrInit: false, // Adds Monarch or Initiative?
            boardWipe: false, // Can wipe the board?
            wordyAbilities: 0, // Wordy abilities

            // Non-Creature Artifacts
            nonManaAbilities: 0, // Non-Mana Abilities
            // wordyAbilities: 0, // Wordy abilities
            addedMana: 0, // Amount of mana added

            // Non-Creature Enchantment/Battle
            abilities: 0, // Number of abilities
            // wordyAbilities: 0, // Wordy abilities
            beginsInPlay: false, // Can begin in play?
            controlPermanent: false, // Can gain control of a permanent?
            pacify: false, // Can pacify, arrest, or exile?

            // Non-Basic Land
            colorsProducedOrFetched: 0, // Number of colors produced or lands fetched
            landType: false, // Has a basic land type
            subType: false, // Has a land subtype?
            manLand: false, // Can make or become a creature?
            // nonManaAbilities: 0, // Non-Mana Abilities ^(Not including coming into play tapped or untapped)
            untapped: false, // Comes in untapped?
            // addedMana: 0, // Amount of mana added in a turn

            // Planeswalker
            loyalty: 0, // Starting loyalty
            plusAbilities: 0, // Number of plus abilities
            minusAbilities: 0, // Number of minus abilities
            staticAbilities: 0, // Number of static abilities

            // Creatures
            power: 6,
            toughness: 6,
            // abilities: 0, // Number of abilities
            // wordyAbilities: 0, // Wordy abilities
            evasionAbilities: 0, // Number of evasion abilities ^(Flying, Shadow, Menace, Trample, etc.)
            protectionAbilities: 0, // Number of protection abilities ^(Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc.)
            stupidAbilities: 0, // Number of inherently stupid abilities ^(Specifically: Annihilator, Infect, Cascade, & Affinity)
            // creaturesRemoved: 0, // Removes another creature?
            manaAbilities: 0, // Has a mana ability?
            // monarchOrInit: false, // Adds Monarch or Initiative?
            searchesLibrary: false, // Triggers a search of a library?
        }
    ]
}
