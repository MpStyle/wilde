import React, {FunctionComponent} from "react";
import {TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Box, ButtonGroup, IconButton} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {ProjectTreeItem} from "./ProjectTreeItem";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {closeProjectDirectory, openProjectDirectory} from "../../slice/ProjectDirectorySlice";
import CloseIcon from '@mui/icons-material/Close';
import {closeAllEditors} from "../../slice/OpenEditorsSlice";

export const ProjectExplorer: FunctionComponent<ProjectExplorerProps> = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    const handleCollapseAllClick = () => {
        setExpanded([]);
    };

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const selectProjectDirectory = async () => {
        const dirHandle = await window.showDirectoryPicker();
        dispatch(openProjectDirectory(dirHandle));
    }

    const handleCloseProjectDirectory = async () => {
        dispatch(closeAllEditors());
        dispatch(closeProjectDirectory());
    }

    return <Box>
        <ButtonGroup variant="contained" aria-label="outlined primary button group" size="small">
            <IconButton title="Open folder" onClick={() => selectProjectDirectory()}><FolderOpenIcon/></IconButton>
            {rootDirectory && <IconButton title="Collapse all" onClick={() => handleCollapseAllClick()}><UnfoldLessIcon/></IconButton>}
            {rootDirectory && <IconButton title="Collapse all" onClick={() => handleCloseProjectDirectory()}><CloseIcon/></IconButton>}
        </ButtonGroup>

        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            expanded={expanded}
            onNodeToggle={handleToggle}
            sx={{flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}>
            {rootDirectory && <ProjectTreeItem path="/" handler={rootDirectory}/>}
        </TreeView>
    </Box>
}

export interface ProjectExplorerProps {
}