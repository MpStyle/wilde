import React, { FunctionComponent } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useWilde } from "../../hook/WildeHook";
import { FileHandleInfo } from "../../entity/FileHandleInfo";

export const DirectoryExplorerContextMenu: FunctionComponent<DirectoryExplorerContextMenuProps> = props => {
    const {
        onClose,
        open,
        selectedTreeItemKind,
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
            <MenuItem onClick={() => {
                onClose();
                wilde.newFile(selectedTreeItem);
            }}>
                New File...
            </MenuItem>}

        {selectedTreeItemKind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.newDirectory(selectedTreeItem);
            }}>
                New folder...
            </MenuItem>}

        <MenuItem onClick={() => {
            onClose();
            wilde.deleteFile(selectedTreeItem)
        }}>
            Delete
        </MenuItem>
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
    selectedTreeItem: FileHandleInfo;
}