import { Menu, MenuItem } from "@mui/material";
import { FunctionComponent } from "react";
import { FileHandleInfo } from "../../entity/FileHandleInfo";
import { useWilde } from "../../hook/WildeHook";

export const DirectoryExplorerContextMenu: FunctionComponent<DirectoryExplorerContextMenuProps> = props => {
    const {
        onClose,
        open,
        selectedFileHandleInfo,
        position,
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
        {selectedFileHandleInfo.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.newFile(selectedFileHandleInfo);
            }}>
                New File...
            </MenuItem>}

        {selectedFileHandleInfo.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.newDirectory(selectedFileHandleInfo);
            }}>
                New folder...
            </MenuItem>}

        <MenuItem onClick={() => {
            onClose();
            wilde.deleteFile(selectedFileHandleInfo)
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
    selectedFileHandleInfo: FileHandleInfo;
}