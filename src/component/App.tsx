import React, {FunctionComponent, useEffect} from 'react';
import {Box, useTheme} from "@mui/material";
import {EditorGroups} from "./editor-groups/EditorGroups";
import {Sidebar} from "./Sidebar";
import {Editors} from "./Editors";
import {DirectoryExplorer} from "./directory-explorer/DirectoryExplorer";
import {useSelector} from "react-redux";
import {AppState} from "../store/AppStore";
import {StatusBar} from "./status-bar/StatusBar";

export const App: FunctionComponent = () => {
    const showBackground = useSelector((appState: AppState) => !appState.openEditors.openEditors || !appState.openEditors.openEditors.length);
    const theme = useTheme();
    const statusBarHeight = '28px';

    useEffect(() => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return;
        }

        const unloadCallback = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);

        return () => {
            window.removeEventListener("beforeunload", unloadCallback);
        }
    }, []);

    return <Box id="App"
                sx={{
                    height: '100%',
                    overflowX: 'hidden'
                }}>
        <Box sx={{
            display: 'flex',
            height: `calc(100% - ${statusBarHeight})`,
            overflowX: 'hidden'
        }}>
            <Sidebar id='Sidebar'>
                <DirectoryExplorer/>
            </Sidebar>
            <Editors showBackground={showBackground}>
                <EditorGroups/>
            </Editors>
        </Box>
        <Box sx={{
            display: 'flex',
            height: statusBarHeight,
            justifyContent: 'space-between',
            alignItems: 'center',
            pl: '1em',
            pr: '1em',
            borderTop: `1px solid ${theme.palette.text.disabled}`
        }}>
            <StatusBar/>
        </Box>
    </Box>;
}
