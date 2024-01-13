import React, { FunctionComponent } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { DirectoryUtils } from "../../../book/DirectoryUtils";
import { scanProjectDirectory } from "../../../slice/ProjectDirectorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../store/AppStore";

export const DeleteFileDialog: FunctionComponent<DeleteDialogProps> = props => {
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const dispatch = useDispatch<AppDispatch>();
    const { selectedTreeItem, open, onClose } = props;

    const deleteFile = async () => {
        onClose();

        if (!selectedTreeItem) {
            return;
        }

        const parentPath = DirectoryUtils.getParent(selectedTreeItem.path);
        const parentHandle = directoryStructure[parentPath].handle;

        parentHandle.removeEntry(selectedTreeItem.handle.name, { recursive: true })
            .then(_ => {
                dispatch(scanProjectDirectory({ path: parentPath, dirHandle: parentHandle }))
            });
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete {selectedTreeItem?.handle.kind === 'directory' ? 'folder' : 'file'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Do you want to
                delete {selectedTreeItem?.handle.kind === 'directory' ? 'folder' : 'file'} "{selectedTreeItem?.path}"?
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
    selectedTreeItem: { path: string, handle: FileSystemHandle } | null;
}