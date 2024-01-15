import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileUtils } from "../../../book/FileUtils";
import { useWilde } from "../../../hook/WildeHook";
import { scanProjectDirectory } from "../../../slice/ProjectDirectorySlice";
import { AppDispatch, AppState } from "../../../store/AppStore";

export const NewFileDialog: FunctionComponent = () => {
    const parentFileHandleInfo = useSelector((appState: AppState) => appState.projectFolder.selectedProjectFile);
    const [newFileName, setNewFileName] = useState<string>('');
    const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();

    // onNewFile event listener
    useEffect(() => {
        const onNewFile = () => {
            setOpen(true);
        }

        wilde.addEventListener('onNewFile', onNewFile);

        return () => {
            wilde.removeEventListener('onNewFile', onNewFile);
        };
    });

    if (!parentFileHandleInfo) {
        return null;
    }

    const fileAlreadyExists = async (newName: string) => {
        const result = await (FileUtils.exists(parentFileHandleInfo.handle as FileSystemDirectoryHandle, newName)) && newName !== parentFileHandleInfo.handle.name;
        setAlreadyExists(result);
    }

    const onClose = () => {
        setOpen(false);
    }

    const createNewFile = () => {
        onClose();

        if (parentFileHandleInfo.handle.kind !== 'directory') {
            return;
        }

        const directoryHandle = parentFileHandleInfo.handle as FileSystemDirectoryHandle;

        directoryHandle.getFileHandle(newFileName, { create: true })
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: parentFileHandleInfo.path,
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