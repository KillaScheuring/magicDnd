import React from 'react';
import {styled, Tab, Tabs} from "@mui/material";

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
        '&.Mui-selected': {
            color: '#fff',
            backgroundColor: theme.palette.primary.dark,
            borderRadius: "0% 20% 0% 20%"
        },
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

export default PrintingsTabs;
