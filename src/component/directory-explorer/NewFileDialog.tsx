import React, {FunctionComponent, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/AppStore";

export const NewFileDialog: FunctionComponent<NewFileDialogProps> = props => {
    const [newFileName, setNewFileName] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const {onClose, open, selectedTreeItem} = props;

    const createNewFile = () => {
        onClose();

        if (!selectedTreeItem || selectedTreeItem.handler.kind !== 'directory') {
            return;
        }

        const directoryHandle = selectedTreeItem.handler as FileSystemDirectoryHandle;

        directoryHandle.getFileHandle(newFileName, {create: true})
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: selectedTreeItem.path,
                    dirHandle: directoryHandle
                }));

                setNewFileName('');
            });
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>New File...</DialogTitle>
        <DialogContent>
            <TextField value={newFileName}
                       onChange={e => setNewFileName(e.target.value)}
                       autoFocus
                       margin="dense"
                       label="File name"
                       type="text"
                       fullWidth
                       variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => createNewFile()}>Create</Button>
        </DialogActions>
    </Dialog>
}

export interface NewFileDialogProps {
    open: boolean;
    onClose: () => void;
    selectedTreeItem: { path: string, handler: FileSystemHandle } | null;
}