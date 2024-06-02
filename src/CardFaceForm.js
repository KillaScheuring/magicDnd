import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {
    ControlledAutocomplete as Autocomplete,
    ControlledTextField as TextField,
    ControlledToggle as Toggle
} from "./ControlledInput";
import {cardTypeToManaCostMultiplier} from "./options";
import {Row} from "./FormStyling";
import {Divider, Typography, useMediaQuery, useTheme} from "@mui/material";
import {LargeScreen, SmallScreen} from "./Breakpoints";

const CardFaceForm = ({cardName, showExp, onChange, ...defaultValues}) => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))
    const { control, setValue, watch, getValues, reset, setError } = useForm({
        defaultValues: {exp: 0, ...defaultValues}
    })

    const {
        cardType,
        convertedManaCost,
        xOrStar,
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
        setValue("exp", expCost)
        onChange(expCost)
    }, [convertedManaCost, cardType, xOrStar, playersCant, legendary, damage, life, cardsDrawn, cardsLookedAt, creaturesRemoved, extraTurns, tutorsTop, tutorsBoard, countersSpell, landRemoved, cardsDiscarded, storm, cascade, monarchOrInit, boardWipe, wordyAbilities, nonManaAbilities, addedMana, abilities, beginsInPlay, controlPermanent, pacify, colorsProducedOrFetched, landType, subType, manLand, untapped, loyalty, plusAbilities, minusAbilities, staticAbilities, power, toughness, evasionAbilities, protectionAbilities, stupidAbilities, creatureRemoved, searchesLibrary, manaAbility, setValue])


    const cardTypeForm = () => {
        switch (cardType?.label) {
            case "Creature":
                return (
                    <>
                        <SmallScreen>
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
                                <TextField name={"creaturesRemoved"} label={"Creatures destroyed or removed"}
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
                        </SmallScreen>
                        <LargeScreen>
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
                        </LargeScreen>
                    </>
                )
            case "Non-Creature Artifact":
                return (
                    <>
                        <SmallScreen>
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
                        </SmallScreen>
                        <LargeScreen>
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
                        </LargeScreen>
                    </>
                )
            case "Non-Creature Enchantment/Battle":
                return (
                    <>
                        <SmallScreen>
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
                            </Row>
                            <Row>
                                <Toggle name={"controlPermanent"} label={"Controls a permanent"} control={control}/>
                            </Row>
                            <Row>
                                <Toggle name={"pacify"} label={"pacify/arrest/exile"} control={control}/>
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
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
                        </LargeScreen>
                    </>
                )
            case "Non-Basic Land":
                return (
                    <>
                        <SmallScreen>
                            <Row>
                                <TextField name={"nonManaAbilities"} label={"Non-Mana Abilities"}
                                           helperText={"Not including coming into play tapped or untapped"}
                                           type={"number"} control={control}
                                />
                                <TextField name={"addedMana"} label={"Amount of mana added in a turn"}
                                           type={"number"} control={control}
                                />
                            </Row>
                            <Row>
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
                        </SmallScreen>
                        <LargeScreen>
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
                        </LargeScreen>
                    </>
                )
            case "Planeswalker":
                return (
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
                )
            default:
                return (
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
                )
        }
    }
    return (
        <>
            <Typography variant={smallDisplay ? "" : "h5"}>{cardName} - {cardType?.label}</Typography>
            <Row><Divider/></Row>
            <SmallScreen>
                {showExp && (
                    <Row>
                        <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>
                    </Row>
                )}
                <Row>
                    <TextField name={"convertedManaCost"} label={"CMC"}
                               type={"number"} control={control}
                    />
                    <Autocomplete name={"cardType"} label={"Card Type"}
                                  options={cardTypeToManaCostMultiplier} control={control}
                    />

                </Row>
                <Row>
                    <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                    <Toggle name={"xOrStar"} control={control} label={"X/★"}/>
                    <Toggle name={"playersCant"} control={control} label={"Players can't"}/>
                </Row>
            </SmallScreen>
            <LargeScreen>
                <Row>
                    <TextField name={"convertedManaCost"} label={"Converted Mana Cost"} type={"number"} control={control}/>
                    <Autocomplete name={"cardType"} label={"Card Type"}
                                  options={cardTypeToManaCostMultiplier} control={control}
                    />
                    {showExp && <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>}
                </Row>
                <Row>
                    <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                    <Toggle name={"xOrStar"} control={control} label={"X or ★"}/>
                    <Toggle name={"playersCant"} control={control} label={"Players/Opponents can't"}/>
                </Row>
            </LargeScreen>

            {cardTypeForm()}
        </>
    );
};

export default CardFaceForm;
