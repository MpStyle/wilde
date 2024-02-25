import { Divider, Menu, MenuItem } from "@mui/material";
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

    if (!data) {
        return null;
    }

    const menuData = [
        { label: 'New file...', action: () => wilde.emit(wilde.eventBuilder.onNewFile()), condition: data.fileHandleInfo.handle.kind === 'directory' },
        { label: 'New folder...', action: () => wilde.emit(wilde.eventBuilder.onNewDirectory()), condition: data.fileHandleInfo.handle.kind === 'directory' },
        { label: 'Delete', action: () => wilde.emit(wilde.eventBuilder.onDeleteFile(data.fileHandleInfo)), condition: data.fileHandleInfo.handle !== rootDirectory },
        { type: 'divider' },
        { label: `Copy ${data.fileHandleInfo.handle.kind} name`, action: () => navigator.clipboard.writeText(data.fileHandleInfo.handle.name) },
        { label: 'Copy path', action: () => navigator.clipboard.writeText(data.fileHandleInfo.path) },
    ];

    return <Menu open={open}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: data.mouseY, left: data.mouseX }}>

        {menuData
            .filter(menu => menu.condition || menu.condition === undefined)
            .map(menu => {
                if (menu.type === 'divider') {
                    return <Divider />
                }

                return <MenuItem onClick={() => { onClose(); menu.action!(); }}>
                    {menu.label}
                </MenuItem>;
            })}
    </Menu>
}