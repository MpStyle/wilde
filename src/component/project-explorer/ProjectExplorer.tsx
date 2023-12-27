import React, {FunctionComponent, useState} from "react";
import {TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Box, ButtonGroup, IconButton} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {ProjectStructure} from "./entity/ProjectStructure";
import {ProjectTreeItem} from "./ProjectTreeItem";

export const ProjectExplorer: FunctionComponent<ProjectExplorerProps> = () => {
    const [projectStructure, setProjectStructure] = useState<ProjectStructure>({});
    const [root, setRoot] = useState<FileSystemDirectoryHandle | undefined>(undefined)
    const [expanded, setExpanded] = React.useState<string[]>([]);

    const handleCollapseAllClick = () => {
        setExpanded([]);
    };

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const scanFolder = async (path: string, dirHandle: FileSystemDirectoryHandle) => {
        const values: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];

        for await (const value of dirHandle.values()) {
            values.push(value);
        }

        setProjectStructure(projectItems => ({
            ...projectItems,
            [path]: values
        }));
    }

    const openFolder = async () => {
        const dirHandle = await window.showDirectoryPicker();
        setRoot(dirHandle);
        await scanFolder("/", dirHandle);
    }

    return <Box>
        <ButtonGroup variant="contained" aria-label="outlined primary button group" size="small">
            <IconButton title="Open folder" onClick={() => openFolder()}><FolderOpenIcon/></IconButton>
            <IconButton title="Collapse all" onClick={() => handleCollapseAllClick()}><UnfoldLessIcon/></IconButton>
        </ButtonGroup>

        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            expanded={expanded}
            onNodeToggle={handleToggle}
            sx={{flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}>
            {root && <ProjectTreeItem path="/" handler={root} projectStructure={projectStructure} scanFolder={scanFolder}/>}
        </TreeView>
    </Box>
}

export interface ProjectExplorerProps {
}