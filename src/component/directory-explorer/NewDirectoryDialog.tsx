import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {FunctionComponent, useState} from "react";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/AppStore";
import {DirectoryUtils} from "../../book/DirectoryUtils";

export const NewDirectoryDialog: FunctionComponent<NewDirectoryDialogProps> = props => {
    const [newDirectoryName, setNewDirectoryName] = useState<string>('');
    const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const {onClose, open, selectedTreeItem} = props;

    const directoryAlreadyExists = async (newName: string) => {
        const result = await (DirectoryUtils.exists(selectedTreeItem.handle as FileSystemDirectoryHandle, newName)) && newName !== selectedTreeItem.handle.name;
        setAlreadyExists(result);
    }

    const createNewDirectory = () => {
        setNewDirectoryName('');
        onClose();

        if (selectedTreeItem.handle.kind !== 'directory') {
            return;
        }

        const directoryHandle = selectedTreeItem.handle as FileSystemDirectoryHandle;

        directoryHandle.getDirectoryHandle(newDirectoryName, {create: true})
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: selectedTreeItem.path,
                    dirHandle: directoryHandle
                }));

                setNewDirectoryName('');
            });
    }

    return <Dialog open={open}
                   onClose={() => {
                       onClose();
                       setNewDirectoryName('');
                   }}
                   disableRestoreFocus>
        <DialogTitle>New folder...</DialogTitle>
        <DialogContent>
            <TextField value={newDirectoryName}
                       onChange={e => {
                           setNewDirectoryName(e.target.value);
                           directoryAlreadyExists(e.target.value);
                       }}
                       autoFocus
                       margin="dense"
                       label="Folder name"
                       type="text"
                       fullWidth
                       error={alreadyExists}
                       helperText={alreadyExists ? 'Filename already used' : undefined}
                       variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                onClose();
                setNewDirectoryName('');
            }}>
                Cancel
            </Button>
            <Button onClick={() => createNewDirectory()}
                    disabled={alreadyExists}>
                Create
            </Button>
        </DialogActions>
    </Dialog>;
}

export interface NewDirectoryDialogProps {
    open: boolean;
    onClose: () => void;
    selectedTreeItem: { path: string, handle: FileSystemHandle };
}