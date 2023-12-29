import React, {FunctionComponent} from 'react';
import './App.css';
import {ProjectExplorer} from "./project-explorer/ProjectExplorer";
import {Box} from "@mui/material";
import {EditorCollector} from "./editor/EditorCollector";
import {Sidebar} from "./Sidebar";

export const App: FunctionComponent = () => {
    return <Box className="app"
                sx={{
                    display: 'flex'
                }}>
        <Sidebar>
            <ProjectExplorer/>
        </Sidebar>
        <Box  sx={{flexGrow: 1}}>
            <EditorCollector />
        </Box>
    </Box>;
}
