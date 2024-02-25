import { Menu, MenuItem } from "@mui/material";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { useWilde } from "../../hook/WildeHook";
import { AppState } from "../../store/AppStore";
import { FileHandleInfo } from "../../entity/FileHandleInfo";

export interface DirectoryExplorerContextMenuProps {
    open: boolean;
    data: {
        fileHandleInfo: FileHandleInfo;
        mouseX: number;
        mouseY: number;
    } | null;
    onClose: () => void;
}

export const DirectoryExplorerContextMenu: FunctionComponent<DirectoryExplorerContextMenuProps> = props => {
    const rootDirectory = useSelector((appState: AppState) => appState.openedDirectory.rootDirectory);
    const {
        onClose,
        open,
        data,
    } = props;
    const wilde = useWilde();

    if (!data?.fileHandleInfo) {
        return null;
    }

    return <Menu open={open}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={
            data !== null
                ? { top: data.mouseY, left: data.mouseX }
                : undefined
        }>
        {data.fileHandleInfo.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.emit(wilde.eventBuilder.onNewFile());
            }}>
                New File...
            </MenuItem>}

        {data.fileHandleInfo.handle.kind === 'directory' &&
            <MenuItem onClick={() => {
                onClose();
                wilde.emit(wilde.eventBuilder.onNewDirectory());
            }}>
                New folder...
            </MenuItem>}

        {data.fileHandleInfo.handle !== rootDirectory &&
            <MenuItem onClick={() => {
                onClose();
                wilde.emit(wilde.eventBuilder.onDeleteFile(data.fileHandleInfo));
            }}>
                Delete
            </MenuItem>}
    </Menu>
}