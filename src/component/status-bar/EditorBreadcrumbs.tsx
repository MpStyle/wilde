import React, { Fragment, FunctionComponent, useState } from "react";
import { Box, Breadcrumbs, Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { FileIcon } from "../common/file-icon/FileIcon";
import { PathUtils } from "../../book/PathUtils";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store/AppStore";
import { FileSorter } from "../../book/FileSorter";
import { openEditor } from "../../slice/OpenEditorsSlice";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const EditorBreadcrumbs: FunctionComponent = () => {
    const currentEditor = useSelector((appState: AppState) => appState.openEditors.currentEditor);
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const rootDirectoryName = useSelector((appState: AppState) => appState.projectFolder.rootDirectory?.name);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
    const dispatch = useDispatch()

    if (!rootDirectoryName) {
        return null;
    }

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLSpanElement>, path: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedPath(path);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (handle: FileSystemFileHandle, path: string) => {
        dispatch(openEditor({ handle, path }));
        setAnchorEl(null);
    }

    const breadcrumbsParts = () => {
        if (!currentEditor) {
            return <Button sx={{ pt: 0, pb: 0, textTransform: 'none', minWidth: 'auto', fontSize: '1em' }}
                onClick={e => handleClick(e, PathUtils.rootPath)}
                key={`breadcrumbs-path-part-0`}
                component="button">
                {rootDirectoryName}
            </Button>;
        }

        const currentEditorPath = currentEditor.path.replace(PathUtils.rootPath, rootDirectoryName);
        const completePathParts = currentEditor.path.split(PathUtils.separator);
        const currentEditorPathParts = currentEditorPath.split(PathUtils.separator);

        return currentEditorPathParts.map((part, i) => {
            const isLast = i === currentEditorPathParts.length - 1;

            if (isLast) {
                return <Box component='span'
                    key={`breadcrumbs-path-part-${i}`}
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                    <FileIcon handle={currentEditor?.handle}
                        sx={{ mr: '0.25em' }}
                        size='small' /> {part}
                </Box>
            }

            return <Button sx={{ pt: 0, pb: 0, textTransform: 'none', minWidth: 'auto', fontSize: '1em' }}
                onClick={e => handleClick(e, PathUtils.combine(...(completePathParts.slice(0, i + 1))))}
                key={`breadcrumbs-path-part-${i}`}
                component="button">
                {part}
            </Button>;
        });
    }

    const selectedPathStructure = selectedPath && directoryStructure.hasOwnProperty(selectedPath) ? directoryStructure[selectedPath] : undefined;
    const selectedPathStructureContent = (selectedPathStructure?.content ?? []).filter(c => c.kind === 'file');

    selectedPathStructureContent.sort(FileSorter.byTypeByName);

    return <Fragment>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            {breadcrumbsParts()}
        </Breadcrumbs>

        {Boolean(selectedPathStructureContent.length) && <Menu id="path-menu"
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
                return <MenuItem onClick={() => handleItemClick(sps as FileSystemFileHandle, selectedPath!)}>
                    <ListItemIcon>
                        <FileIcon handle={sps}
                            sx={{ mr: '0.25em' }}
                            size='small' />
                    </ListItemIcon>
                    <ListItemText>{sps.name}</ListItemText>
                </MenuItem>
            })}
        </Menu>}
    </Fragment>;
}