import React, {Fragment, FunctionComponent, useEffect} from "react";
import {TreeItem} from "@mui/x-tree-view";
import {Box, Typography} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {ProjectTreeItemLoader} from "./ProjectTreeItemLoader";
import {useDispatch, useSelector} from "react-redux";
import {openEditor} from "../../slice/OpenEditorsSlice";
import {AppDispatch, AppState} from "../../store/AppStore";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";

const requestedPaths: string[] = [];

export const ProjectTreeItem: FunctionComponent<ProjectTreeItemProps> = props => {
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!directoryStructure.hasOwnProperty(props.path) && !requestedPaths.includes(props.path)) {
            requestedPaths.push(props.path);
            dispatch(scanProjectDirectory({path: props.path, dirHandle: props.handler}));
        }
    }, [directoryStructure, props.path])

    if (!directoryStructure.hasOwnProperty(props.path)) {
        return <ProjectTreeItemLoader path={props.path}/>
    }

    return <Fragment>
        {directoryStructure[props.path].map(item =>
            <TreeItem
                onClick={() => {
                    if (item.kind === "file") {
                        dispatch(openEditor({path: props.path, fileName: item.name}));
                    }
                }}
                nodeId={props.path + item.name}
                key={props.path + item.name}
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
                </Box>}>
                {item.kind === 'directory' &&
                    <ProjectTreeItem path={props.path + item.name + "/"}
                                     handler={item}/>}
            </TreeItem>
        )}
    </Fragment>;
}

export interface ProjectTreeItemProps {
    path: string;
    handler: FileSystemDirectoryHandle;
}