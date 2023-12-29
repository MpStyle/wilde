import React, {FunctionComponent} from 'react';
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import memoizeOne from 'memoize-one';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../store/AppStore";
import {scanProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {openEditor} from "../../slice/OpenEditorsSlice";
import {FileSystemHandle} from "./entity/FileSystemHandle";
import {TreeNode} from "./entity/SpeedTreeNode";
import {SpeedTreeItem} from "./SpeedTreeItem";
import {FileSorter} from "./book/FileSorter";

const getItemData = memoizeOne((onOpen: (node: TreeNode) => void, flattenedData: TreeNode[]) => ({
    onOpen,
    flattenedData,
}));

export const SpeedTree: FunctionComponent<SpeedTreeProps> = props => {
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const dispatch = useDispatch<AppDispatch>();

    const toFlat = (items: FileSystemHandle[], depth: number, path: string): TreeNode[] => {
        const result: TreeNode[] = [];
        const sortedItems=[...items].sort(FileSorter.byTypeByName);

        for (let item of sortedItems) {
            const collapsed = !props.openedNodeIds.includes(path + item.name);
            result.push({
                handler: item,
                collapsed: collapsed,
                depth: depth,
                hasChildren: item.kind === 'directory',
                path: path
            });

            if (item.kind === 'directory' && directoryStructure.hasOwnProperty(path + item.name) && !collapsed) {
                result.push(...toFlat(directoryStructure[path + item.name], depth + 1, path + item.name))
            }
        }

        return result;
    }

    const onOpen = (node: TreeNode) => {
        const nodePath = node.path + node.handler.name;

        if (node.handler.kind === 'file') {
            dispatch(openEditor({path: node.path, fileName: node.handler.name}));
            return;
        }

        if (node.collapsed) {
            if (!directoryStructure.hasOwnProperty(nodePath)) {
                dispatch(scanProjectDirectory({path: nodePath, dirHandle: node.handler as FileSystemDirectoryHandle}));
            }

            return props.setOpenedNodeIds([...props.openedNodeIds, nodePath]);
        } else {
            return props.setOpenedNodeIds(openedNodeIds => openedNodeIds.filter(id => id !== nodePath));
        }
    };

    const flattenedData = toFlat(directoryStructure["/"], 0, "/");
    const itemData = getItemData(onOpen, flattenedData);

    return <AutoSizer>
        {({height, width}: { height: string | number, width: string | number }) =>
            <List height={height}
                  width={width}
                  itemCount={flattenedData.length}
                  itemSize={32}
                  itemKey={index => flattenedData[index].path + (flattenedData[index].handler?.name ?? 'loading...')}
                  itemData={itemData}>
                {SpeedTreeItem}
            </List>}
    </AutoSizer>;
};

export interface SpeedTreeProps {
    openedNodeIds: string[];
    setOpenedNodeIds: React.Dispatch<React.SetStateAction<string[]>>;
}