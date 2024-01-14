import React, { Fragment, FunctionComponent, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import memoizeOne from 'memoize-one';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store/AppStore";
import { scanProjectDirectory } from "../../slice/ProjectDirectorySlice";
import { openEditor } from "../../slice/OpenEditorsSlice";
import { FileSystemHandle } from "../../entity/FileSystemHandle";
import { TreeNode } from "./entity/TreeNode";
import { DirectoryTreeItem } from "./DirectoryTreeItem";
import { FileSorter } from "../../book/FileSorter";
import { PathUtils } from "../../book/PathUtils";
import { DirectoryExplorerContextMenu } from './DirectoryExplorerContextMenu';
import { FileHandleInfo } from '../../entity/FileHandleInfo';

const getItemData = memoizeOne(
    (
        onOpen: (node: TreeNode) => void,
        flattenedData: TreeNode[],
        selectedFileHandleInfo: FileHandleInfo | undefined,
        setSelectedFileHandleInfo: (fileHandleInfo: FileHandleInfo | undefined) => void,
        openContextMenu: (event: React.MouseEvent, options: FileHandleInfo) => void
    ) => ({
        onOpen,
        flattenedData,
        selectedFileHandleInfo,
        setSelectedFileHandleInfo,
        openContextMenu
    }));

export const DirectoryExplorer: FunctionComponent<SpeedTreeProps> = props => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const [selectedFileHandleInfo, setSelectedFileHandleInfo] = useState<FileHandleInfo | undefined>(undefined);
    const dispatch = useDispatch<AppDispatch>();
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    if (!rootDirectory) {
        return null;
    }

    const isContextMenuOpen = contextMenu !== null;

    const toFlat = (items: FileSystemHandle[], depth: number, path: string): TreeNode[] => {
        const result: TreeNode[] = [];
        const sortedItems = [...items].sort(FileSorter.byTypeByName);

        for (let item of sortedItems) {
            const collapsed = !props.openedNodeIds.includes(PathUtils.combine(path, item.name));
            result.push({
                handle: item,
                collapsed: collapsed,
                depth: depth,
                hasChildren: item.kind === 'directory',
                path: path
            });

            const absolutePath = PathUtils.combine(path, item.name);
            if (item.kind === 'directory' && directoryStructure.hasOwnProperty(absolutePath) && !collapsed) {
                result.push(...toFlat(directoryStructure[absolutePath].content, depth + 1, absolutePath))
            }
        }

        return result;
    }

    const onOpen = (node: TreeNode) => {
        const nodePath = PathUtils.combine(node.path, node.handle.name);

        if (node.handle.kind === 'file') {
            dispatch(openEditor({ path: nodePath, handle: node.handle }));
            return;
        }

        if (node.collapsed) {
            if (!directoryStructure.hasOwnProperty(nodePath)) {
                dispatch(scanProjectDirectory({ path: nodePath, dirHandle: node.handle as FileSystemDirectoryHandle }));
            }

            return props.setOpenedNodeIds([...props.openedNodeIds, nodePath]);
        } else {
            return props.setOpenedNodeIds(props.openedNodeIds.filter(id => id !== nodePath));
        }
    };

    const openContextMenu = (event: React.MouseEvent, options: FileHandleInfo) => {
        event.preventDefault();
        setSelectedFileHandleInfo(options);
        setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6, } : null);
    };

    const flattenedData = toFlat(directoryStructure["."].content, 0, ".");
    const itemData = getItemData(onOpen, flattenedData, selectedFileHandleInfo, setSelectedFileHandleInfo, openContextMenu);

    return <Fragment>
        <AutoSizer>
            {({ height, width }: { height: string | number, width: string | number }) =>
                <List height={height}
                    width={width}
                    itemCount={flattenedData.length}
                    itemSize={28}
                    itemKey={index => PathUtils.combine(flattenedData[index].path, (flattenedData[index].handle?.name ?? 'loading...'))}
                    itemData={itemData}>
                    {DirectoryTreeItem}
                </List>}
        </AutoSizer>

        {(contextMenu && selectedFileHandleInfo) && <DirectoryExplorerContextMenu open={isContextMenuOpen}
            position={contextMenu}
            selectedFileHandleInfo={selectedFileHandleInfo}
            onClose={() => setContextMenu(null)} />}
    </Fragment>;
};

export interface SpeedTreeProps {
    openedNodeIds: string[];
    setOpenedNodeIds: (openedNodeIds: string[]) => void;
}