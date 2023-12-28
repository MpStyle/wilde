import React, {FunctionComponent} from 'react';
import './App.css';
import {ProjectExplorer} from "./project-explorer/ProjectExplorer";
import {Box} from "@mui/material";
import {EditorCollector} from "./editor/EditorCollector";

export const App: FunctionComponent = () => {
    return <Box className="app"
                sx={{
                    display: 'flex'
                }}>
        <Box className="sidebar">
            <ProjectExplorer/>
        </Box>
        <Box  sx={{flexGrow: 1}}>
            <EditorCollector />
        </Box>
    </Box>;
}
