import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useForm} from "react-hook-form"
import {
    Box,
    Typography,
    Button,
    Modal,
    useTheme,
    useMediaQuery,
    Badge,
} from "@mui/material";
import {
    ControlledAutocomplete as Autocomplete,
    ControlledTextField as TextField,
    ControlledToggle as Toggle,
    SearchAutocomplete
} from "./ControlledInput";
import {
    rarityToMultiplier,
    cardTypeToManaCostMultiplier,
    rarityToLevel,
    bannedOrRestricted,
    modifierToMultiplier
} from "./options"
import {Row} from "./FormStyling";
import CardFaceForm, {formatVariable, Variable} from "./CardFaceForm";
import {SmallScreen, LargeScreen} from "./Breakpoints";
import {getStorage, setStorage, sortColors} from "./utils";
import CardBuyList from "./CardBuyList";
import PrintingsTabs from "./PrintingsTabs";
import OracleText from "./OracleText";

const CardCalculator = () => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))

    const [anchorEl, setAnchorEl] = useState(null);

    const [cardMath, setCardMath] = useState([])

    const [searching, setSearching] = useState(true)
    const [cardOpen, setCardOpen] = useState(false)
    const [cardFlipped, setCardFlipped] = useState(false)
    const [mathOpen, setMathOpen] = useState(false)
    const [modifierOpen, setModifierOpen] = useState(false)

    const [cardFaces, setCardFaces] = useState([])
    const [cardImages, setCardImages] = useState([])
    const [displayedPrinting, setDisplayedPrinting] = useState("highestRarity")
    const [printings, setPrintings] = useState({
        lowestRarity: [],
        highestRarity: [],
        firstPrinting: []
    })
    const [oracleText, setOracleText] = useState("")

    const [fromCart, setFromCart] = useState(false)
    const [cardBuyList, setCardBuyList] = useState([])

    const [previousSearches, setPreviousSearches] = useState([])
    const [cardNameSuggestions, setCardNameSuggestions] = useState([])

    const { control, setValue, watch, getValues, reset } = useForm({
        defaultValues: {
            cardName: "",
            exp: 0,
            cardRarity: {label: "Common", value: 1},
            expModifier: {label: "None", value: 1},
            banned: false,
            after2020: false,
        },
    })

    const multiplePrintings = !(printings.firstPrinting[0] === printings.lowestRarity[0] && printings.firstPrinting[0] === printings.highestRarity[0])

    const { cardRarity, expModifier, banned, after2020, cardName } = watch()

    useEffect(() => {
        let equation = []
        let equationString = []
        let expCost = 0
        cardFaces.forEach(({exp, equation: math=[], equationString: mathString=[]}, index) => {
            expCost += exp
            if (cardFaces[index].cardType.label !== "Non-Basic Land") {
                equation = [...equation, math[0]]
                equationString = [...equationString, mathString[0]]
            }
            expCost += banned * 6
            equation.push(<Variable label={"Banned/Restricted"} value={banned} multiplier={6}/>)
            equationString.push(formatVariable("Banned/Restricted", banned, 6))

            expCost += after2020 * 5
            equation.push(<Variable label={"Post-2020"} value={after2020} multiplier={5}/>)
            equationString.push(formatVariable("Post-2020", after2020, 5))

            if (cardFaces[index].cardType.label !== "Non-Basic Land") {
                equation = [...equation, ...math.slice(1)]
                equationString = [...equationString, ...mathString.slice(1)]
            }
            else {
                equation = [...equation, ...math]
                equationString = [...equationString, ...mathString]
            }
        })

        expCost *= cardRarity?.value
        if (expModifier?.value) {
            expCost *= expModifier?.value
            expCost = Math.floor(expCost)
        }
        setCardMath(equation)
        setValue("exp", expCost)
        setValue("equationString", equationString)
    }, [cardRarity, banned, after2020, setValue, cardFaces, expModifier])

    useEffect(() => {
        if (cardName) handleSearch(null)
    }, [cardName])

    useEffect(() => {
        if (!expModifier) setValue("expModifier", {label: "None", value: 1})
    }, [expModifier])

    useEffect(() => {
        const storedCardList = getStorage("cardList")
        if (storedCardList?.length > 0) setCardBuyList(storedCardList)
    }, [setCardBuyList])

    const getCardNameSuggestions = (event, cardInput, reason) => {
        if (cardInput === "") setCardNameSuggestions([...previousSearches])
        if (cardInput.length < 3) return
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
                if (!fromCart){
                    setValue("cardRarity", rarityToMultiplier[highestRarity[0]])
                    setValue("after2020", firstPrinting[0] >= 2020)
                }
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

                const dataOracleText = cardFacesData.map(face => face?.oracle_text).join(transformSeparator)
                setOracleText(dataOracleText)

                setValue("cardName", data?.name)
                let colorIdentity = (data?.color_identity || [])
                colorIdentity.sort(sortColors)
                setValue("color", colorIdentity.join(""))
                updateRarityAndPrinting(data?.prints_search_uri)
                setCardImages(getCardImageFromData(data))

                if (fromCart) {
                    setFromCart(false)
                }
                else {
                    setCardFaces(cardFacesData.map(face => ({
                        exp: 0, math: [],
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
                    setValue("banned", bannedOrRestricted.includes(data?.name))
                    setValue("expModifier", {label: "None", value: 1})
                }
                setTimeout(() => setSearching(false), 500)
            }, rej => {
                console.log("rej", rej)
            })
    }

    const handleAddCard = () => setCardBuyList(prevState => {
        prevState = [...prevState, {...watch(), faces: cardFaces}]
        setStorage("cardList", [...prevState])
        return prevState
    })

    const handleRemoveCard = (cardIndex) => setCardBuyList(prevState => {
        const newState = []
        prevState.forEach((card, index) => {
            if (index === cardIndex) return
            newState.push(card)
        })
        setStorage("cardList", [...newState])
        return newState
    })

    const handleRemoveAllCards = () => setCardBuyList(() => {
        setStorage("cardList", [])
        return []
    })

    const handleOpenCard = (cardIndex) => {
        setFromCart(true)
        reset({...cardBuyList[cardIndex]}, {keepDefaultValues: true})
        setCardFaces([...cardBuyList[cardIndex].faces])
        handleCloseCart()
    }

    const handleOpenCart = event => setAnchorEl(event.currentTarget)

    const handleCloseCart = () => setAnchorEl(null)

    return (
        <div className={`row ${smallDisplay ? "m-1" : "m-2"}`}>
            <Box className={`w-${smallDisplay ? 90 : 50}`} autoComplete="off" onSubmit={handleSearch}>
                <CardBuyList anchorEl={anchorEl} cardList={cardBuyList}
                           onClose={handleCloseCart} onClear={handleRemoveCard}
                           onClearAll={handleRemoveAllCards}
                           onCardClick={handleOpenCard}
                />
                <Row className={"justify-content-between"}>
                    <Typography variant={smallDisplay ? "h5" : "h4"}>Card Calculator</Typography>
                    <div className={"mt-2 d-flex flex-row gap-2"}>
                        {cardName && (
                            <Button variant={"outlined"} onClick={handleAddCard}>{smallDisplay ? "Add" : "Add to Buys"}</Button>
                        )}
                        <Badge badgeContent={cardBuyList.length} color={"primary"}>
                            <Button variant={"outlined"} onClick={cardBuyList.length > 0 ? handleOpenCart : undefined}>Buys</Button>
                        </Badge>
                    </div>
                </Row>
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
                            <div className={"w-75 mt-auto"}>
                                <SearchAutocomplete
                                    control={control} name={"cardName"}
                                    label={"Card Name"}
                                    onInputChange={getCardNameSuggestions}
                                    suggestions={cardNameSuggestions}
                                />
                            </div>
                            <div className={"w-25 mt-auto"}>
                                <Button variant={"contained"} type={"submit"}>Search</Button>
                            </div>
                        </form>
                        <Row className={"w-50"}>
                            <div className={"w-50 mt-auto"}>
                                <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>
                            </div>
                            <div className={"w-50 mt-auto gap-2"}>
                                <Button variant={"outlined"} className={"me-1"} onClick={() => setModifierOpen(prevState => !prevState)}>Mod</Button>
                                <Button variant={"outlined"} onClick={() => setMathOpen(prevState => !prevState)}>Math</Button>
                            </div>
                        </Row>
                    </Row>
                </LargeScreen>

                {modifierOpen && (
                    <Row className={"w-25"}>
                        <Autocomplete name={"expModifier"} label={"Modifier"}
                                      options={modifierToMultiplier} control={control}
                        />
                    </Row>
                )}

                {mathOpen && (
                    <Row>
                        {expModifier?.value && expModifier?.label !== "None" ? (
                            <span>
                                [(<span className={"equation"}>{cardMath}</span>) * <Variable {...cardRarity}/>] * <Variable {...expModifier}/>
                            </span>
                        ) : (
                            <span>
                                (<span className={"equation"}>{cardMath}</span>) * <Variable {...cardRarity}/>
                            </span>
                        )}
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
                                  showExp={cardFaces.length > 1}
                                  onChange={cardFace => setCardFaces(prevState => {
                                      prevState[faceIndex] = {...cardFace}
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
                        zIndex: 10, position: "fixed", right: -20, top: -60,
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
                        <OracleText oracleText={oracleText}/>
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
