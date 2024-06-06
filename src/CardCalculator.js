import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useForm} from "react-hook-form"
import {Autocomplete as MuiAutocomplete, TextField as MuiTextField, Box, Typography, Divider, Button, Modal, useTheme, useMediaQuery, Tabs, Tab, styled} from "@mui/material";
import {
    ControlledAutocomplete as Autocomplete,
    ControlledTextField as TextField,
    ControlledToggle as Toggle,
    SearchAutocomplete
} from "./ControlledInput";
import {rarityToMultiplier, cardTypeToManaCostMultiplier, rarityToLevel, bannedOrRestricted} from "./options"
import {Row} from "./FormStyling";
import CardFaceForm, {Variable} from "./CardFaceForm";
import {SmallScreen, LargeScreen} from "./Breakpoints";

const OracleText = ({oracleText}) => {
    return (
        <>
            <Typography variant={"h4"}>Oracle Text</Typography>
            <Typography>{oracleText.split("\n").map(line => (<>{line}<br/><br/></>))}</Typography>
        </>
    )
}

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'none',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    '& .MuiTabs-indicatorSpan': {
        display: 'none',
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#ffffff',
    },
    '& .MuiTabs-flexContainer': {
    },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        // color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#fff',
            backgroundColor: theme.palette.primary.dark,
            borderRadius: "0% 20% 0% 20%"
        },
        // '&.Mui-focusVisible': {
        //     backgroundColor: 'rgba(100, 95, 228, 0.32)',
        // },
    }),
);

