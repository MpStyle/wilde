import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DirectoryUtils } from "../../../book/DirectoryUtils";
import { useWilde } from "../../../hook/WildeHook";
import { scanDirectoryRequest } from "../../../slice/OpenedDirectorySlice";
import { AppDispatch, AppState } from "../../../store/AppStore";

export const NewDirectoryDialog: FunctionComponent = () => {
    const parentFileHandleInfo = useSelector((appState: AppState) => appState.openedDirectory.selectedFile);
    const directoryStructure = useSelector((appState: AppState) => appState.openedDirectory.directoryStructure);
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

        wilde.subscribeTo(wilde.eventType.onNewDirectory, onNewDirectory);

        return () => {
            wilde.unsubscribeFrom(wilde.eventType.onNewDirectory, onNewDirectory);
        };
    });

    if (!parentFileHandleInfo) {
        return null;
    }

    const parentPath = parentFileHandleInfo.handle.kind === 'directory' ? parentFileHandleInfo.path : DirectoryUtils.getParent(parentFileHandleInfo.path);
    const parentDirectoryHandle = (parentFileHandleInfo.handle.kind === 'directory' ? parentFileHandleInfo.handle : directoryStructure[parentPath].handle) as FileSystemDirectoryHandle;

    const directoryAlreadyExists = async (newName: string) => {
        const result = await (DirectoryUtils.exists(parentDirectoryHandle, newName)) && newName !== parentDirectoryHandle.name;
        setAlreadyExists(result);
    }

    const onClose = () => {
        setOpen(false);
    }

    const createNewDirectory = () => {
        setNewDirectoryName('');
        onClose();

        parentDirectoryHandle.getDirectoryHandle(newDirectoryName, { create: true })
            .then(_ => {
                dispatch(scanDirectoryRequest({
                    path: parentPath,
                    dirHandle: parentDirectoryHandle
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