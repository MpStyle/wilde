import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { scanProjectDirectory } from "../../../slice/ProjectDirectorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/AppStore";
import { FileUtils } from "../../../book/FileUtils";
import { OnNewFileEvent, useWilde } from "../../../hook/WildeHook";
import { FileHandleInfo } from "../../../entity/FileHandleInfo";

export const NewFileDialog: FunctionComponent = () => {
    const [newFileName, setNewFileName] = useState<string>('');
    const [parentFileHandleInfo, setParentFileHandleInfo] = useState<FileHandleInfo | null>(null);
    const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();

    // onNewFile event listener
    useEffect(() => {
        const onNewFile = (event: OnNewFileEvent) => {
            setOpen(true);
            setParentFileHandleInfo(event.parentFileHandleInfo);
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