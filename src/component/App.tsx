import React, {FunctionComponent} from 'react';
import './App.css';
import {Box} from "@mui/material";
import {EditorGroups} from "./editor-groups/EditorGroups";
import {Sidebar} from "./Sidebar";
import {Editors} from "./Editors";
import {DirectoryExplorer} from "./directory-explorer/DirectoryExplorer";

export const App: FunctionComponent = () => {
    return <Box id="App"
                sx={{
                    display: 'flex',
                    height: '100%',
                    overflowX: 'hidden'
                }}>
        <Sidebar id='Sidebar'>
            <DirectoryExplorer/>
        </Sidebar>
        <Editors id='Editors'>
            <EditorGroups/>
        </Editors>
    </Box>;
}
