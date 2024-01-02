import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {FunctionComponent, useState} from "react";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/AppStore";

export const NewDirectoryDialog: FunctionComponent<NewDirectoryDialogProps> = props => {
    const [newDirectoryName, setNewDirectoryName] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const {onClose, open, selectedTreeItem} = props;

    const createNewDirectory = () => {
        onClose();

        if (!selectedTreeItem || selectedTreeItem.handle.kind !== 'directory') {
            return;
        }

        const directoryHandle = selectedTreeItem.handle as FileSystemDirectoryHandle;

        directoryHandle.getDirectoryHandle(newDirectoryName, {create: true})
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: selectedTreeItem.path,
                    dirHandle: directoryHandle
                }));

                setNewDirectoryName('')
            });
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>New folder...</DialogTitle>
        <DialogContent>
            <TextField value={newDirectoryName}
                       onChange={e => setNewDirectoryName(e.target.value)}
                       autoFocus
                       margin="dense"
                       label="Folder name"
                       type="text"
                       fullWidth
                       variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => createNewDirectory()}>Create</Button>
        </DialogActions>
    </Dialog>;
}

export interface NewDirectoryDialogProps {
    open: boolean;
    onClose: () => void;
    selectedTreeItem: { path: string, handle: FileSystemHandle } | null;
}