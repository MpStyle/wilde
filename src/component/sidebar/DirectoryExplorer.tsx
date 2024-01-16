import memoizeOne from 'memoize-one';
import React, { Fragment, FunctionComponent } from 'react';
import { useDispatch, useSelector } from "react-redux";
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { FileSorter } from "../../book/FileSorter";
import { PathUtils } from "../../book/PathUtils";
import { openEditor } from "../../slice/OpenEditorsSlice";
import { scanProjectDirectory, setSelectedProjectFile } from "../../slice/ProjectDirectorySlice";
import { AppDispatch, AppState } from "../../store/AppStore";
import { DirectoryExplorerContextMenu } from './DirectoryExplorerContextMenu';
import { DirectoryTreeItem } from "./DirectoryTreeItem";
import { TreeNode } from "./entity/TreeNode";

const getItemData = memoizeOne(
    (
        onOpen: (node: TreeNode) => void,
        flattenedData: TreeNode[],
        openContextMenu: (event: React.MouseEvent) => void
    ) => ({
        onOpen,
        flattenedData,
        openContextMenu
    }));

export const DirectoryExplorer: FunctionComponent<SpeedTreeProps> = props => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const dispatch = useDispatch<AppDispatch>();
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    if (!rootDirectory) {
        return null;
    }

    const isContextMenuOpen = contextMenu !== null;

    const toFlat = (items: FileSystemHandleUnion[], depth: number, path: string): TreeNode[] => {
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
        if (node.handle === rootDirectory) {
            if (node.collapsed) {
                return props.setOpenedNodeIds([...props.openedNodeIds, rootDirectory.name]);
            } else {
                return props.setOpenedNodeIds(props.openedNodeIds.filter(id => id !== rootDirectory.name));
            }
        }

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

    const openContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6, } : null);
    };

    const flattenedData = toFlat(directoryStructure[PathUtils.rootPath].content, 1, PathUtils.rootPath);
    flattenedData.unshift({
        handle: rootDirectory,
        collapsed: false,
        depth: 0,
        hasChildren: rootDirectory.kind === 'directory',
        path: PathUtils.rootPath
    });

    const itemData = getItemData(onOpen, flattenedData, openContextMenu);
    const fixedListClass = "fixed-list";

    return <Fragment>
        <AutoSizer id='DirectoryExplorer'
            onClick={(event) => {
                const classList = (event.target as any).classList;
                if (Array.from(classList).includes(fixedListClass)) {
                    dispatch(setSelectedProjectFile({ path: PathUtils.rootPath, handle: rootDirectory }));
                }
            }}>
            {({ height, width }: { height: string | number, width: string | number }) =>
                <List height={height}
                    width={width}
                    className={fixedListClass}
                    itemCount={flattenedData.length}
                    itemSize={28}
                    itemKey={index =>
                        index === 0 ?
                            rootDirectory.name :
                            (PathUtils.combine(flattenedData[index].path, (flattenedData[index].handle?.name ?? 'loading...')))}
                    itemData={itemData}>
                    {DirectoryTreeItem}
                </List>}
        </AutoSizer>

        {Boolean(contextMenu) && <DirectoryExplorerContextMenu open={isContextMenuOpen}
            position={contextMenu}
            onClose={() => setContextMenu(null)} />}
    </Fragment>;
};

export interface SpeedTreeProps {
    openedNodeIds: string[];
    setOpenedNodeIds: (openedNodeIds: string[]) => void;
}