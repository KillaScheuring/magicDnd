import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useForm} from "react-hook-form"
import {Box, Typography, Divider, Button, Modal, useTheme, useMediaQuery} from "@mui/material";
import {
    ControlledAutocomplete as Autocomplete,
    ControlledTextField as TextField,
    ControlledToggle as Toggle
} from "./ControlledInput";
import {rarityToMultiplier, cardTypeToManaCostMultiplier, rarityToLevel, bannedOrRestricted} from "./options"
import {Row} from "./FormStyling";

const CardCalculator = () => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))
    const [cardOpen, setCardOpen] = useState(false)
    const [cardImage, setCardImage] = useState(null)
    const [oracleText, setOracleText] = useState("")
    const { control, setValue, watch, getValues, reset, setError } = useForm({
        defaultValues: {
            cardName: "",
            exp: 0,
            convertedManaCost: 0,
            cardType: {label: "Instant", value: 3},
            cardRarity: {label: "Common", value: 1},
            xOrStar: false,
            banned: false,
            after2020: false,
            playersCant: false,
            legendary: false,

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

            // Creature
            power: 0, // Creature power
            toughness: 0, // Creature toughness
            // abilities: 0, // Number of abilities
            // wordyAbilities: 0, // Wordy abilities
            evasionAbilities: 0, // Number of evasion abilities ^(Flying, Shadow, Menace, Trample, etc.)
            protectionAbilities: 0, // Number of protection abilities ^(Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc.)
            stupidAbilities: 0, // Number of inherently stupid abilities ^(Specifically: Annihilator, Infect, Cascade, & Affinity)
            // creaturesRemoved: 0, // Removes another creature?
            manaAbilities: 0, // Has a mana ability?
            // monarchOrInit: false, // Adds Monarch or Initiative?
            searchesLibrary: false, // Triggers a search of a library?
        },
    })

    const updateCardType = (typeLine) => {
        if (typeLine.includes("Creature")) {
            setValue("cardType", cardTypeToManaCostMultiplier[6])
        }
        else if (typeLine.includes("Instant")) {
            setValue("cardType", cardTypeToManaCostMultiplier[0])
        }
        else if (typeLine.includes("Sorcery")) {
            setValue("cardType", cardTypeToManaCostMultiplier[1])
        }
        else if (typeLine.includes("Artifact")) {
            setValue("cardType", cardTypeToManaCostMultiplier[2])
        }
        else if (typeLine.includes("Enchantment") || typeLine.includes("Battle")) {
            setValue("cardType", cardTypeToManaCostMultiplier[3])
        }
        else if (typeLine.includes("Land")) {
            setValue("cardType", cardTypeToManaCostMultiplier[4])
        }
        else if (typeLine.includes("Planeswalker")) {
            setValue("cardType", cardTypeToManaCostMultiplier[5])
        }
    }

    const updateRarityAndPrinting = (printsSearchUri) => {
        axios.get(printsSearchUri)
            .then(({data}) => {
                let rarity = 0
                let firstPrinting = 2020
                data?.data.forEach(printing => {
                    rarity = Math.max(rarity, rarityToLevel[printing.rarity] || 0)
                    firstPrinting = Math.min(firstPrinting, Number(printing.released_at.split("-")[0]))
                })
                setValue("cardRarity", rarityToMultiplier[rarity])
                setValue("after2020", firstPrinting >= 2020)
            }, rej => {
                console.log("rej", rej)
            })
    }

    const handleSearch = () => {
        axios.get("https://api.scryfall.com/cards/named", {params: {fuzzy: getValues("cardName").toLowerCase().replace(/  +/g, "+")}})
            // Handle the response from backend here
            .then(({data}) => {

                setCardImage(data?.image_uris?.normal)
                setOracleText(data?.oracle_text)

                reset();
                let estimatedAbilities = 0;
                let estimatedWordyAbilities = 0;

                (data?.oracle_text || "").split("\n").forEach(ability => {
                    estimatedAbilities ++
                    console.log("ability", ability.replace(/ \(.*\)/g, "").split(" ").length)
                    estimatedWordyAbilities += ability.replace(/ \(.*\)/g, "").replace(data?.name, "Name").split(" ").length >= 10 ? 1 : 0
                })

                if (estimatedAbilities > 0) {
                    setError("abilities", {message: `Estimate ${estimatedAbilities}`})
                }

                if (estimatedWordyAbilities > 0) {
                    setError("wordyAbilities", {message: `Estimate ${estimatedWordyAbilities}`})
                }

                setValue("cardName", data?.name)
                setValue("convertedManaCost", data?.cmc)
                updateCardType(data?.type_line)
                updateRarityAndPrinting(data?.prints_search_uri)
                setValue("legendary", data?.type_line.includes("Legendary"))
                setValue("banned", bannedOrRestricted.includes(data?.name))
                setValue("xOrStar", data?.power === "*" || data?.toughness === "*" || data?.mana_cost.includes("{X}"))
                setValue("power", data?.power && data?.power !== "*" ? data?.power : 0)
                setValue("toughness", data?.toughness && data?.toughness !== "*" ? data?.toughness : 0)
            }, rej => {
                console.log("rej", rej)
            })
    }
    const {
        convertedManaCost,
        cardType,
        cardRarity,
        xOrStar,
        banned,
        after2020,
        playersCant,
        legendary,

        // Instant/Sorcery
        damage, // Damage/life lost to opponent
        life, // Life gained
        cardsDrawn, // Cards drawn
        cardsLookedAt, // Cards looked at and not drawn
        creaturesRemoved, // Creatures destroyed or removed
        extraTurns, // Extra turns added
        tutorsTop, // Tutors to the top of library?
        tutorsBoard, // Tutors to the hand or board?
        countersSpell, // Counters a spell?
        landRemoved, // Destroys or removes a land?
        cardsDiscarded, // Cards opponent discards
        storm, // Has storm?
        cascade, // Has cascade?
        monarchOrInit, // Adds Monarch or Initiative?
        boardWipe, // Can wipe the board?
        wordyAbilities, // Wordy abilities

        // Non-Creature Artifacts
        nonManaAbilities, // Non-Mana Abilities
        // wordyAbilities, // Wordy abilities
        addedMana, // Amount of mana added

        // Non-Creature Enchantment/Battle
        abilities, // Number of abilities
        // wordyAbilities, // Wordy abilities
        beginsInPlay, // Can begin in play?
        controlPermanent, // Can gain control of a permanent?
        pacify, // Can pacify, arrest, or exile?

        // Non-Basic Land
        colorsProducedOrFetched, // Number of colors produced or lands fetched
        landType, // Number of basic land types
        subType, // Has a land subtype?
        manLand, // Can make or become a creature?
        // nonManaAbilities, // Non-Mana Abilities ^(Not including coming into play tapped or untapped)
        untapped, // Comes in untapped?
        // addedMana, // Amount of mana added in a turn

        // Planeswalker
        loyalty, // Starting loyalty
        plusAbilities, // Number of plus abilities
        minusAbilities, // Number of minus abilities
        staticAbilities, // Number of static abilities

        // Creature
        power, // Creature power
        toughness, // Creature toughness
        // abilities, // Number of abilities
        // wordyAbilities, // Wordy abilities
        evasionAbilities, // Number of evasion abilities ^(Flying, Shadow, Menace, Trample, etc.)
        protectionAbilities, // Number of protection abilities ^(Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc.)
        stupidAbilities, // Number of inherently stupid abilities ^(Specifically: Annihilator, Infect, Cascade, & Affinity)
        creatureRemoved, // Removes another creature?
        // monarchOrInit, // Adds Monarch or Initiative?
        searchesLibrary, // Triggers a search of a library?
        manaAbility, // Has a mana ability?
    } = watch()

    // useEffect(() => {
    //     console.log("cardRarity", cardRarity)
    // }, [cardRarity])

    useEffect(() => {
        let expCost = convertedManaCost * cardType?.value
        switch (cardType?.label) {
            case "Non-Creature Artifact":
                expCost += nonManaAbilities * 2
                expCost += wordyAbilities * 4
                expCost += addedMana * 5
                break
            case "Non-Creature Enchantment/Battle":
                expCost += abilities * 2
                expCost += wordyAbilities * 4
                expCost += beginsInPlay ? 5 : 0
                expCost += controlPermanent ? 9 : 0
                expCost += pacify ? 8 : 0
                break
            case "Non-Basic Land":
                expCost += colorsProducedOrFetched * 3
                expCost += landType ? 5 : 0
                expCost += subType ? 5 : 0
                expCost += manLand ? 5 : 0
                expCost += nonManaAbilities * 3
                expCost += untapped ? 4 : 0
                if (addedMana >= 4){
                    expCost += 5 + 7 + 9
                }
                else if (addedMana === 3) {
                    expCost += 5 + 7
                }
                else if (addedMana === 2) {
                    expCost += 5
                }
                break
            case "Planeswalker":
                expCost += loyalty * 3
                expCost += plusAbilities * 3
                expCost += minusAbilities * 1
                expCost += staticAbilities * 3
                break
            case "Creature":
                expCost += power > convertedManaCost ? power - convertedManaCost : 0
                expCost += toughness > convertedManaCost ? toughness - convertedManaCost : 0
                expCost += abilities * 1
                expCost += wordyAbilities * 3
                expCost += evasionAbilities * 2
                expCost += protectionAbilities * 2
                expCost += stupidAbilities * 5

                expCost += creatureRemoved ? 7 : 0
                expCost += monarchOrInit ? 10 : 0
                expCost += searchesLibrary ? 5 : 0
                expCost += manaAbility ? 5 : 0

                break
            default:
                expCost += damage * 2
                expCost += life * 1
                expCost += cardsDrawn * 3
                expCost += cardsLookedAt * 1
                expCost += creaturesRemoved * 8
                expCost += extraTurns * 20
                expCost += tutorsTop ? 9 : 0
                expCost += tutorsBoard ? 11 : 0
                expCost += countersSpell ? 9 : 0
                expCost += landRemoved ? 7 : 0
                expCost += cardsDiscarded * 3
                expCost += storm ? 8 : 0
                expCost += cascade ? 5 : 0
                expCost += monarchOrInit ? 10 : 0
                expCost += boardWipe ? 10 : 0
                expCost += wordyAbilities * 3
                break
        }
        expCost += xOrStar ? 4 : 0
        expCost += playersCant ? 5 : 0
        expCost += legendary ? 3 : 0
        expCost += banned ? 6 : 0
        expCost += after2020 ? 5 : 0
        expCost *= cardRarity?.value
        setValue("exp", expCost)
    }, [convertedManaCost, cardType, cardRarity, xOrStar, banned, after2020, playersCant, legendary, damage, life, cardsDrawn, cardsLookedAt, creaturesRemoved, extraTurns, tutorsTop, tutorsBoard, countersSpell, landRemoved, cardsDiscarded, storm, cascade, monarchOrInit, boardWipe, wordyAbilities, nonManaAbilities, addedMana, abilities, beginsInPlay, controlPermanent, pacify, colorsProducedOrFetched, landType, subType, manLand, untapped, loyalty, plusAbilities, minusAbilities, staticAbilities, power, toughness, evasionAbilities, protectionAbilities, stupidAbilities, creatureRemoved, searchesLibrary, manaAbility, setValue])

    return (
        <div className={`row ${smallDisplay ? "m-1" : "m-2"}`}>
            <Box component="form" autoComplete="off" className={`w-${smallDisplay ? 90 : 50}`}>
                <Typography variant={"h4"}>Card Calculator</Typography>
                {smallDisplay ? (
                    <>
                        <Row>
                            <TextField name={"cardName"} label={"Card Name"}
                                       control={control}
                            />
                        </Row>
                        <Row>
                            <TextField name={"exp"} label={"EXP"}
                                       type={"number"} control={control}
                            />
                            <Button variant={"contained"} className={"mt-5 mb-4"} onClick={handleSearch}>Search</Button>
                        </Row>
                    </>
                ): (
                    <Row>
                        <TextField name={"cardName"} label={"Card Name"}
                                   control={control}
                        />
                        <Button variant={"contained"} className={"mt-5 mb-4"} onClick={handleSearch}>Search</Button>
                        <TextField name={"exp"} label={"EXP"}
                                   type={"number"} control={control}
                        />
                    </Row>
                )}
                <Row>
                    <TextField name={"convertedManaCost"} label={smallDisplay ? "CMC" : "Converted Mana Cost"}
                               type={"number"} control={control}
                    />
                    <Autocomplete name={"cardType"} label={"Card Type"}
                                  options={cardTypeToManaCostMultiplier} control={control}
                    />
                    <Autocomplete name={"cardRarity"} label={"Rarity"}
                                  options={rarityToMultiplier} control={control}
                    />
                </Row>

                {smallDisplay ? (
                    <>
                        <Row>
                            <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                            <Toggle name={"xOrStar"} control={control} label={"X or ★"}/>
                            <Toggle name={"after2020"} control={control} label={"2020"}/>
                        </Row>
                        <Row>
                            <Toggle name={"banned"} control={control} label={"Banned"}/>

                            <Toggle name={"playersCant"} control={control} label={"Players can't"}/>
                        </Row>
                    </>
                ) : (
                    <Row>
                        <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                        <Toggle name={"xOrStar"} control={control} label={"X or ★"}/>
                        <Toggle name={"banned"} control={control} label={"Banned/Restricted"}/>
                        <Toggle name={"after2020"} control={control} label={"2020 or later"}/>
                        <Toggle name={"playersCant"} control={control} label={"Players/Opponents can't"}/>
                    </Row>
                )}
                {
                    ["Instant", "Sorcery"].includes(getValues("cardType")?.label) &&
                    (<>
                        <Typography variant={"h5"}>Instant/Sorcery</Typography>
                        <Row><Divider/></Row>
                        {smallDisplay ? (
                            <>
                                <Row>
                                    <TextField name={"damage"} label={"Damage"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"life"} label={"Life gained"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"creaturesRemoved"} label={"Creatures killed"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"cardsDrawn"} label={"Cards drawn"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>

                                    <TextField name={"cardsDiscarded"} label={"Cards opponent discards"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"cardsLookedAt"} label={"Cards looked at and not drawn"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"extraTurns"} label={"Extra turns added"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"tutorsTop"} label={"To top"} control={control}/>
                                    <Toggle name={"tutorsBoard"} label={"To hand/board"} control={control}/>
                                </Row>
                                <Row>
                                    <Toggle name={"storm"} label={"Storm"} control={control}/>
                                    <Toggle name={"cascade"} label={"Cascade"} control={control}/>
                                    <Toggle name={"boardWipe"} label={"Board wipe"} control={control} />
                                </Row>
                                <Row>
                                    <Toggle name={"monarchOrInit"} label={"Adds Monarch/Initiative"} control={control}/>
                                </Row>
                                <Row>
                                    <Toggle name={"countersSpell"} label={"Counters spells"} control={control}/>
                                    <Toggle name={"landRemoved"} label={"Destroys/removes land"} control={control}/>
                                </Row>
                            </>
                        ): (
                            <>
                                <Row>
                                    <TextField name={"damage"} label={"Damage/life lost to opponent"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"life"} label={"Life gained"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"creaturesRemoved"} label={"Creatures destroyed or removed"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"cardsDrawn"} label={"Cards drawn"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"cardsDiscarded"} label={"Cards opponent discards"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"cardsLookedAt"} label={"Cards looked at and not drawn"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"extraTurns"} label={"Extra turns added"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"tutorsTop"} label={"Tutors to top"} control={control}/>
                                    <Toggle name={"tutorsBoard"} label={"Tutors to hand/board"} control={control}/>
                                    <Toggle name={"countersSpell"} label={"Counters spells"} control={control}/>
                                    <Toggle name={"landRemoved"} label={"Destroys/removes land"} control={control}/>
                                </Row>
                                <Row>
                                    <Toggle name={"storm"} label={"Storm"} control={control}/>
                                    <Toggle name={"cascade"} label={"Cascade"} control={control}/>
                                    <Toggle name={"monarchOrInit"} label={"Adds Monarch/Initiative"} control={control}/>
                                    <Toggle name={"boardWipe"} label={"Board wipe"} control={control} />
                                </Row>
                            </>
                        )}
                    </>)
                }
                {
                    !["Instant", "Sorcery"].includes(getValues("cardType")?.label) &&
                    <><Typography variant={"h5"}>{getValues("cardType")?.label}</Typography><Row><Divider/></Row></>
                }
                {
                    getValues("cardType")?.label === "Non-Creature Artifact" &&
                    (<>
                        {smallDisplay ? (
                            <Row>
                                <TextField name={"nonManaAbilities"} label={"Non-mana abilities"}
                                           type={"number"} control={control}
                                />
                                <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                           type={"number"} control={control}
                                />
                                <TextField name={"addedMana"} label={"Mana added in a turn"}
                                           type={"number"} control={control}
                                />
                            </Row>
                        ): (
                            <Row>
                                <TextField name={"nonManaAbilities"} label={"Number of non-mana abilities"}
                                           type={"number"} control={control}
                                />
                                <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                           type={"number"} control={control}
                                />
                                <TextField name={"addedMana"} label={"Amount of mana added in a turn"}
                                           type={"number"} control={control}
                                />
                            </Row>
                        )}
                    </>)
                }
                {
                    getValues("cardType")?.label === "Non-Creature Enchantment/Battle" &&
                    (<>
                        {smallDisplay ? (
                            <>
                                <Row>
                                    <TextField name={"abilities"} label={"Number of abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"beginsInPlay"} label={"Begins in play"} control={control}/>
                                    <Toggle name={"controlPermanent"} label={"Control a permanent"} control={control}/>
                                </Row>
                                <Row>
                                    <Toggle name={"pacify"} label={"pacify/arrest/exile"} control={control}/>
                                </Row>
                            </>
                        ): (
                            <>
                                <Row>
                                    <TextField name={"abilities"} label={"Number of abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"beginsInPlay"} label={"Begins in play"} control={control}/>
                                    <Toggle name={"controlPermanent"} label={"Control a permanent"} control={control}/>
                                    <Toggle name={"pacify"} label={"pacify/arrest/exile"} control={control}/>
                                </Row>
                            </>
                        )}
                    </>)
                }
                {
                    getValues("cardType")?.label === "Non-Basic Land" &&
                    (<>
                        {smallDisplay ? (
                            <>
                                <Row>
                                    <TextField name={"nonManaAbilities"} label={"Non-Mana Abilities"}
                                               helperText={"Not including coming into play tapped or untapped"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"addedMana"} label={"Mana added in a turn"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"colorsProducedOrFetched"} label={"Colors/lands added"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"landType"} label={"Basic land type"} control={control}/>
                                    <Toggle name={"subType"} label={"Subtype"} control={control}/>
                                </Row>
                                <Row>
                                    <Toggle name={"manLand"} label={"Make/become creature"} control={control}/>
                                    <Toggle name={"untapped"} label={"Untapped"} control={control}/>
                                </Row>
                            </>
                        ): (
                            <>
                                <Row>
                                    <TextField name={"nonManaAbilities"} label={"Non-Mana Abilities"}
                                               helperText={"Not including coming into play tapped or untapped"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"addedMana"} label={"Amount of mana added in a turn"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"colorsProducedOrFetched"} label={"Number of colors produced or lands fetched"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"landType"} label={"Basic land type"} control={control}/>
                                    <Toggle name={"subType"} label={"Subtype"} control={control}/>
                                    <Toggle name={"manLand"} label={"Make/become creature"} control={control}/>
                                    <Toggle name={"untapped"} label={"Untapped"} control={control}/>
                                </Row>
                            </>
                        )}
                    </>)
                }
                {
                    getValues("cardType")?.label === "Planeswalker" &&
                    (<>
                        {smallDisplay ? (
                            <>
                                <Row>
                                    <TextField name={"loyalty"} label={"Starting loyalty"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"plusAbilities"} label={"Plus (or 0) abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"minusAbilities"} label={"Minus abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"staticAbilities"} label={"Static abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                            </>
                        ): (
                            <>
                                <Row>
                                    <TextField name={"loyalty"} label={"Starting loyalty"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"plusAbilities"} label={"Number of plus (or 0) abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"minusAbilities"} label={"Number of minus abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"staticAbilities"} label={"Number of static abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                            </>
                        )}

                    </>)
                }
                {
                    getValues("cardType")?.label === "Creature" &&
                    (<>
                        {smallDisplay ? (
                            <>
                                <Row>
                                    <TextField name={"power"} label={"Creature power"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"toughness"} label={"Creature toughness"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"abilities"} label={"Number of abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"evasionAbilities"} label={"Evasion abilities"}
                                               helperText={"Flying, Shadow, Menace, Trample, etc."}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"protectionAbilities"} label={"Protection abilities"}
                                               helperText={"Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc."}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"stupidAbilities"} label={"Stupid abilities"}
                                               helperText={"Specifically: Annihilator, Infect, Cascade, & Affinity"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"creaturesRemoved"} label={"Creatures killed"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"manaAbilities"} label={"Mana abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"monarchOrInit"} label={"Monarch/Initiative"} control={control}/>
                                    <Toggle name={"searchesLibrary"} label={"Searches library"} control={control}/>
                                </Row>
                            </>
                        ): (
                            <>
                                <Row>
                                    <TextField name={"power"} label={"Creature power"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"toughness"} label={"Creature toughness"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"abilities"} label={"Number of abilities"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"wordyAbilities"} label={"Wordy abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"evasionAbilities"} label={"Number of evasion abilities"}
                                               helperText={"Flying, Shadow, Menace, Trample, etc."}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"protectionAbilities"} label={"Number of protection abilities"}
                                               helperText={"Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc."}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"stupidAbilities"} label={"Number of stupid abilities"}
                                               helperText={"Specifically: Annihilator, Infect, Cascade, & Affinity"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <TextField name={"creaturesRemoved"} label={"Number of creatures destroyed or removed"}
                                               type={"number"} control={control}
                                    />
                                    <TextField name={"manaAbilities"} label={"Number of mana abilities"}
                                               type={"number"} control={control}
                                    />
                                </Row>
                                <Row>
                                    <Toggle name={"monarchOrInit"} label={"Monarch/Initiative"} control={control}/>
                                    <Toggle name={"searchesLibrary"} label={"Searches library"} control={control}/>
                                </Row>
                            </>
                        )}
                    </>)
                }
            </Box>
            {cardImage && smallDisplay && !cardOpen && (
                <img
                    src={cardImage}
                    alt={watch().cardName}
                    style={{
                        zIndex: 10, position: "fixed", right: -20, top: -70,
                        paddingTop: 90, width: 150,
                        clipPath: "circle(10%)"
                    }}
                    onClick={() => setCardOpen(true)}
                />
            )}
            {cardImage && smallDisplay && (
                <Modal open={cardOpen} onClose={() => setCardOpen(false)}>
                    <Box className={"bg-white d-flex gap-2"}>
                        <Box className={"w-50"}>
                            <img
                                src={cardImage}
                                alt={watch().cardName}
                                loading="lazy"
                                width={"auto"}
                                style={{maxWidth: "100%"}}
                            />
                            <Button className={"mt-2"} variant={"contained"} onClick={() => setCardOpen(false)}>Back</Button>
                        </Box>
                        <Box className={"w-50"}>
                            <Typography>{oracleText.split("\n").map(line => (<>{line}<br/><br/></>))}</Typography>
                        </Box>
                    </Box>
                </Modal>
            )}
            {cardImage && !smallDisplay && (
                <>
                    <Box className={"w-25"}>
                        <img
                            src={cardImage}
                            alt={watch().cardName}
                            loading="lazy"
                            width={"auto"}
                            style={{maxWidth: "100%"}}
                        />
                    </Box>
                    <Box className={"w-25"}>
                        <Typography variant={"h4"}>Oracle Text</Typography>
                        <Typography>{oracleText.split("\n").map(line => (<>{line}<br/><br/></>))}</Typography>
                    </Box>
                </>
            )}
        </div>
    );
};

export default CardCalculator;
