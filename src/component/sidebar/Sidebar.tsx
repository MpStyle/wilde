import { Box, Typography, useTheme } from "@mui/material";
import { FunctionComponent, useState } from 'react';
import { DirectoryExplorer } from './DirectoryExplorer';
import { useSelector } from "react-redux";
import { AppState } from "../../store/AppStore";
import { EmptyDirectoryExplorer } from "./EmptySidebar";
import { ActionsBar } from "./ActionsBar";

export const topBarHeight = '48px';

export const Sidebar: FunctionComponent = () => {
    const [openedNodeIds, setOpenedNodeIds] = useState<string[]>([]);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const theme = useTheme();

    if (!rootDirectory) {
        return <EmptyDirectoryExplorer />;
    }

    const handleCollapseAllClick = () => setOpenedNodeIds([]);

    return <Box id='Sidebar'
        sx={{
            height: '100%',
            overflow: 'hidden',
            minWidth: '200px',
            maxWidth: '250px',
        }}>

        <Box sx={{ pl: 0.5, pr: 0.5, height: topBarHeight, display: 'flex', alignItems: 'center' }}>
            <Typography title={`Explorer: ${rootDirectory.name}`}
                sx={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Explorer: {rootDirectory.name}
            </Typography>

            <ActionsBar handleCollapseAllClick={handleCollapseAllClick} openedNodeIds={openedNodeIds} />
        </Box>

        <Box sx={{ height: `calc(100% - ${topBarHeight})`, borderTop: `1px solid ${theme.palette.text.disabled}` }}>
            <DirectoryExplorer openedNodeIds={openedNodeIds} setOpenedNodeIds={setOpenedNodeIds} />
        </Box>
    </Box>
}