import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {DirectoryUtils} from "../../book/DirectoryUtils";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";

export const DeleteDialog: FunctionComponent<DeleteDialogProps> = props => {
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const dispatch = useDispatch<AppDispatch>();
    const {selectedTreeItem, open, onClose} = props;

    const deleteFile = async () => {
        onClose();

        if (!selectedTreeItem) {
            return;
        }

        const parentPath = DirectoryUtils.getParent(selectedTreeItem.path);
        const parentHandler = directoryStructure[parentPath].handler;

        parentHandler.removeEntry(selectedTreeItem.handler.name, {recursive: true})
            .then(_ => {
                dispatch(scanProjectDirectory({path: parentPath, dirHandle: parentHandler}))
            });
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete {selectedTreeItem?.handler.kind === 'directory' ? 'folder' : 'file'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Do you want to
                delete {selectedTreeItem?.handler.kind === 'directory' ? 'folder' : 'file'} "{selectedTreeItem?.path}"?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => deleteFile()}>Delete</Button>
        </DialogActions>
    </Dialog>;
}

export interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    selectedTreeItem: { path: string, handler: FileSystemHandle } | null;
}