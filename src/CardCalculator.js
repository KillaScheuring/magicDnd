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
import CardFaceForm, {Variable} from "./CardFaceForm";
import {SmallScreen, LargeScreen} from "./Breakpoints";

const CardCalculator = () => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))

    const [cardFaceExp, setCardFaceExp] = useState([])
    const [cardMath, setCardMath] = useState([])

    const [searching, setSearching] = useState(true)
    const [cardOpen, setCardOpen] = useState(false)
    const [cardFlipped, setCardFlipped] = useState(false)
    const [mathOpen, setMathOpen] = useState(false)

    const [cardFaces, setCardFaces] = useState([])
    const [cardImages, setCardImages] = useState([])
    const [oracleText, setOracleText] = useState("")

    const { control, setValue, watch, getValues, reset, setError } = useForm({
        defaultValues: {
            cardName: "Questing Beast",
            exp: 0,
            cardRarity: {label: "Common", value: 1},
            banned: false,
            after2020: false,
        },
    })

    const { cardRarity, banned, after2020 } = watch()

    const getCardType = (typeLine) => {
        if (typeLine.includes("Creature")) return cardTypeToManaCostMultiplier[6]

        if (typeLine.includes("Instant")) return cardTypeToManaCostMultiplier[0]

        if (typeLine.includes("Sorcery")) return cardTypeToManaCostMultiplier[1]

        if (typeLine.includes("Artifact")) return cardTypeToManaCostMultiplier[2]

        if (typeLine.includes("Enchantment") || typeLine.includes("Battle")) {
            return cardTypeToManaCostMultiplier[3]
        }

        if (typeLine.includes("Land")) return cardTypeToManaCostMultiplier[4]

        if (typeLine.includes("Planeswalker")) return cardTypeToManaCostMultiplier[5]
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
        setSearching(true)
        setCardFlipped(false)
        axios.get("https://api.scryfall.com/cards/named", {params: {fuzzy: getValues("cardName").toLowerCase().replace(/  +/g, "+")}})
            // Handle the response from backend here
            .then(({data}) => {
                const transformSeparator = "\n----------\n"
                const cardFacesData = data?.card_faces ? data?.card_faces : [data]
                setCardFaces(cardFacesData.map(face => ({
                    cardName: face?.name,
                    oracleText: face?.oracle_text,
                    convertedManaCost: face?.mana_cost?.length > 0 ? face?.cmc || data?.cmc : 0,
                    cardType: getCardType(face?.type_line),
                    legendary: face?.type_line.includes("Legendary"),
                    xOrStar: face?.power === "*" || face?.toughness === "*" || face?.mana_cost.includes("{X}"),
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
                    loyalty: Number(face?.loyalty), // Starting loyalty
                    plusAbilities: 0, // Number of plus abilities
                    minusAbilities: 0, // Number of minus abilities
                    staticAbilities: 0, // Number of static abilities

                    // Creatures
                    power: face?.power && face?.power !== "*" ? Number(face?.power) : 0,
                    toughness: face?.toughness && face?.toughness !== "*" ? face?.toughness : 0,
                    // abilities: 0, // Number of abilities
                    // wordyAbilities: 0, // Wordy abilities
                    evasionAbilities: 0, // Number of evasion abilities ^(Flying, Shadow, Menace, Trample, etc.)
                    protectionAbilities: 0, // Number of protection abilities ^(Protection from X, Hexproof, Shroud, Ward, Regeneration, Indestructible, etc.)
                    stupidAbilities: 0, // Number of inherently stupid abilities ^(Specifically: Annihilator, Infect, Cascade, & Affinity)
                    // creaturesRemoved: 0, // Removes another creature?
                    manaAbilities: 0, // Has a mana ability?
                    // monarchOrInit: false, // Adds Monarch or Initiative?
                    searchesLibrary: false, // Triggers a search of a library?
                })))
                setCardImages(data?.image_uris?.normal ? [data?.image_uris?.normal] : cardFacesData.map(face => face?.image_uris?.normal))
                setCardFaceExp(cardFacesData.map(() => ({exp: 0, math: []})))

                const dataOracleText = cardFacesData.map(face => face?.oracle_text).join(transformSeparator)
                setOracleText(dataOracleText)

                let estimatedAbilities = 0
                let estimatedWordyAbilities = 0

                dataOracleText.replace(transformSeparator, "\n").split("\n").forEach(ability => {
                    estimatedAbilities ++
                    estimatedWordyAbilities += ability.replace(/ \(.*\)/g, "").replace(data?.name, "Name").split(" ").length >= 10 ? 1 : 0
                })

                if (estimatedAbilities > 0) {
                    setError("abilities", {message: `Estimate ${estimatedAbilities}`})
                }

                if (estimatedWordyAbilities > 0) {
                    setError("wordyAbilities", {message: `Estimate ${estimatedWordyAbilities}`})
                }

                setValue("cardName", data?.name)
                updateRarityAndPrinting(data?.prints_search_uri)
                setValue("banned", bannedOrRestricted.includes(data?.name))
                setSearching(false)
            }, rej => {
                console.log("rej", rej)
            })
    }

    useEffect(() => {
        let equation = []
        let expCost = 0
        cardFaceExp.forEach(({exp, equation: math=[]}, index) => {
            expCost += exp
            if (cardFaces[index].cardType.label !== "Non-Basic Land") {
                equation = [...equation, math[0]]
            }
            expCost += banned * 6
            equation.push(<Variable label={"Banned/Restricted"} value={banned} multiplier={6}/>)
            expCost += after2020 * 5
            equation.push(<Variable label={"Post-2020"} value={after2020} multiplier={5}/>)
            if (cardFaces[index].cardType.label !== "Non-Basic Land") {
                equation = [...equation, ...math.slice(1)]
            }
            else {
                equation = [...equation, ...math]
            }
        })

        expCost *= cardRarity?.value
        setCardMath(equation)
        setValue("exp", expCost)
    }, [cardRarity, banned, after2020, setValue, cardFaceExp])

    return (
        <div className={`row ${smallDisplay ? "m-1" : "m-2"}`}>
            <Box component="form" autoComplete="off" className={`w-${smallDisplay ? 90 : 50}`}>
                <Typography variant={"h4"}>Card Calculator</Typography>
                <SmallScreen>
                    <Row>
                        <TextField name={"cardName"} label={"Card Name"} control={control}/>
                        <Button variant={"contained"} className={"mt-5 mb-4"} onClick={handleSearch}>Search</Button>
                    </Row>
                    <Row>
                        <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>
                        <Button variant={"outlined"} className={"mt-5 mb-4"} onClick={() => setMathOpen(prevState => !prevState)}>Math</Button>
                    </Row>
                </SmallScreen>
                <LargeScreen>
                    <Row>
                        <Row className={"w-50"}>
                            <TextField name={"cardName"} label={"Card Name"} control={control}/>
                            <Button variant={"contained"} className={"mt-5 mb-4"} onClick={handleSearch}>Search</Button>
                        </Row>
                        <Row className={"w-50"}>
                            <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>
                            <Button variant={"outlined"} className={"mt-5 mb-4"} onClick={() => setMathOpen(prevState => !prevState)}>Math</Button>
                        </Row>
                    </Row>
                </LargeScreen>
                {mathOpen && (
                    <Row>
                        <span>
                            (<span className={"equation"}>{cardMath}</span>) * <Variable {...cardRarity}/>
                        </span>
                    </Row>
                )}

                {!searching && (
                    <>
                        <SmallScreen>
                            <Row>
                                <Autocomplete name={"cardRarity"} label={"Rarity"}
                                              options={rarityToMultiplier} control={control}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"banned"} control={control} label={"Banned/Restricted"}/>
                                <Toggle name={"after2020"} control={control} label={"2020 or later"}/>
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <div className={"w-50"}>
                                    <Autocomplete name={"cardRarity"} label={"Rarity"} options={rarityToMultiplier}
                                                  control={control}/>
                                </div>
                                <Row className={"w-50 pt-5"}>
                                    <Toggle name={"banned"} control={control} label={"Banned/Restricted"}/>
                                    <Toggle name={"after2020"} control={control} label={"2020 or later"}/>
                                </Row>
                            </Row>
                        </LargeScreen>
                    </>
                )}
                {!searching && cardFaces.map((face, faceIndex) => (
                    <CardFaceForm {...face}
                                  showExp={cardFaceExp.length > 1}
                                  onChange={(faceExp, faceEqu) => setCardFaceExp(prevState => {
                                      prevState[faceIndex] = {exp: faceExp, equation: faceEqu}
                                      return [...prevState]
                                  })}
                    />
                ))}
            </Box>
            {cardImages.length > 0 && smallDisplay && !cardOpen && (
                <img
                    src={cardImages[Number(cardFlipped)]}
                    alt={watch().cardName}
                    style={{
                        zIndex: 10, position: "fixed", right: -20, top: -70,
                        paddingTop: 90, width: 150,
                        clipPath: "circle(10%)"
                    }}
                    onClick={() => setCardOpen(true)}
                />
            )}
            {cardImages.length > 0 && smallDisplay && (
                <Modal open={cardOpen} onClose={() => setCardOpen(false)}>
                    <Box className={"bg-white d-flex gap-2 p-2"}>
                        <Box className={"w-50"}>
                            <Row>
                                <img
                                    src={cardImages[Number(cardFlipped)]}
                                    alt={watch().cardName}
                                    loading="lazy"
                                    width={"auto"}
                                    style={{maxWidth: "100%"}}
                                />
                            </Row>
                            <Row>
                                {cardImages.length > 1 && <Button variant={"outlined"} onClick={() => setCardFlipped(prevState => !prevState)}>Flip</Button>}
                                {cardImages.length > 0 && <Button variant={"contained"} onClick={() => setCardOpen(false)}>Back</Button>}
                            </Row>
                        </Box>
                        <Box className={"w-50"}>
                            <Typography>{oracleText.split("\n").map(line => (<>{line}<br/><br/></>))}</Typography>
                        </Box>
                    </Box>
                </Modal>
            )}
            {cardImages.length > 0 && !smallDisplay && (
                <>
                    <Box className={"w-25"}>
                        <img
                            src={cardImages[Number(cardFlipped)]}
                            alt={watch().cardName}
                            loading="lazy"
                            width={"auto"}
                            style={{maxWidth: "100%"}}
                        />
                        {cardImages.length > 1 ? <Button onClick={() => setCardFlipped(prevState => !prevState)}>Transform</Button> : null}
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
