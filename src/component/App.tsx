import React, {FunctionComponent, useEffect} from 'react';
import './App.css';
import {Box} from "@mui/material";
import {EditorGroups} from "./editor-groups/EditorGroups";
import {Sidebar} from "./Sidebar";
import {Editors} from "./Editors";
import {DirectoryExplorer} from "./directory-explorer/DirectoryExplorer";
import {useSelector} from "react-redux";
import {AppState} from "../store/AppStore";

export const App: FunctionComponent = () => {
    const showBackground = useSelector((appState: AppState) => !appState.openEditors.openEditors || !appState.openEditors.openEditors.length);

    useEffect(() => {
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
                    display: 'flex',
                    height: '100%',
                    overflowX: 'hidden'
                }}>
        <Sidebar id='Sidebar'>
            <DirectoryExplorer/>
        </Sidebar>
        <Editors showBackground={showBackground}>
            <EditorGroups/>
        </Editors>
    </Box>;
}
