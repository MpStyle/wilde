import { Box, Typography, useTheme } from "@mui/material";
import { Fragment, FunctionComponent, useState } from 'react';
import { useSelector } from "react-redux";
import { AppState } from "../../store/AppStore";
import { ActionsBar } from "./ActionsBar";
import { DirectoryExplorer } from './DirectoryExplorer';
import { EmptyDirectoryExplorer } from "./EmptyDirectoryExplorer";

export const topBarHeight = '40px';

export const Sidebar: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const [openedNodeIds, setOpenedNodeIds] = useState<string[]>([]);
    const theme = useTheme();
    const handleCollapseAllClick = () => setOpenedNodeIds([]);

    const sidebarContent = () => {
        if (!rootDirectory) {
            return <EmptyDirectoryExplorer />;
        }

        return <Fragment>
            <Box sx={{
                height: topBarHeight, display: 'flex', alignItems: 'center',
                pl: 1,
                pr: 1,
            }}>
                <Typography sx={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Explorer:
                </Typography>

                <ActionsBar handleCollapseAllClick={handleCollapseAllClick} openedNodeIds={openedNodeIds} />
            </Box>

            <Box sx={{
                borderTop: `1px solid ${theme.palette.grey[400]}`,
                pt: 1,
                height: `calc(100% - ${topBarHeight})`,
            }}>
                <DirectoryExplorer openedNodeIds={openedNodeIds} setOpenedNodeIds={setOpenedNodeIds} />
            </Box>
        </Fragment>;
    }

    return <Box id='Sidebar'
        sx={{
            height: '100%',
            overflow: 'hidden',
            width: '260px',
            maxWidth: '550px',
            backgroundColor: theme.palette.grey[200],
            '& > *': {
                fontSize: '0.9em'
            }
        }}>

        {sidebarContent()}
    </Box>
}