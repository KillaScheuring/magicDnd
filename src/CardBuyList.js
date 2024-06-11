import React from 'react';
import {
    IconButton,
    Menu,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {LargeScreen} from "./Breakpoints";
import {Clear} from "@mui/icons-material";

const CardBuyList = ({anchorEl, cardList, onClose, onClear, onClearAll, onCardClick}) => {
    const theme = useTheme()
    const smallDisplay = useMediaQuery(theme.breakpoints.down("lg"))
    const open = Boolean(anchorEl)
    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
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
                                    <TableCell colSpan={2}/>
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
