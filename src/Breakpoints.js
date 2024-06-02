import React from 'react';
import {useMediaQuery, useTheme} from "@mui/material";

export const SmallScreen = ({children}) => {
    const theme = useTheme()
    const display = useMediaQuery(theme.breakpoints.down("lg"))
    if (!display) return null
    return (
        <>
            {children}
        </>
    );
};

export const LargeScreen = ({children}) => {
    const theme = useTheme()
    const display = useMediaQuery(theme.breakpoints.down("lg"))
    if (display) return null
    return (
        <>
            {children}
        </>
    );
};
