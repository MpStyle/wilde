import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DirectoryUtils } from "../../../book/DirectoryUtils";
import { useWilde } from "../../../hook/WildeHook";
import { scanProjectDirectory } from "../../../slice/ProjectDirectorySlice";
import { AppDispatch, AppState } from "../../../store/AppStore";
import { PathUtils } from "../../../book/PathUtils";

export const DeleteFileDialog: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const fileHandleInfo = useSelector((appState: AppState) => appState.projectFolder.selectedProjectFile);
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();

    // onDeleteFile event listener
    useEffect(() => {
        const onDeleteFile = () => {
            setOpen(true);
        }

        wilde.addEventListener('onDeleteFile', onDeleteFile);

        return () => {
            wilde.removeEventListener('onDeleteFile', onDeleteFile);
        };
    });

    if (!fileHandleInfo) {
        return null;
    }

    const onClose = () => setOpen(false);

    const deleteFile = async () => {
        onClose();

        const parentPath = DirectoryUtils.getParent(fileHandleInfo.path);
        const parentHandle = directoryStructure[parentPath].handle;

        parentHandle.removeEntry(fileHandleInfo.handle.name, { recursive: true })
            .then(_ => {
                dispatch(scanProjectDirectory({ path: parentPath, dirHandle: parentHandle }))
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