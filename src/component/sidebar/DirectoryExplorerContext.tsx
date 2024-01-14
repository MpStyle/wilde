import React, { createContext, Fragment, FunctionComponent, PropsWithChildren, useContext, useState } from "react";
import { FileHandleInfo } from "../../entity/FileHandleInfo";
import { DeleteFileDialog } from "../common/delete-file-dialog/DeleteFileDialog";
import { NewFileDialog } from "../common/new-file-dialog/NewFileDialog";
import { DirectoryExplorerContextMenu } from "./DirectoryExplorerContextMenu";

export interface DirectoryExplorerOptions {
    path: string;
    handle: FileSystemHandle;
}

interface DirectoryExplorerContextActions {
    openContextMenu: (event: React.MouseEvent, options: DirectoryExplorerOptions) => void;
}

const DirectoryExplorerContext = createContext<DirectoryExplorerContextActions>({
    openContextMenu: () => {
    },
});

export const useDirectoryExplorerActions = () => useContext(DirectoryExplorerContext);

export const DirectoryExplorerProvider: FunctionComponent<PropsWithChildren> = props => {
    const [selectedTreeItem, setSelectedTreeItem] = useState<FileHandleInfo | null>(null);

    //#region Context menu
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const isContextMenuOpen = contextMenu !== null;

    const openContextMenu = (event: React.MouseEvent, options: DirectoryExplorerOptions) => {
        setSelectedTreeItem({ path: options.path, handle: options.handle });
        event.preventDefault();
        setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6, } : null);
    };
    const closeContextMenu = () => setContextMenu(null);
    //#endregion

    return <Fragment>
        <DirectoryExplorerContext.Provider value={{
            openContextMenu
        }}>
            {props.children}
        </DirectoryExplorerContext.Provider>

        {!!selectedTreeItem && <Fragment>
            <DirectoryExplorerContextMenu open={isContextMenuOpen}
                position={contextMenu}
                selectedTreeItem={selectedTreeItem}
                onClose={closeContextMenu}
                selectedTreeItemKind={selectedTreeItem.handle.kind} />


        </Fragment>}
    </Fragment>;
}
