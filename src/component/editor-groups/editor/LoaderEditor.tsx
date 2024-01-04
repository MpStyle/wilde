import React, {FunctionComponent} from "react";
import {Box} from "@mui/material";
import {Loader} from "../../core/Loader";

export const LoaderEditor: FunctionComponent = () => {
    return <Box sx={{
        display: 'flex',
        height: `calc(100% - 48px - 8px)`,
        alignItems: 'center',
        m: 0,
        p: 0,
        overflow: 'auto'
    }}>
        <Loader message="Loading content..." sx={{maxWidth: '600px', textAlign: 'center', margin: '0 auto'}}/>
    </Box>;
}