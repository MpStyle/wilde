import React, {createContext, Fragment, FunctionComponent, PropsWithChildren, useContext, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {DirectoryUtils} from "../../book/DirectoryUtils";

export interface DirectoryExplorerOptions {
    path: string;
    handler: FileSystemDirectoryHandle;
}

interface DirectoryExplorerContextActions {
    openContextMenu: (event: React.MouseEvent, options: DirectoryExplorerOptions) => void;
    openNewDirectoryDialog: (options?: DirectoryExplorerOptions) => void;
}

const DirectoryExplorerContext = createContext<DirectoryExplorerContextActions>({
    openContextMenu: () => {
    },
    openNewDirectoryDialog: () => {
    },
});

export const useDirectoryExplorerActions = () => useContext(DirectoryExplorerContext);

export const DirectoryExplorerProvider: FunctionComponent<PropsWithChildren> = props => {
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const [selectedTreeItem, setSelectedTreeItem] = useState<{
        path: string,
        handler: FileSystemHandle
    } | null>(null);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [isNewDirectoryDialogOpen, setIsNewDirectoryDialogOpen] = useState(false);
    const [newDirectoryName, setNewDirectoryName] = useState<string>('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const isContextMenuOpen = contextMenu !== null;

    const openContextMenu = (event: React.MouseEvent, options: DirectoryExplorerOptions) => {
        setSelectedTreeItem({path: options.path, handler: options.handler});
        event.preventDefault();
        setContextMenu(contextMenu === null ? {mouseX: event.clientX + 2, mouseY: event.clientY - 6,} : null);
    };
    const closeContextMenu = () => setContextMenu(null);

    const openNewDirectoryDialog = (options?: DirectoryExplorerOptions) => {
        if (options) {
            setSelectedTreeItem({path: options.path, handler: options.handler});
        }

        closeContextMenu();
        setIsNewDirectoryDialogOpen(true);
    }
    const closeNewDirectoryDialog = () => {
        setNewDirectoryName('');
        setIsNewDirectoryDialogOpen(false);
    }

    const createNewDirectory = (directoryName: string) => {
        closeNewDirectoryDialog();

        if (!selectedTreeItem || selectedTreeItem.handler.kind !== 'directory') {
            return;
        }

        const directoryHandle = selectedTreeItem.handler as FileSystemDirectoryHandle;

        directoryHandle.getDirectoryHandle(directoryName, {create: true})
            .then(_ => {
                dispatch(scanProjectDirectory({
                    path: selectedTreeItem.path,
                    dirHandle: directoryHandle
                }));
            });
    }

    const openDeleteDialog = () => {
        closeContextMenu();
        setIsDeleteDialogOpen(true);
    }

    const deleteFile = async () => {
        closeDeleteDialog();

        if (!selectedTreeItem) {
            return;
        }

        const parentPath = DirectoryUtils.getParent(selectedTreeItem.path);
        const parentHandler = directoryStructure[parentPath].handler;

        parentHandler.removeEntry(selectedTreeItem.handler.name, {recursive: true})
            .then(_ => {
                dispatch(scanProjectDirectory({path: parentPath, dirHandle: parentHandler}))
            });
    }

    const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

    return <Fragment>
        <DirectoryExplorerContext.Provider value={{
            openContextMenu,
            openNewDirectoryDialog,
        }}>
            {props.children}
        </DirectoryExplorerContext.Provider>

        <Menu open={isContextMenuOpen}
              onClose={closeContextMenu}
              anchorReference="anchorPosition"
              anchorPosition={
                  contextMenu !== null
                      ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                      : undefined
              }>
            <MenuItem onClick={() => openNewDirectoryDialog()}>New folder...</MenuItem>
            <MenuItem onClick={() => openDeleteDialog()}>Delete</MenuItem>
        </Menu>

        <Dialog open={isNewDirectoryDialogOpen} onClose={closeNewDirectoryDialog}>
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
                <Button onClick={closeNewDirectoryDialog}>Cancel</Button>
                <Button onClick={() => createNewDirectory(newDirectoryName)}>Create</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
            <DialogTitle>Delete {selectedTreeItem?.handler.kind === 'directory' ? 'folder' : 'file'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to
                    delete {selectedTreeItem?.handler.kind === 'directory' ? 'folder' : 'file'} "{selectedTreeItem?.path}"?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteDialog}>Cancel</Button>
                <Button onClick={() => deleteFile()}>Delete</Button>
            </DialogActions>
        </Dialog>
    </Fragment>;
}
