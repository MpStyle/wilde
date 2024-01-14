import React, { FunctionComponent } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useWilde } from "../../hook/WildeHook";
import { FileHandleInfo } from "../../entity/FileHandleInfo";

export const DirectoryExplorerContextMenu: FunctionComponent<DirectoryExplorerContextMenuProps> = props => {
    const {
        onClose,
        open,
        selectedTreeItemKind,
        openDeleteDialog,
        openNewFileDialog,
        position,
        selectedTreeItem
    } = props;
    const wilde = useWilde();

    return <Menu open={open}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={
            position !== null
                ? { top: position.mouseY, left: position.mouseX }
                : undefined
        }>
        {selectedTreeItemKind === 'directory' &&
            <MenuItem onClick={() => openNewFileDialog()}>New File...</MenuItem>}
        {selectedTreeItemKind === 'directory' &&
            <MenuItem onClick={() => wilde.newDirectory(selectedTreeItem)}>New folder...</MenuItem>}
        <MenuItem onClick={() => openDeleteDialog()}>Delete</MenuItem>
    </Menu>
}

export interface DirectoryExplorerContextMenuProps {
    open: boolean;
    position: {
        mouseX: number;
        mouseY: number;
    } | null;
    onClose: () => void;
    selectedTreeItemKind?: 'directory' | 'file';
    openNewFileDialog: () => void;
    openDeleteDialog: () => void;
    selectedTreeItem: FileHandleInfo;
}