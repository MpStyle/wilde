import React, {createContext, Fragment, FunctionComponent, PropsWithChildren, useContext, useState} from "react";
import {DirectoryExplorerContextMenu} from "./DirectoryExplorerContextMenu";
import {NewDirectoryDialog} from "./NewDirectoryDialog";
import {NewFileDialog} from "./NewFileDialog";
import {DeleteDialog} from "./DeleteDialog";

export interface DirectoryExplorerOptions {
    path: string;
    handler: FileSystemHandle;
}

interface DirectoryExplorerContextActions {
    openContextMenu: (event: React.MouseEvent, options: DirectoryExplorerOptions) => void;
    openNewDirectoryDialog: (options?: DirectoryExplorerOptions) => void;
    openNewFileDialog: (options?: DirectoryExplorerOptions) => void;
}

const DirectoryExplorerContext = createContext<DirectoryExplorerContextActions>({
    openContextMenu: () => {
    },
    openNewDirectoryDialog: () => {
    },
    openNewFileDialog: () => {
    }
});

export const useDirectoryExplorerActions = () => useContext(DirectoryExplorerContext);

export const DirectoryExplorerProvider: FunctionComponent<PropsWithChildren> = props => {
    const [selectedTreeItem, setSelectedTreeItem] = useState<{
        path: string,
        handler: FileSystemHandle
    } | null>(null);

    //#region Context menu
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const isContextMenuOpen = contextMenu !== null;

    const openContextMenu = (event: React.MouseEvent, options: DirectoryExplorerOptions) => {
        setSelectedTreeItem({path: options.path, handler: options.handler});
        event.preventDefault();
        setContextMenu(contextMenu === null ? {mouseX: event.clientX + 2, mouseY: event.clientY - 6,} : null);
    };
    const closeContextMenu = () => setContextMenu(null);
    //#endregion

    //#region New directory
    const [isNewDirectoryDialogOpen, setIsNewDirectoryDialogOpen] = useState(false);

    const openNewDirectoryDialog = (options?: DirectoryExplorerOptions) => {
        if (options) {
            setSelectedTreeItem({path: options.path, handler: options.handler});
        }

        closeContextMenu();
        setIsNewDirectoryDialogOpen(true);
    }
    const closeNewDirectoryDialog = () => setIsNewDirectoryDialogOpen(false);
    //#endregion

    //#region New file
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);

    const openNewFileDialog = (options?: DirectoryExplorerOptions) => {
        if (options) {
            setSelectedTreeItem({path: options.path, handler: options.handler});
        }

        closeContextMenu();
        setIsNewFileDialogOpen(true);
    }

    const closeNewFileDialog = () => setIsNewFileDialogOpen(false);
    //#endregion

    //#region Delete file
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const openDeleteDialog = () => {
        closeContextMenu();
        setIsDeleteDialogOpen(true);
    }

    const closeDeleteDialog = () => setIsDeleteDialogOpen(false);
    //#endregion

    return <Fragment>
        <DirectoryExplorerContext.Provider value={{
            openContextMenu,
            openNewDirectoryDialog,
            openNewFileDialog
        }}>
            {props.children}
        </DirectoryExplorerContext.Provider>

        <DirectoryExplorerContextMenu open={isContextMenuOpen}
                                      position={contextMenu}
                                      onClose={closeContextMenu}
                                      selectedTreeItemKind={selectedTreeItem?.handler.kind}
                                      openNewFileDialog={openNewFileDialog}
                                      openNewDirectoryDialog={openNewDirectoryDialog}
                                      openDeleteDialog={openDeleteDialog}/>

        <NewDirectoryDialog open={isNewDirectoryDialogOpen}
                            onClose={closeNewDirectoryDialog}
                            selectedTreeItem={selectedTreeItem}/>

        <NewFileDialog open={isNewFileDialogOpen}
                       onClose={closeNewFileDialog}
                       selectedTreeItem={selectedTreeItem}/>

        <DeleteDialog open={isDeleteDialogOpen}
                      onClose={closeDeleteDialog}
                      selectedTreeItem={selectedTreeItem}/>
    </Fragment>;
}
