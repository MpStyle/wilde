import React, {Fragment, FunctionComponent, useState} from "react";
import {Box, ButtonGroup, IconButton, useTheme} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {closeProjectDirectory, openProjectDirectory} from "../../slice/ProjectDirectorySlice";
import CloseIcon from '@mui/icons-material/Close';
import {DirectoryTree} from "./DirectoryTree";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
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
            dispatch(closeProjectDirectory());
            dispatch(openProjectDirectory(dirHandle));
        } catch (e) {
            console.error(e);
        }
    }

    const handleCloseProjectDirectory = async () => dispatch(closeProjectDirectory());

    const handleCollapseAllClick = () => setOpenedNodeIds([]);

    const ActionsBar: FunctionComponent = () => {
        const actions = useDirectoryExplorerActions();

        return <ButtonGroup variant="text"
                            sx={{height: topBarHeight}}
                            aria-label="project explorer actions"
                            size="small">
            {!rootDirectory && <IconButton title="Open folder"
                                           onClick={() => selectProjectDirectory()}>
                <FolderOpenIcon/>
            </IconButton>}
            {rootDirectory && <Fragment>
                <IconButton title="New File..."
                            onClick={() => actions.openNewFileDialog({
                                path: '.',
                                handler: rootDirectory
                            })}>
                    <NoteAddIcon/>
                </IconButton>
                <IconButton title="New folder..."
                            onClick={() => actions.openNewDirectoryDialog({
                                path: '.',
                                handler: rootDirectory
                            })}>
                    <CreateNewFolderIcon/>

                </IconButton>
                <IconButton title="Collapse all"
                            onClick={() => handleCollapseAllClick()}>
                    <UnfoldLessIcon/>
                </IconButton>
                <IconButton title="Close folder"
                            onClick={() => handleCloseProjectDirectory()}>
                    <CloseIcon/>
                </IconButton>
            </Fragment>}
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