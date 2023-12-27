import React, {Fragment, FunctionComponent, useEffect} from "react";
import {TreeItem} from "@mui/x-tree-view";
import {Box, Typography} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {ProjectStructure} from "./entity/ProjectStructure";
import {ProjectTreeItemLoader} from "./ProjectTreeItemLoader";

export const ProjectTreeItem: FunctionComponent<ProjectTreeItemProps> = props => {
    useEffect(() => {
        if (!props.projectStructure.hasOwnProperty(props.path)) {
            props.scanFolder(props.path, props.handler);
        }
    }, [props.projectStructure, props.path])

    if (!props.projectStructure.hasOwnProperty(props.path)) {
        return <ProjectTreeItemLoader path={props.path}/>
    }

    return <Fragment>
        {props.projectStructure[props.path].map(item =>
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
                {item.kind === 'directory' &&
                    <ProjectTreeItem path={props.path + item.name + "/"}
                                     handler={item}
                                     projectStructure={props.projectStructure}
                                     scanFolder={props.scanFolder}/>}
            </TreeItem>
        )}
    </Fragment>;
}

export interface ProjectTreeItemProps {
    path: string;
    handler: FileSystemDirectoryHandle;
    projectStructure: ProjectStructure;
    scanFolder: (path: string, dirHandle: FileSystemDirectoryHandle) => void;
}