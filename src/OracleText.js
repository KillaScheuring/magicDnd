import React from 'react';
import {Typography} from "@mui/material";

const OracleText = ({oracleText}) => {
    return (
        <>
            <Typography variant={"h4"}>Oracle Text</Typography>
            <Typography>{oracleText.split("\n").map(line => (<>{line}<br/><br/></>))}</Typography>
        </>
    )
}

export default OracleText;
