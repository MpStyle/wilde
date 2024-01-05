import React, {FunctionComponent, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/AppStore";
import {FileUtils} from "../../book/FileUtils";

export const NewFileDialog: FunctionComponent<NewFileDialogProps> = props => {
    const [newFileName, setNewFileName] = useState<string>('');
    const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const {onClose, open, selectedTreeItem} = props;

    const fileAlreadyExists = async (newName: string) => {
        const result = await (FileUtils.exists(selectedTreeItem.handle as FileSystemDirectoryHandle, newName)) && newName !== selectedTreeItem.handle.name;
        setAlreadyExists(result);
    }

    const createNewFile = () => {
        onClose();

        if (selectedTreeItem.handle.kind !== 'directory') {
            return;
        }

        const directoryHandle = selectedTreeItem.handle as FileSystemDirectoryHandle;

        directoryHandle.getFileHandle(newFileName, {create: true})
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: selectedTreeItem.path,
                    dirHandle: directoryHandle
                }));

                setNewFileName('');
            });
    }

    return <Dialog open={open}
                   onClose={() => {
                       onClose();
                       setNewFileName('');
                   }}
                   disableRestoreFocus>
        <DialogTitle>New File...</DialogTitle>
        <DialogContent>
            <TextField value={newFileName}
                       onChange={e => {
                           setNewFileName(e.target.value);
                           fileAlreadyExists(e.target.value);
                       }}
                       autoFocus
                       margin="dense"
                       label="File name"
                       type="text"
                       fullWidth
                       error={alreadyExists}
                       helperText={alreadyExists ? 'Filename already used' : undefined}
                       variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => createNewFile()}
                    disabled={alreadyExists}>
                Create
            </Button>
        </DialogActions>
    </Dialog>
}

export interface NewFileDialogProps {
    open: boolean;
    onClose: () => void;
    selectedTreeItem: { path: string, handle: FileSystemHandle };
}