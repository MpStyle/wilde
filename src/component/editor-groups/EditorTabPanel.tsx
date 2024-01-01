import {Box, useTheme} from "@mui/material";
import React from "react";

export const EditorTabPanel = (props: EditorTabPanelProps) => {
    const {children, value, index, ...other} = props;
    const theme = useTheme();

    return <Box role="tabpanel"
                sx={{height: '100%', pl: 1, borderTop: `1px solid ${theme.palette.text.disabled}`}}
                hidden={value !== index}
                id={`editor-tabpanel-${index}`}
                aria-labelledby={`editor-tab-${index}`}
                {...other}>
        {value === index && children}
    </Box>;
}

export interface EditorTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}