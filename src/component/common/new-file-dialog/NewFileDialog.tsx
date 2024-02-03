import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileUtils } from "../../../book/FileUtils";
import { useWilde } from "../../../hook/WildeHook";
import { scanDirectoryRequest } from "../../../slice/OpenedDirectorySlice";
import { AppDispatch, AppState } from "../../../store/AppStore";
import { DirectoryUtils } from "../../../book/DirectoryUtils";

export const NewFileDialog: FunctionComponent = () => {
    const parentFileHandleInfo = useSelector((appState: AppState) => appState.openedDirectory.selectedFile);
    const directoryStructure = useSelector((appState: AppState) => appState.openedDirectory.directoryStructure);
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

        wilde.subscribeTo(wilde.eventType.onNewFile, onNewFile);

        return () => {
            wilde.unsubscribeFrom(wilde.eventType.onNewFile, onNewFile);
        };
    });

    if (!parentFileHandleInfo) {
        return null;
    }

    const parentPath = parentFileHandleInfo.handle.kind === 'directory' ? parentFileHandleInfo.path : DirectoryUtils.getParent(parentFileHandleInfo.path);
    const parentDirectoryHandle = (parentFileHandleInfo.handle.kind === 'directory' ? parentFileHandleInfo.handle : directoryStructure[parentPath].handle) as FileSystemDirectoryHandle;

    const fileAlreadyExists = async (newName: string) => {
        const result = await (FileUtils.exists(parentDirectoryHandle, newName)) && newName !== parentDirectoryHandle.name;
        setAlreadyExists(result);
    }

    const onClose = () => {
        setOpen(false);
    }

    const createNewFile = () => {
        onClose();

        parentDirectoryHandle.getFileHandle(newFileName, { create: true })
            .then(_ => {
                dispatch(scanDirectoryRequest({
                    path: parentPath,
                    dirHandle: parentDirectoryHandle
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