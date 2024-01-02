import React, {Fragment, FunctionComponent, useState} from "react";
import {Box, ButtonGroup, IconButton, Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {closeProjectDirectory} from "../../slice/ProjectDirectorySlice";
import CloseIcon from '@mui/icons-material/Close';
import {DirectoryTree} from "./DirectoryTree";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {DirectoryExplorerProvider, useDirectoryExplorerActions} from "./DirectoryExplorerContext";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {EmptyDirectoryExplorer} from "./EmptyDirectoryExplorer";

export const DirectoryExplorer: FunctionComponent<ProjectExplorerProps> = () => {
    const [openedNodeIds, setOpenedNodeIds] = useState<string[]>([]);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const topBarHeight = '48px';

    const handleCloseProjectDirectory = async () => dispatch(closeProjectDirectory());

    const handleCollapseAllClick = () => setOpenedNodeIds([]);

    if (!rootDirectory) {
        return <EmptyDirectoryExplorer/>;
    }

    const ActionsBar: FunctionComponent = () => {
        const actions = useDirectoryExplorerActions();

        return <ButtonGroup variant="text"
                            aria-label="project explorer actions"
                            size="small">
            {rootDirectory && <Fragment>
                <IconButton title="New File..."
                            size="small"
                            onClick={() => actions.openNewFileDialog({
                                path: '.',
                                handle: rootDirectory
                            })}>
                    <NoteAddIcon fontSize="small"/>
                </IconButton>
                <IconButton title="New folder..."
                            size="small"
                            onClick={() => actions.openNewDirectoryDialog({
                                path: '.',
                                handle: rootDirectory
                            })}>
                    <CreateNewFolderIcon fontSize="small"/>
                </IconButton>
                <IconButton title="Collapse all"
                            size="small"
                            onClick={() => handleCollapseAllClick()}>
                    <UnfoldLessIcon fontSize="small"/>
                </IconButton>
                <IconButton title="Close folder"
                            size="small"
                            onClick={() => handleCloseProjectDirectory()}>
                    <CloseIcon fontSize="small"/>
                </IconButton>
            </Fragment>}
        </ButtonGroup>;
    };

    return <DirectoryExplorerProvider>
        <Box sx={{pl: 0.5, pr: 0.5, height: topBarHeight, display: 'flex', alignItems: 'center'}}>
            <Typography title={`Explorer: ${rootDirectory.name}`}
                        sx={{flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                Explorer: {rootDirectory.name}
            </Typography>

            <ActionsBar/>
        </Box>

        <Box sx={{height: `calc(100% - ${topBarHeight})`, borderTop: `1px solid ${theme.palette.text.disabled}`}}>
            {rootDirectory && <DirectoryTree setOpenedNodeIds={setOpenedNodeIds} openedNodeIds={openedNodeIds}/>}
        </Box>
    </DirectoryExplorerProvider>
}

export interface ProjectExplorerProps {
}