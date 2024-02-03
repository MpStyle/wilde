import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DirectoryUtils } from "../../../book/DirectoryUtils";
import { WildeDeleteEvent, useWilde } from "../../../hook/WildeHook";
import { scanDirectoryRequest } from "../../../slice/OpenedDirectorySlice";
import { AppDispatch, AppState } from "../../../store/AppStore";
import { PathUtils } from "../../../book/PathUtils";
import { closeEditor, fileEditorInfoBuilder } from "../../../slice/OpenEditorsSlice";
import { FileHandleInfo } from "../../../entity/FileHandleInfo";

export const DeleteFileDialog: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.openedDirectory.rootDirectory);
    const directoryStructure = useSelector((appState: AppState) => appState.openedDirectory.directoryStructure);
    const [open, setOpen] = useState<boolean>(false);
    const [fileHandleInfo, setFileHandleInfo] = useState<FileHandleInfo | undefined>(undefined);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();

    // onDeleteFile event listener
    useEffect(() => {
        const onDeleteFile = (event: WildeDeleteEvent) => {
            setOpen(true);
            setFileHandleInfo(event.fileHandleInfo);
        }

        wilde.subscribeTo(wilde.eventType.onDeleteFile, onDeleteFile);

        return () => {
            wilde.unsubscribeFrom(wilde.eventType.onDeleteFile, onDeleteFile);
        };
    });

    if (!fileHandleInfo || !fileHandleInfo.handle || !fileHandleInfo.path) {
        return null;
    }

    const onClose = () => setOpen(false);

    const deleteFile = async () => {
        onClose();

        const parentPath = DirectoryUtils.getParent(fileHandleInfo.path);
        const parentHandle = directoryStructure[parentPath].handle;

        parentHandle.removeEntry(fileHandleInfo.handle.name, { recursive: true })
            .then(_ => {
                if (fileHandleInfo.handle.kind === 'file') {
                    dispatch(closeEditor(fileEditorInfoBuilder(fileHandleInfo.path, fileHandleInfo.handle as FileSystemFileHandle)))
                }

                dispatch(scanDirectoryRequest({ path: parentPath, dirHandle: parentHandle }))
            });
    }

    let filePath = fileHandleInfo.path;
    if (filePath.startsWith(`${PathUtils.rootPath}${PathUtils.separator}`) && rootDirectory) {
        filePath = filePath.replace(`${PathUtils.rootPath}${PathUtils.separator}`, `${rootDirectory.name}${PathUtils.separator}`);
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete {fileHandleInfo.handle.kind === 'directory' ? 'folder' : 'file'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Do you want to
                delete {fileHandleInfo.handle.kind === 'directory' ? 'folder' : 'file'} "{filePath}"?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => deleteFile()}>Delete</Button>
        </DialogActions>
    </Dialog>;
}