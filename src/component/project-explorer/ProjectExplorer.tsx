import React, {Fragment, FunctionComponent, useEffect, useState} from "react";
import {TreeItem, TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {Box, ButtonGroup, IconButton, Typography} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const ProjectExplorer: FunctionComponent<ProjectExplorerProps> = () => {
    const [projectItems, setProjectItems] = useState<{
        [path: string]: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
    }>({});
    const [root, setRoot] = useState<FileSystemDirectoryHandle | undefined>(undefined)
    const [expanded, setExpanded] = React.useState<string[]>([]);

    const handleCollapseAllClick = () => {
        setExpanded([]);
    };

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const addFolder = async (path: string, dirHandle: FileSystemDirectoryHandle) => {
        const values: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
        console.log("Index", path);

        for await (const value of dirHandle.values()) {
            values.push(value);
        }

        setProjectItems(projectItems => ({
            ...projectItems,
            [path]: values
        }));
    }

    const openFolder = async () => {
        const dirHandle = await window.showDirectoryPicker();
        setRoot(dirHandle);
        await addFolder("/", dirHandle);
    }

    const Folder: FunctionComponent<{ path: string, handler: FileSystemDirectoryHandle }> = props => {
        console.log("Render", props.path);

        useEffect(() => {
            if (!projectItems.hasOwnProperty(props.path)) {
                addFolder(props.path, props.handler);
            }
        }, [projectItems, props.path])

        if (!projectItems.hasOwnProperty(props.path)) {
            return <TreeItem nodeId={props.path} label="Loading..."/>;
        }

        return <Fragment>
            {projectItems[props.path].map(item =>
                <TreeItem
                    nodeId={item.name}
                    label={<Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0,
                    }}>
                        <Box component={item.kind === "directory" ? FolderIcon : InsertDriveFileIcon}
                             color="inherit"
                             sx={{mr: 1}}/>
                        <Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>{item.name}</Typography>
                    </Box>}
                    key={props.path + "/" + item.name}>
                    {item.kind === 'directory' && <Folder path={props.path + item.name + "/"} handler={item}/>}
                </TreeItem>
            )}
        </Fragment>;
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
            {root && <Folder path="/" handler={root}/>}
        </TreeView>
    </Box>
}

export interface ProjectExplorerProps {
}