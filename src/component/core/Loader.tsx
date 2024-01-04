import React, {FunctionComponent} from "react";
import {Box, CircularProgress} from "@mui/material";
import {SxProps} from "@mui/system/styleFunctionSx";

export const Loader: FunctionComponent<LoaderProps> = props => {
    return <Box className={`loader-root ${props.className}`} sx={props.sx}>
        <CircularProgress className="loader-circular-progress"/>
        <Box className="loader-message">{props.message ?? "Loading, please wait"}</Box>
    </Box>;
}

export interface LoaderProps {
    message?: string;
    className?: string;
    sx?: SxProps;
}