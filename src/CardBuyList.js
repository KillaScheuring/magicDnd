import React from 'react';
import {
    Button,
    IconButton,
    Menu,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme, Badge, Tooltip
} from "@mui/material";
import {LargeScreen, SmallScreen} from "./Breakpoints";
import {Clear, ContentCopy, CalculateRounded} from "@mui/icons-material";

const CardBuyList = ({anchorEl, cardList, onClose, onClear, onClearAll, onCardClick}) => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))
    const open = Boolean(anchorEl)

    const handleCopy = (addMath) => {
        let buyListString = cardList.map(card => {
            let cardLine = (`${card?.cardName} - ${card?.exp}`)
            if (addMath) {
                const mathString = card?.equationString.filter(variable => variable).join(" + ")
                cardLine += `\n${mathString} = ${card?.exp}\n`
            }
            return cardLine
        }).join("\n")
        navigator.clipboard.writeText(buyListString)
        window.alert("Copied to clipboard")
    }

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    // overflowY: 'visible',
                    // overflowX: 'hidden',
                    overflow: 'hidden',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <TableContainer style={{width: smallDisplay ? "100vw" : "45vw"}}>
                <Table>
                    <TableHead>
                        <SmallScreen>
                            <TableRow>
                                <TableCell>
                                    <IconButton size={"small"}
                                            onClick={() => handleCopy(false)}>
                                        <Tooltip title={"Copy List"}>
                                            <ContentCopy/>
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton size={"small"}
                                                onClick={() => handleCopy(true)}>
                                        <Tooltip title={"Copy List w/ Math"}>
                                            <Badge badgeContent={"+"}>
                                                <ContentCopy/>
                                            </Badge>
                                        </Tooltip>
                                    </IconButton>
                                </TableCell>
                                <TableCell>

                                </TableCell>
                                <TableCell/>
                            </TableRow>
                        </SmallScreen>
                        <TableRow>
                            <TableCell>Card</TableCell>
                            <LargeScreen>
                                <TableCell>Color</TableCell>
                                <TableCell>CMC</TableCell>
                            </LargeScreen>
                            <TableCell>EXP</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cardList.map((card, index) => (
                            <TableRow onClick={() => onCardClick(index)}>
                                <TableCell>{card?.cardName}</TableCell>
                                <LargeScreen>
                                    <TableCell>{card?.color}</TableCell>
                                    <TableCell>{card?.faces?.reduce((total, face) => total + face?.convertedManaCost, 0)}</TableCell>
                                </LargeScreen>
                                <TableCell>{card?.exp}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onClear(index)}>
                                        <Clear/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {cardList.length > 0 && (
                            <TableRow>
                                <LargeScreen>
                                    <TableCell>
                                        <Button variant={"contained"}
                                                onClick={() => handleCopy(false)}>
                                            Copy
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant={"outlined"}
                                                onClick={() => handleCopy(true)}>
                                            Copy w/ Math
                                        </Button>
                                    </TableCell>
                                </LargeScreen>
                                <TableCell>Total</TableCell>
                                <TableCell>{cardList.reduce((total, card) => total + card?.exp, 0)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={onClearAll}>
                                        <Clear/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Menu>
    )
}

export default CardBuyList;
