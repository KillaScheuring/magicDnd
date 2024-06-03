import React, {useEffect, useState} from 'react';
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
import {getFormConfig} from "./formConfig";

export const Variable = ({label, multiplier, value}) => {
    if (!value || value < 1) return null
    if (typeof value === "boolean") return <span>{label} (<span className={"text-success fw-bold"}>{multiplier}</span>)</span>
    if (multiplier > 1) return <span>{label} ({multiplier}*<span
        className={"text-success fw-bold"}>{value}</span>)</span>
    return <span>{label} (<span className={"text-success fw-bold"}>{value}</span>)</span>
}

const CardFaceForm = ({cardName, showExp, onChange, ...defaultValues}) => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))
    const {control, setValue, watch, getValues} = useForm({
        defaultValues: {exp: 0, ...defaultValues}
    })

    const {
        cardType, convertedManaCost, xOrStar,
        playersCant, legendary,

        // Instant/Sorcery
        damage,
        life,
        cardsDrawn,
        cardsLookedAt,
        creaturesRemoved,
        extraTurns,
        tutorsTop,
        tutorsBoard,
        countersSpell,
        landRemoved,
        cardsDiscarded,
        storm,
        cascade,
        monarchOrInit,
        boardWipe,
        wordyAbilities,

        // Non-Creature Artifacts
        nonManaAbilities,
        // wordyAbilities,
        addedMana,

        // Non-Creature Enchantment/Battle
        abilities,
        // wordyAbilities,
        beginsInPlay,
        controlPermanent,
        pacify,

        // Non-Basic Land
        colorsProducedOrFetched,
        landType,
        subType,
        manLand,
        // nonManaAbilities,
        untapped,
        // addedMana,

        // Planeswalker
        loyalty,
        plusAbilities,
        minusAbilities,
        staticAbilities,

        // Creatures
        power, powerAboveVanilla,
        toughness, toughnessAboveVanilla,
        // abilities,
        // wordyAbilities,
        evasionAbilities,
        protectionAbilities,
        stupidAbilities,
        // creaturesRemoved,
        manaAbilities,
        // monarchOrInit,
        searchesLibrary,
    } = watch()

    useEffect(() => {
        setValue("powerAboveVanilla", power > convertedManaCost ? power - convertedManaCost : 0)
    }, [setValue, convertedManaCost, power])

    useEffect(() => {
        setValue("toughnessAboveVanilla", toughness > convertedManaCost ? toughness - convertedManaCost : 0)
    }, [setValue, convertedManaCost, toughness])

    useEffect(() => {
        const formConfig = getFormConfig(cardType?.label)
        let equation = []

        let expCost = convertedManaCost * cardType?.value
        if (cardType?.label !== "Non-Basic Land"){
            equation.push(
                <span>
                CMC [(<span className={"text-success fw-bold"}>{convertedManaCost}</span>) * {cardType?.label} (<span className={"text-success fw-bold"}>{cardType?.value}</span>)]
            </span>
            )
        }

        // Anything with X or * in the casting cost or power/toughness incurs an additional 4-point cost.
        expCost += xOrStar * 4
        equation.push(<Variable label={"X/★"} multiplier={4} value={xOrStar}/>)

        // +5 points if it includes text like "players/opponents can’t".
        expCost += playersCant * 5
        equation.push(<Variable label={"Player Can't"} multiplier={5} value={playersCant}/>)

        // +3 more points if it is Legendary.
        expCost += legendary * 3
        equation.push(<Variable label={"Legendary"} multiplier={3} value={legendary}/>)
        for (let attributeName in formConfig) {
            const attribute = formConfig[attributeName]
            if (cardType?.label === "Non-Basic Land" && attributeName === "addedMana"){
                let value = null
                if (getValues(attributeName) >=4) {
                    value = "5 + 7 + 9"
                    expCost += 5 + 7 + 9
                }
                else if (getValues(attributeName) >=3) {
                    value = "5 + 7"
                    expCost += 5 + 7
                }
                else if (getValues(attributeName) >=2) {
                    value = "5"
                    expCost += 5
                }
                equation.push(<Variable label={attribute.label.equation}
                                        multiplier={attribute.multiplier}
                                        value={value}
                />)
            }
            else {
                expCost += getValues(attributeName) * attribute.multiplier
                equation.push(<Variable label={attribute.label.equation}
                                        multiplier={attribute.multiplier}
                                        value={getValues(attributeName)}
                />)
            }
        }

        setValue("exp", expCost)
        onChange(expCost, equation)
    }, [
        setValue, cardType?.label, cardType?.value, convertedManaCost, xOrStar, playersCant, legendary, getValues,
        damage,
        life,
        cardsDrawn,
        cardsLookedAt,
        creaturesRemoved,
        extraTurns,
        tutorsTop,
        tutorsBoard,
        countersSpell,
        landRemoved,
        cardsDiscarded,
        storm,
        cascade,
        monarchOrInit,
        boardWipe,
        wordyAbilities,

        nonManaAbilities,
        addedMana,

        abilities,
        beginsInPlay,
        controlPermanent,
        pacify,

        colorsProducedOrFetched,
        landType,
        subType,
        manLand,
        untapped,

        loyalty,
        plusAbilities,
        minusAbilities,
        staticAbilities,

        powerAboveVanilla, toughnessAboveVanilla,
        evasionAbilities,
        protectionAbilities,
        stupidAbilities,
        manaAbilities,
        searchesLibrary,
    ])


    const cardTypeForm = () => {
        const formConfig = getFormConfig(cardType?.label)
        switch (cardType?.label) {
            case "Creature":
                return (
                    <>
                        <SmallScreen>
                            <Row>
                                <TextField name={"power"} type={"number"} control={control}
                                           label={formConfig.powerAboveVanilla.label.smallScreen}
                                           helperText={formConfig.powerAboveVanilla.helperText}
                                />
                                <TextField name={"toughness"} type={"number"} control={control}
                                           label={formConfig.toughnessAboveVanilla.label.smallScreen}
                                           helperText={formConfig.toughnessAboveVanilla.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"abilities"} type={"number"} control={control}
                                           label={formConfig.abilities.label.smallScreen}
                                           helperText={formConfig.abilities.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.smallScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"evasionAbilities"} type={"number"} control={control}
                                           label={formConfig.evasionAbilities.label.smallScreen}
                                           helperText={formConfig.evasionAbilities.helperText}
                                />
                                <TextField name={"protectionAbilities"} type={"number"} control={control}
                                           label={formConfig.protectionAbilities.label.smallScreen}
                                           helperText={formConfig.protectionAbilities.helperText}
                                />
                                <TextField name={"stupidAbilities"} type={"number"} control={control}
                                           label={formConfig.stupidAbilities.label.smallScreen}
                                           helperText={formConfig.stupidAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"creaturesRemoved"} type={"number"} control={control}
                                           label={formConfig.creaturesRemoved.label.smallScreen}
                                           helperText={formConfig.creaturesRemoved.helperText}
                                />
                                <TextField name={"manaAbilities"} type={"number"} control={control}
                                           label={formConfig.manaAbilities.label.smallScreen}
                                           helperText={formConfig.manaAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"monarchOrInit"} control={control}
                                        label={formConfig.monarchOrInit.label.smallScreen}
                                        helperText={formConfig.monarchOrInit.helperText}
                                />
                                <Toggle name={"searchesLibrary"} control={control}
                                        label={formConfig.searchesLibrary.label.smallScreen}
                                        helperText={formConfig.searchesLibrary.helperText}
                                />
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <TextField name={"power"} type={"number"} control={control}
                                           label={formConfig.powerAboveVanilla.label.largeScreen}
                                           helperText={formConfig.powerAboveVanilla.helperText}
                                />
                                <TextField name={"toughness"} type={"number"} control={control}
                                           label={formConfig.toughnessAboveVanilla.label.largeScreen}
                                           helperText={formConfig.toughnessAboveVanilla.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"abilities"} type={"number"} control={control}
                                           label={formConfig.abilities.label.largeScreen}
                                           helperText={formConfig.abilities.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.largeScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"evasionAbilities"} type={"number"} control={control}
                                           label={formConfig.evasionAbilities.label.largeScreen}
                                           helperText={formConfig.evasionAbilities.helperText}
                                />
                                <TextField name={"protectionAbilities"} type={"number"} control={control}
                                           label={formConfig.protectionAbilities.label.largeScreen}
                                           helperText={formConfig.protectionAbilities.helperText}
                                />
                                <TextField name={"stupidAbilities"} type={"number"} control={control}
                                           label={formConfig.stupidAbilities.label.largeScreen}
                                           helperText={formConfig.stupidAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"creaturesRemoved"} type={"number"} control={control}
                                           label={formConfig.creaturesRemoved.label.largeScreen}
                                           helperText={formConfig.creaturesRemoved.helperText}
                                />
                                <TextField name={"manaAbilities"} type={"number"} control={control}
                                           label={formConfig.manaAbilities.label.largeScreen}
                                           helperText={formConfig.manaAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"monarchOrInit"} control={control}
                                        label={formConfig.monarchOrInit.label.largeScreen}
                                        helperText={formConfig.monarchOrInit.helperText}
                                />
                                <Toggle name={"searchesLibrary"} control={control}
                                        label={formConfig.searchesLibrary.label.largeScreen}
                                        helperText={formConfig.searchesLibrary.helperText}
                                />
                            </Row>
                        </LargeScreen>
                    </>
                )
            case "Non-Creature Artifact":
                return (
                    <>
                        <SmallScreen>
                            <Row>
                                <TextField name={"nonManaAbilities"} type={"number"} control={control}
                                           label={formConfig.nonManaAbilities.label.smallScreen}
                                           helperText={formConfig.nonManaAbilities.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.smallScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                                <TextField name={"addedMana"} type={"number"} control={control}
                                           label={formConfig.addedMana.label.smallScreen}
                                           helperText={formConfig.addedMana.helperText}
                                />
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <TextField name={"nonManaAbilities"} type={"number"} control={control}
                                           label={formConfig.nonManaAbilities.label.largeScreen}
                                           helperText={formConfig.nonManaAbilities.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.largeScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                                <TextField name={"addedMana"} type={"number"} control={control}
                                           label={formConfig.addedMana.label.largeScreen}
                                           helperText={formConfig.addedMana.helperText}
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
                                <TextField name={"abilities"} type={"number"} control={control}
                                           label={formConfig.abilities.label.smallScreen}
                                           helperText={formConfig.abilities.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.smallScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"beginsInPlay"} control={control}
                                        label={formConfig.beginsInPlay.label.smallScreen}
                                        helperText={formConfig.beginsInPlay.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"controlPermanent"} control={control}
                                        label={formConfig.controlPermanent.label.smallScreen}
                                        helperText={formConfig.controlPermanent.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"pacify"} control={control}
                                        label={formConfig.pacify.label.smallScreen}
                                        helperText={formConfig.pacify.helperText}
                                />
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <TextField name={"abilities"} type={"number"} control={control}
                                           label={formConfig.pacify.label.largeScreen}
                                           helperText={formConfig.pacify.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.pacify.label.largeScreen}
                                           helperText={formConfig.pacify.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"beginsInPlay"} control={control}
                                        label={formConfig.beginsInPlay.label.largeScreen}
                                        helperText={formConfig.beginsInPlay.helperText}
                                />
                                <Toggle name={"controlPermanent"} control={control}
                                        label={formConfig.controlPermanent.label.largeScreen}
                                        helperText={formConfig.controlPermanent.helperText}
                                />
                                <Toggle name={"pacify"} control={control}
                                        label={formConfig.pacify.label.largeScreen}
                                        helperText={formConfig.pacify.helperText}
                                />
                            </Row>
                        </LargeScreen>
                    </>
                )
            case "Non-Basic Land":
                return (
                    <>
                        <SmallScreen>
                            <Row>
                                <TextField name={"nonManaAbilities"} type={"number"} control={control}
                                           label={formConfig.nonManaAbilities.label.smallScreen}
                                           helperText={formConfig.nonManaAbilities.helperText}
                                />
                                <TextField name={"addedMana"} type={"number"} control={control}
                                           label={formConfig.addedMana.label.smallScreen}
                                           helperText={formConfig.addedMana.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"colorsProducedOrFetched"} type={"number"} control={control}
                                           label={formConfig.colorsProducedOrFetched.label.smallScreen}
                                           helperText={formConfig.colorsProducedOrFetched.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"landType"} control={control}
                                        label={formConfig.landType.label.smallScreen}
                                        helperText={formConfig.landType.helperText}
                                />
                                <Toggle name={"subType"} control={control}
                                        label={formConfig.subType.label.smallScreen}
                                        helperText={formConfig.subType.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"manLand"} control={control}
                                        label={formConfig.manLand.label.smallScreen}
                                        helperText={formConfig.manLand.helperText}
                                />
                                <Toggle name={"untapped"} control={control}
                                        label={formConfig.untapped.label.smallScreen}
                                        helperText={formConfig.untapped.helperText}
                                />
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <TextField name={"nonManaAbilities"} type={"number"} control={control}
                                           label={formConfig.nonManaAbilities.label.largeScreen}
                                           helperText={formConfig.nonManaAbilities.helperText}
                                />
                                <TextField name={"addedMana"} type={"number"} control={control}
                                           label={formConfig.addedMana.label.largeScreen}
                                           helperText={formConfig.addedMana.helperText}
                                />
                                <TextField name={"colorsProducedOrFetched"} type={"number"} control={control}
                                           label={formConfig.colorsProducedOrFetched.label.largeScreen}
                                           helperText={formConfig.colorsProducedOrFetched.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"landType"} control={control}
                                        label={formConfig.landType.label.largeScreen}
                                        helperText={formConfig.landType.helperText}
                                />
                                <Toggle name={"subType"} control={control}
                                        label={formConfig.subType.label.largeScreen}
                                        helperText={formConfig.subType.helperText}
                                />
                                <Toggle name={"manLand"} control={control}
                                        label={formConfig.manLand.label.largeScreen}
                                        helperText={formConfig.manLand.helperText}
                                />
                                <Toggle name={"untapped"} control={control}
                                        label={formConfig.untapped.label.largeScreen}
                                        helperText={formConfig.untapped.helperText}
                                />
                            </Row>
                        </LargeScreen>
                    </>
                )
            case "Planeswalker":
                return (
                    <>
                        <SmallScreen>
                            <Row>
                                <TextField name={"loyalty"} type={"number"} control={control}
                                           label={formConfig.loyalty.label.smallScreen}
                                           helperText={formConfig.loyalty.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"plusAbilities"} type={"number"} control={control}
                                           label={formConfig.plusAbilities.label.smallScreen}
                                           helperText={formConfig.plusAbilities.helperText}
                                />
                                <TextField name={"minusAbilities"} type={"number"} control={control}
                                           label={formConfig.minusAbilities.label.smallScreen}
                                           helperText={formConfig.minusAbilities.helperText}
                                />
                                <TextField name={"staticAbilities"} type={"number"} control={control}
                                           label={formConfig.staticAbilities.label.smallScreen}
                                           helperText={formConfig.staticAbilities.helperText}
                                />
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <TextField name={"loyalty"} type={"number"} control={control}
                                           label={formConfig.loyalty.label.largeScreen}
                                           helperText={formConfig.loyalty.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"plusAbilities"} type={"number"} control={control}
                                           label={formConfig.plusAbilities.label.largeScreen}
                                           helperText={formConfig.plusAbilities.helperText}
                                />
                                <TextField name={"minusAbilities"} type={"number"} control={control}
                                           label={formConfig.minusAbilities.label.largeScreen}
                                           helperText={formConfig.minusAbilities.helperText}
                                />
                                <TextField name={"staticAbilities"} type={"number"} control={control}
                                           label={formConfig.staticAbilities.label.largeScreen}
                                           helperText={formConfig.staticAbilities.helperText}
                                />
                            </Row>
                        </LargeScreen>
                    </>
                )
            default:
                return (
                    <>
                        <SmallScreen>
                            <Row>
                                <TextField name={"damage"} type={"number"} control={control}
                                           label={formConfig.damage.label.smallScreen}
                                           helperText={formConfig.damage.helperText}
                                />
                                <TextField name={"life"} type={"number"} control={control}
                                           label={formConfig.life.label.smallScreen}
                                           helperText={formConfig.life.helperText}
                                />
                                <TextField name={"creaturesRemoved"} type={"number"} control={control}
                                           label={formConfig.creaturesRemoved.label.smallScreen}
                                           helperText={formConfig.creaturesRemoved.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"cardsDrawn"} type={"number"} control={control}
                                           label={formConfig.cardsDrawn.label.smallScreen}
                                           helperText={formConfig.cardsDrawn.helperText}
                                />
                                <TextField name={"cardsDiscarded"} type={"number"} control={control}
                                           label={formConfig.cardsDiscarded.label.smallScreen}
                                           helperText={formConfig.cardsDiscarded.helperText}
                                />
                                <TextField name={"cardsLookedAt"} type={"number"} control={control}
                                           label={formConfig.cardsLookedAt.label.smallScreen}
                                           helperText={formConfig.cardsLookedAt.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"extraTurns"} type={"number"} control={control}
                                           label={formConfig.extraTurns.label.smallScreen}
                                           helperText={formConfig.extraTurns.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.smallScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"tutorsTop"} control={control}
                                        label={formConfig.tutorsTop.label.smallScreen}
                                        helperText={formConfig.tutorsTop.helperText}
                                />
                                <Toggle name={"tutorsBoard"} control={control}
                                        label={formConfig.tutorsBoard.label.smallScreen}
                                        helperText={formConfig.tutorsBoard.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"countersSpell"} control={control}
                                        label={formConfig.countersSpell.label.smallScreen}
                                        helperText={formConfig.countersSpell.helperText}
                                />
                                <Toggle name={"landRemoved"} control={control}
                                        label={formConfig.landRemoved.label.smallScreen}
                                        helperText={formConfig.landRemoved.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"storm"} control={control}
                                        label={formConfig.storm.label.smallScreen}
                                        helperText={formConfig.storm.helperText}
                                />
                                <Toggle name={"cascade"} control={control}
                                        label={formConfig.cascade.label.smallScreen}
                                        helperText={formConfig.cascade.helperText}
                                />
                                <Toggle name={"boardWipe"} control={control}
                                        label={formConfig.boardWipe.label.smallScreen}
                                        helperText={formConfig.boardWipe.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"monarchOrInit"} control={control}
                                        label={formConfig.monarchOrInit.label.smallScreen}
                                        helperText={formConfig.monarchOrInit.helperText}
                                />
                            </Row>
                        </SmallScreen>
                        <LargeScreen>
                            <Row>
                                <TextField name={"damage"} type={"number"} control={control}
                                           label={formConfig.damage.label.largeScreen}
                                           helperText={formConfig.damage.helperText}
                                />
                                <TextField name={"life"} type={"number"} control={control}
                                           label={formConfig.life.label.largeScreen}
                                           helperText={formConfig.life.helperText}
                                />
                                <TextField name={"creaturesRemoved"} type={"number"} control={control}
                                           label={formConfig.creaturesRemoved.label.largeScreen}
                                           helperText={formConfig.creaturesRemoved.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"cardsDrawn"} type={"number"} control={control}
                                           label={formConfig.cardsDrawn.label.largeScreen}
                                           helperText={formConfig.cardsDrawn.helperText}
                                />
                                <TextField name={"cardsDiscarded"} type={"number"} control={control}
                                           label={formConfig.cardsDiscarded.label.largeScreen}
                                           helperText={formConfig.cardsDiscarded.helperText}
                                />
                                <TextField name={"cardsLookedAt"} type={"number"} control={control}
                                           label={formConfig.cardsLookedAt.label.largeScreen}
                                           helperText={formConfig.cardsLookedAt.helperText}
                                />
                            </Row>
                            <Row>
                                <TextField name={"extraTurns"} type={"number"} control={control}
                                           label={formConfig.extraTurns.label.largeScreen}
                                           helperText={formConfig.extraTurns.helperText}
                                />
                                <TextField name={"wordyAbilities"} type={"number"} control={control}
                                           label={formConfig.wordyAbilities.label.largeScreen}
                                           helperText={formConfig.wordyAbilities.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"tutorsTop"} control={control}
                                        label={formConfig.tutorsTop.label.largeScreen}
                                        helperText={formConfig.tutorsTop.helperText}
                                />
                                <Toggle name={"tutorsBoard"} control={control}
                                        label={formConfig.tutorsBoard.label.largeScreen}
                                        helperText={formConfig.tutorsBoard.helperText}
                                />
                                <Toggle name={"countersSpell"} control={control}
                                        label={formConfig.countersSpell.label.largeScreen}
                                        helperText={formConfig.countersSpell.helperText}
                                />
                                <Toggle name={"landRemoved"} control={control}
                                        label={formConfig.landRemoved.label.largeScreen}
                                        helperText={formConfig.landRemoved.helperText}
                                />
                            </Row>
                            <Row>
                                <Toggle name={"storm"} control={control}
                                        label={formConfig.storm.label.largeScreen}
                                        helperText={formConfig.storm.helperText}
                                />
                                <Toggle name={"cascade"} control={control}
                                        label={formConfig.cascade.label.largeScreen}
                                        helperText={formConfig.cascade.helperText}
                                />
                                <Toggle name={"monarchOrInit"} control={control}
                                        label={formConfig.monarchOrInit.label.largeScreen}
                                        helperText={formConfig.monarchOrInit.helperText}
                                />
                                <Toggle name={"boardWipe"} control={control}
                                        label={formConfig.boardWipe.label.largeScreen}
                                        helperText={formConfig.boardWipe.helperText}
                                />
                            </Row>
                        </LargeScreen>
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
                    {cardType?.value !== 0 && (
                        <TextField name={"convertedManaCost"} label={"CMC"}
                                   type={"number"} control={control}
                        />
                    )}
                    <Autocomplete name={"cardType"} label={"Card Type"}
                                  options={cardTypeToManaCostMultiplier} control={control}
                    />

                </Row>
                <Row>
                    <Toggle name={"xOrStar"} control={control} label={"X/★"}/>
                    <Toggle name={"playersCant"} control={control} label={"Players can't"}/>
                    <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                </Row>
            </SmallScreen>
            <LargeScreen>
                {cardType?.value === 0 && !showExp ? (
                    <>
                        <Row>
                            <div className={"w-25"}>
                                <Autocomplete name={"cardType"} label={"Card Type"}
                                              options={cardTypeToManaCostMultiplier} control={control}
                                />
                            </div>
                            <Row className={"w-75 pt-5"}>
                                <Toggle name={"xOrStar"} control={control} label={"X or ★"}/>
                                <Toggle name={"playersCant"} control={control} label={"Players/Opponents can't"}/>
                                <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                            </Row>
                        </Row>
                    </>
                ) : (
                    <>
                        <Row>
                            {cardType?.value !== 0 && (
                                <TextField name={"convertedManaCost"} label={"CMC"}
                                           type={"number"} control={control}
                                />
                            )}
                            <Autocomplete name={"cardType"} label={"Card Type"}
                                          options={cardTypeToManaCostMultiplier} control={control}
                            />
                            {showExp && <TextField name={"exp"} label={"EXP"} type={"number"} control={control}/>}
                        </Row>
                        <Row>
                            <Toggle name={"xOrStar"} control={control} label={"X or ★"}/>
                            <Toggle name={"playersCant"} control={control} label={"Players/Opponents can't"}/>
                            <Toggle name={"legendary"} control={control} label={"Legendary"}/>
                        </Row>
                    </>
                )}
            </LargeScreen>

            {cardTypeForm()}
        </>
    );
};

export default CardFaceForm;
