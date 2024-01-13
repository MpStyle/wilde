import { Box, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { EditorGroups } from "./editor-groups/EditorGroups";
import { useSelector } from "react-redux";
import { AppState } from "../store/AppStore";

export const Editors: FunctionComponent = () => {
    const showBackground = useSelector((appState: AppState) => !appState.openEditors.openEditors || !appState.openEditors.openEditors.length);
    const theme = useTheme();

    return <Box id='Editors'
        sx={{
            flexGrow: 1,
            height: '100%',
            overflow: 'hidden',
            backgroundImage: showBackground ? 'url("images/wilde-logo.png")' : null,
            backgroundSize: '75%',
            [theme.breakpoints.up('sm')]: {
                backgroundSize: '50%',
            },
            [theme.breakpoints.up('md')]: {
                backgroundSize: '45%',
            },
            [theme.breakpoints.up('lg')]: {
                backgroundSize: '35%',
            },
            [theme.breakpoints.up('lg')]: {
                backgroundSize: '25%',
            },
            [theme.breakpoints.up('xl')]: {
                backgroundSize: '15%',
            },
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
        <EditorGroups />
    </Box>
}