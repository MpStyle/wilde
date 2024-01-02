import React, {FunctionComponent} from "react";
import {Menu, MenuItem} from "@mui/material";

export const EditorGroupsContextMenu: FunctionComponent<EditorGroupsContextMenuProps> = props => {
    const {
        onClose,
        open,
        close,
        closeOthers,
        closeAll,
        position
    } = props;

    return <Menu open={open}
                 onClose={onClose}
                 anchorReference="anchorPosition"
                 anchorPosition={
                     position !== null
                         ? {top: position.mouseY, left: position.mouseX}
                         : undefined
                 }>
        <MenuItem onClick={() => close()}>Close</MenuItem>
        <MenuItem onClick={() => closeOthers()}>Close others</MenuItem>
        <MenuItem onClick={() => closeAll()}>Close all</MenuItem>
    </Menu>
}

export interface EditorGroupsContextMenuProps {
    open: boolean;
    position: {
        mouseX: number;
        mouseY: number;
    } | null;
    onClose: () => void;
    close: () => void;
    closeAll: () => void;
    closeOthers: () => void;
}