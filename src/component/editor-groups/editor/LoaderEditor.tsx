import React, {FunctionComponent} from "react";
import {Box, CircularProgress} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export const LoaderEditor: FunctionComponent = () => {
    return <Box sx={{
        display: 'flex',
        height: `calc(100% - 48px - 8px)`,
        alignItems: 'center',
        m: 0,
        p: 0,
        overflow: 'auto'
    }}>
        <Box sx={{maxWidth: '600px', textAlign: 'center', margin: '0 auto'}}>
            <CircularProgress/>
            <Box sx={{mt: 2, fontSize: '1.2em'}}>Loading content...</Box>
        </Box>
    </Box>;
}