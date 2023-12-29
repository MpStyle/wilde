import React, {FunctionComponent} from 'react';
import './App.css';
import {ProjectExplorer} from "./project-explorer/ProjectExplorer";
import {Box} from "@mui/material";
import {EditorGroups} from "./editor-groups/EditorGroups";
import {Sidebar} from "./Sidebar";
import {Editors} from "./Editors";

export const App: FunctionComponent = () => {
    return <Box id="App"
                sx={{
                    display: 'flex',
                    height: '100%',
                    overflowX: 'hidden'
                }}>
        <Sidebar id='Sidebar'>
            <ProjectExplorer/>
        </Sidebar>
        <Editors id='Editors'>
            <EditorGroups/>
        </Editors>
    </Box>;
}
