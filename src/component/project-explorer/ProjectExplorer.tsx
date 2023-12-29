import React, {Fragment, FunctionComponent, useState} from "react";
import {Box, ButtonGroup, IconButton} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {openProjectDirectory} from "../../slice/ProjectDirectorySlice";
import CloseIcon from '@mui/icons-material/Close';
import {SpeedTree} from "./SpeedTree";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {closeProjectDirectoryAction} from "../../action/CloseProjectDirectoryAction";

export const ProjectExplorer: FunctionComponent<ProjectExplorerProps> = () => {
    const [openedNodeIds, setOpenedNodeIds] = useState<string[]>([]);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const dispatch = useDispatch<AppDispatch>();

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

    return <Fragment>
        <ButtonGroup variant="text" aria-label="project explorer actions" size="small">
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
        </ButtonGroup>

        <Box sx={{height: 'calc(100% - 40px)'}}>
            {rootDirectory && <SpeedTree setOpenedNodeIds={setOpenedNodeIds} openedNodeIds={openedNodeIds}/>}
        </Box>
    </Fragment>
}

export interface ProjectExplorerProps {
}