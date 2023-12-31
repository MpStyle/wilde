import React, {FunctionComponent, useState} from "react";
import {Box, ButtonGroup, IconButton, useTheme} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {openProjectDirectory} from "../../slice/ProjectDirectorySlice";
import CloseIcon from '@mui/icons-material/Close';
import {DirectoryTree} from "./DirectoryTree";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {closeProjectDirectoryAction} from "../../action/CloseProjectDirectoryAction";
import {DirectoryExplorerProvider, useDirectoryExplorerActions} from "./DirectoryExplorerContext";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

export const DirectoryExplorer: FunctionComponent<ProjectExplorerProps> = () => {
    const [openedNodeIds, setOpenedNodeIds] = useState<string[]>([]);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const topBarHeight = '48px';

    const selectProjectDirectory = async () => {
        try {
            const dirHandle = await window.showDirectoryPicker();
            closeProjectDirectoryAction(dispatch);
            dispatch(openProjectDirectory(dirHandle));
        } catch (e) {
            console.error(e);
        }
    }

    const handleCloseProjectDirectory = async () => {
        closeProjectDirectoryAction(dispatch);
    }

    const handleCollapseAllClick = () => {
        setOpenedNodeIds([]);
    };

    const ActionsBar: FunctionComponent = () => {
        const actions = useDirectoryExplorerActions();

        return <ButtonGroup variant="text"
                            sx={{height: topBarHeight}}
                            aria-label="project explorer actions"
                            size="small">
            <IconButton title="Open folder"
                        onClick={() => selectProjectDirectory()}>
                <FolderOpenIcon/>
            </IconButton>
            {rootDirectory && <IconButton title="Collapse all"
                                          onClick={() => handleCollapseAllClick()}>
                <UnfoldLessIcon/>
            </IconButton>}
            {rootDirectory && <IconButton title="Collapse all"
                                          onClick={() => handleCloseProjectDirectory()}>
                <CloseIcon/>
            </IconButton>}
            {rootDirectory && <IconButton title="New folder..."
                                          onClick={() => actions.openNewDirectoryDialog({
                                              path: '.',
                                              handler: rootDirectory
                                          })}>
                <CreateNewFolderIcon/>
            </IconButton>}
            {rootDirectory && <IconButton title="New File..."
                                          onClick={() => actions.openNewFileDialog({
                                              path: '.',
                                              handler: rootDirectory
                                          })}>
                <NoteAddIcon/>
            </IconButton>}
        </ButtonGroup>;
    };

    return <DirectoryExplorerProvider>
        <ActionsBar/>

        <Box sx={{height: `calc(100% - ${topBarHeight})`, borderTop: `1px solid ${theme.palette.text.disabled}`}}>
            {rootDirectory && <DirectoryTree setOpenedNodeIds={setOpenedNodeIds} openedNodeIds={openedNodeIds}/>}
        </Box>
    </DirectoryExplorerProvider>
}

export interface ProjectExplorerProps {
}