const PrintingsTabs = ({visible, value, onChange}) => {
    return (
        <div className={`${visible ? "" : "invisible"}`}>
            <StyledTabs
                orientation={"vertical"}
                value={value}
                onChange={(e, value) => onChange(value)}
            >
                <StyledTab label={"Lowest Rarity"} value={"lowestRarity"}/>
                <StyledTab label={"Highest Rarity"} value={"highestRarity"}/>
                <StyledTab label={"First Printing"} value={"firstPrinting"}/>
            </StyledTabs>
        </div>
    )
}

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
    const [displayedPrinting, setDisplayedPrinting] = useState("highestRarity")
    const [printings, setPrintings] = useState({
        lowestRarity: [],
        highestRarity: [],
        firstPrinting: []
    })
    const [oracleText, setOracleText] = useState("")

    const [previousSearches, setPreviousSearches] = useState([])
    const [cardNameSuggestions, setCardNameSuggestions] = useState([])

    const { control, setValue, watch, getValues, reset, setError, handleSubmit } = useForm({
        defaultValues: {
            cardName: "",
            exp: 0,
            cardRarity: {label: "Common", value: 1},
            banned: false,
            after2020: false,
        },
    })

    const multiplePrintings = !(printings.firstPrinting[0] === printings.lowestRarity[0] && printings.firstPrinting[0] === printings.highestRarity[0])

    const { cardRarity, banned, after2020, cardName } = watch()

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

    useEffect(() => {
        if (cardName) handleSearch(null)
    }, [cardName])

    const getCardNameSuggestions = (event, cardInput, reason) => {
        if (cardInput === "") setCardNameSuggestions([...previousSearches])
        if (cardInput.length < 3) return
        console.log("cardInput", cardInput)
        axios.get("https://api.scryfall.com/cards/autocomplete", {params: {q: cardInput}})
            .then(({data: {data}}) => {
                setCardNameSuggestions(data.slice(0, 5))
            }, rej => {

            })
    }

    const getCardImageFromData = data => {
        const cardFacesData = data?.card_faces ? data?.card_faces : [data]
        return data?.image_uris?.normal ? [data?.image_uris?.normal] : cardFacesData.map(face => face?.image_uris?.normal)
    }

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
                let lowestRarity = [10, 0]
                let highestRarity = [0, 0]
                let firstPrinting = [9999, 0]
                data?.data.forEach((printing, printingIndex) => {
                    if (highestRarity[0] < (rarityToLevel[printing.rarity] || 0)) {
                        highestRarity = [rarityToLevel[printing.rarity], printingIndex]
                    }
                    if (lowestRarity[0] > (rarityToLevel[printing.rarity] || 0)) {
                        lowestRarity = [rarityToLevel[printing.rarity], printingIndex]
                    }
                    if (firstPrinting[0] > Number(printing.released_at.split("-")[0])) {
                        firstPrinting = [Number(printing.released_at.split("-")[0]), printingIndex]
                    }
                })
                setPrintings({
                    lowestRarity: getCardImageFromData(data?.data[lowestRarity[1]]),
                    highestRarity: getCardImageFromData(data?.data[highestRarity[1]]),
                    firstPrinting: getCardImageFromData(data?.data[firstPrinting[1]])
                })

                setValue("cardRarity", rarityToMultiplier[highestRarity[0]])
                setValue("after2020", firstPrinting[0] >= 2020)
            }, rej => {
                console.log("rej", rej)
            })
    }

    const handleSearch = e => {
        if (e) e.preventDefault()
        setSearching(true)
        setCardFlipped(false)
        setDisplayedPrinting("highestRarity")
        if (!previousSearches.includes(cardName)) setPreviousSearches([cardName, ...previousSearches].slice(0, 5))
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
                setCardImages(getCardImageFromData(data))
                setValue("banned", bannedOrRestricted.includes(data?.name))
                setSearching(false)
            }, rej => {
                console.log("rej", rej)
            })
    }

    return (
        <div className={`row ${smallDisplay ? "m-1" : "m-2"}`}>
            <Box className={`w-${smallDisplay ? 90 : 50}`} autoComplete="off" onSubmit={handleSearch}>
                <Typography variant={"h4"}>Card Calculator</Typography>
                <SmallScreen>
                    <form className={"d-flex flex-row mb-3 gap-3 w-100"} autoComplete={"off"} onSubmit={handleSearch}>
                        <SearchAutocomplete
                            control={control} name={"cardName"}
                            label={"Card Name"}
                            onInputChange={getCardNameSuggestions}
                            suggestions={cardNameSuggestions}
                        />
                        <Button variant={"contained"} className={"mt-5 mb-4"} type={"submit"}>Search</Button>
                    </form>
                    <Row>
                        <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>
                        <Button variant={"outlined"} className={"mt-5 mb-4"} onClick={() => setMathOpen(prevState => !prevState)}>Math</Button>
                    </Row>
                </SmallScreen>
                <LargeScreen>
                    <Row>
                        <form className={"d-flex flex-row mb-3 gap-3 w-50"} autoComplete={"off"} onSubmit={handleSearch}>
                            <SearchAutocomplete
                                control={control} name={"cardName"}
                                label={"Card Name"}
                                onInputChange={getCardNameSuggestions}
                                suggestions={cardNameSuggestions}
                            />
                            <Button variant={"contained"} className={"mt-5 mb-4"} type={"submit"}>Search</Button>
                        </form>
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
                                    <Toggle name={"after2020"} control={control} label={"Post-2020"}/>
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

            {/*SMALL DISPLAY*/}
            {cardImages.length > 0 && smallDisplay && !cardOpen && (
                <img
                    src={(multiplePrintings ? printings[displayedPrinting] : cardImages)[Number(cardFlipped)]}
                    alt={watch().cardName}
                    style={{
                        zIndex: 10, position: "absolute", right: -20, top: -70,
                        paddingTop: 90, width: 150,
                        clipPath: "circle(10%)"
                    }}
                    onClick={() => setCardOpen(true)}
                />
            )}
            <Modal open={cardOpen} onClose={() => setCardOpen(false)} style={{overflow: "auto"}}>
                <Box className={"bg-white p-2"}>
                    <Row>
                        {cardImages.length > 1 && <Button variant={"outlined"} onClick={() => setCardFlipped(prevState => !prevState)}>Flip</Button>}
                        {cardImages.length > 0 && <Button variant={"contained"} onClick={() => setCardOpen(false)}>Back</Button>}
                    </Row>
                    <Box className={"w-50"}>
                        <div className={"d-flex flex-row"}>
                            <img
                                src={(multiplePrintings ? printings[displayedPrinting] : cardImages)[Number(cardFlipped)]}
                                alt={watch().cardName}
                                loading="lazy"
                                width={"auto"}
                                style={{maxWidth: "100%"}}
                            />
                            <PrintingsTabs visible={multiplePrintings}
                                           value={displayedPrinting}
                                           onChange={setDisplayedPrinting}
                            />
                        </div>

                    </Box>
                    <Box className={"w-100"}>
                        <Typography>{oracleText.split("\n").map(line => (<>{line}<br/><br/></>))}</Typography>
                    </Box>
                </Box>
            </Modal>
            {/*LARGE DISPLAY*/}
            {cardImages.length > 0 && !smallDisplay && !searching && (
                <>
                    <Box className={"w-50"}>
                        <div className={`d-flex flex-row`}>
                            <div className={"w-50"}>
                                <img
                                    src={(multiplePrintings ? printings[displayedPrinting] : cardImages)[Number(cardFlipped)]}
                                    alt={watch().cardName}
                                    loading="lazy"
                                    width={"auto"}
                                    style={{maxWidth: "100%"}}
                                />
                                {cardImages.length > 1 ? <Button onClick={() => setCardFlipped(prevState => !prevState)}>Transform</Button> : null}
                                <OracleText oracleText={oracleText}/>
                            </div>
                            <PrintingsTabs visible={multiplePrintings}
                                           value={displayedPrinting}
                                           onChange={setDisplayedPrinting}
                            />
                        </div>
                    </Box>
                </>
            )}
        </div>
    );
};

export default CardCalculator;
