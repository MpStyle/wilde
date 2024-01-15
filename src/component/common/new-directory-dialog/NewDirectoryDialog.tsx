import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DirectoryUtils } from "../../../book/DirectoryUtils";
import { useWilde } from "../../../hook/WildeHook";
import { scanProjectDirectory } from "../../../slice/ProjectDirectorySlice";
import { AppDispatch, AppState } from "../../../store/AppStore";

export const NewDirectoryDialog: FunctionComponent = () => {
    const parentFileHandleInfo = useSelector((appState: AppState) => appState.projectFolder.selectedProjectFile);
    const [newDirectoryName, setNewDirectoryName] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();

    // onNewDirectory event listener
    useEffect(() => {
        const onNewDirectory = () => {
            setOpen(true);
        }

        wilde.addEventListener('onNewDirectory', onNewDirectory);

        return () => {
            wilde.removeEventListener('onNewDirectory', onNewDirectory);
        };
    });

    if (!parentFileHandleInfo) {
        return null;
    }

    const directoryAlreadyExists = async (newName: string) => {
        const result = await (DirectoryUtils.exists(parentFileHandleInfo.handle as FileSystemDirectoryHandle, newName)) && newName !== parentFileHandleInfo.handle.name;
        setAlreadyExists(result);
    }

    const onClose = () => {
        setOpen(false);
    }

    const createNewDirectory = () => {
        setNewDirectoryName('');
        onClose();

        if (parentFileHandleInfo.handle.kind !== 'directory') {
            return;
        }

        const directoryHandle = parentFileHandleInfo.handle as FileSystemDirectoryHandle;

        directoryHandle.getDirectoryHandle(newDirectoryName, { create: true })
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: parentFileHandleInfo.path,
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