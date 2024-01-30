import { Menu, MenuItem } from "@mui/material";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useWilde } from "../../hook/WildeHook";
import { AppState } from "../../store/AppStore";

export const DirectoryExplorerContextMenu: FunctionComponent<DirectoryExplorerContextMenuProps> = props => {
    const selectedFile = useSelector((appState: AppState) => appState.openedDirectory.selectedFile);
    const rootDirectory = useSelector((appState: AppState) => appState.openedDirectory.rootDirectory);
    const {
        onClose,
        open,
        position,
    } = props;
    const wilde = useWilde();

    if (!selectedFile) {
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
        {selectedFile.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.emit(wilde.event.onNewFile);
            }}>
                New File...
            </MenuItem>}

        {selectedFile.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.emit(wilde.event.onNewDirectory);
            }}>
                New folder...
            </MenuItem>}

        {selectedFile.handle !== rootDirectory &&
            <MenuItem onClick={() => {
                onClose();
                wilde.emit(wilde.event.onDeleteFile);
            }}>
                Delete
            </MenuItem>}
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