import React, {Fragment, FunctionComponent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store/AppStore";
import {Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@mui/material";
import {PathUtils} from "../../book/PathUtils";
import {FileIcon} from "../core/FileIcon";
import {FileSorter} from "../../book/FileSorter";
import {openEditor} from "../../slice/OpenEditorsSlice";

export const StatusBar: FunctionComponent = () => {
    const currentEditor = useSelector((appState: AppState) => appState.openEditors.currentEditor);
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const rootDirectoryName = useSelector((appState: AppState) => appState.projectFolder.rootDirectory?.name);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
    const dispatch=useDispatch()

    if (!rootDirectoryName || !currentEditor) {
        return null;
    }

    const completePath = PathUtils.combine(currentEditor.path, currentEditor.handle.name);
    const currentEditorPath = completePath.replace(".", rootDirectoryName);
    const completePathParts = completePath.split(PathUtils.separator);
    const currentEditorPathParts = currentEditorPath.split(PathUtils.separator);
    const selectedPathStructure = selectedPath && directoryStructure.hasOwnProperty(selectedPath) ? directoryStructure[selectedPath] : undefined;
    const selectedPathStructureContent = (selectedPathStructure?.content ?? []).filter(c => c.kind === 'file');

    selectedPathStructureContent.sort(FileSorter.byTypeByName);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLSpanElement>, path: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedPath(path);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (handle: FileSystemFileHandle, path: string)=>{
        dispatch(openEditor({ handle, path }));
        setAnchorEl(null);
    }

    return <Fragment>
        <Typography sx={{display: 'flex'}}>
            {currentEditorPathParts.map((part, i) => {
                const isLast = i === currentEditorPathParts.length - 1;

                if (isLast) {
                    return <Box component='span'
                                key={`status-bar-path-part-${i}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                        <FileIcon handle={currentEditor?.handle}
                                  sx={{mr: '0.25em'}}
                                  size='small'/> {part}
                    </Box>
                }

                return <Box component='span'
                            key={`status-bar-path-part-${i}`}
                            sx={{
                                cursor: 'pointer'
                            }}>
                    <Button sx={{pt: 0, pb: 0, textTransform: 'none', minWidth: 'auto'}}
                            onClick={e => handleClick(e, PathUtils.combine(...(completePathParts.slice(0, i + 1))))}
                            variant="text">
                        {part}
                    </Button>
                    <Box component='span' sx={{pl: '0.5em', pr: '0.5em'}}>&gt;</Box>
                </Box>;
            })}
        </Typography>

        {(selectedPathStructureContent.length) && <Menu id="path-menu"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        }}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'path-menu',
                                                        }}>
            {selectedPathStructureContent.map(sps => {
                return <MenuItem onClick={()=>handleItemClick(sps as FileSystemFileHandle, selectedPath!)}>
                    <ListItemIcon>
                        <FileIcon handle={sps}
                                  sx={{mr: '0.25em'}}
                                  size='small'/>
                    </ListItemIcon>
                    <ListItemText>{sps.name}</ListItemText>
                </MenuItem>
            })}
        </Menu>}
    </Fragment>
}