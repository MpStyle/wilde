import { Menu, MenuItem } from "@mui/material";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useWilde } from "../../hook/WildeHook";
import { AppState } from "../../store/AppStore";

export const DirectoryExplorerContextMenu: FunctionComponent<DirectoryExplorerContextMenuProps> = props => {
    const selectedProjectFile = useSelector((appState: AppState) => appState.projectFolder.selectedProjectFile);
    const {
        onClose,
        open,
        position,
    } = props;
    const wilde = useWilde();

    if (!selectedProjectFile) {
        return null;
    }

    return <Menu open={open}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={
            position !== null
                ? { top: position.mouseY, left: position.mouseX }
                : undefined
        }>
        {selectedProjectFile.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.newFile();
            }}>
                New File...
            </MenuItem>}

        {selectedProjectFile.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.newDirectory();
            }}>
                New folder...
            </MenuItem>}

        <MenuItem onClick={() => {
            onClose();
            wilde.deleteFile()
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
}