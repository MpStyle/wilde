import {Box, useTheme} from "@mui/material";
import React from "react";
import {EditorInfo} from "../../slice/OpenEditorsSlice";

export const EditorTabPanel = (props: EditorTabPanelProps) => {
    const {children, editor, index, hidden, ...other} = props;
    const theme = useTheme();

    return <Box role="tabpanel"
                sx={{height: '100%', pl: 1, borderTop: `1px solid ${theme.palette.text.disabled}`}}
                hidden={hidden}
                id={`editor-tabpanel-${index}`}
                aria-labelledby={`editor-tab-${index}`}
                {...other}>
        {children}
    </Box>;
}

export interface EditorTabPanelProps {
    children?: React.ReactNode;
    hidden: boolean;
    index: number;
    editor: EditorInfo;
}