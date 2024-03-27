import { Fragment, FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FileSorter } from "../../book/FileSorter";
import { PathUtils } from "../../book/PathUtils";
import { scanDirectoryRequest, setSelectedFile } from "../../slice/OpenedDirectorySlice";
import { AppDispatch, AppState } from "../../store/AppStore";
import { DirectoryExplorerContextMenu } from './DirectoryExplorerContextMenu';
import { FileHandleInfo } from '../../entity/FileHandleInfo';
import { fileEditorInfoBuilder, openEditor } from '../../slice/OpenEditorsSlice';
import { FileIcon } from '../common/file-icon/FileIcon';
import { useTheme } from '@mui/material';
import { WildeAvatar } from '../common/wilde-avatar/WildeAvatar';
import { TreeNode } from '../common/tree-view/TreeNode';
import { TreeView } from '../common/tree-view/TreeView';

type DirectoryExplorerNode = TreeNode & { handle: FileSystemHandleUnion }

interface DirectoryExplorerState {
    contextMenu?: {
        fileHandleInfo: FileHandleInfo;
        mouseX: number;
        mouseY: number;
    } | undefined;
}

export interface DirectoryExplorerProps {
    openedNodeIds: string[];
    setOpenedNodeIds: (openedNodeIds: string[]) => void;
}

export const DirectoryExplorer: FunctionComponent<DirectoryExplorerProps> = props => {
    const rootDirectory = useSelector((appState: AppState) => appState.openedDirectory.rootDirectory);
    const directoryStructure = useSelector((appState: AppState) => appState.openedDirectory.directoryStructure);
    const selectedFile = useSelector((appState: AppState) => appState.openedDirectory.selectedFile);
    const [state, setState] = useState<DirectoryExplorerState>({});
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme()
    const isContextMenuOpen = state.contextMenu !== null;

    const toTreeNodes = (items: FileSystemHandleUnion[], depth: number, path: string): TreeNode[] => {
        const result: TreeNode[] = [];
        const sortedItems = [...items].sort(FileSorter.byTypeByName);

        if (!props.openedNodeIds.includes(path) && path !== PathUtils.rootPath) {
            return result;
        }

        for (let item of sortedItems) {
            const collapsed = !props.openedNodeIds.includes(PathUtils.combine(path, item.name));
            const itemPath = PathUtils.combine(path, item.name);

            result.push({
                collapsed: collapsed,
                depth: depth,
                label: item.name,
                id: itemPath,
                isLeaf: item.kind === 'file',
                icon: <FileIcon size='small' sx={{ mr: 1, color: theme.palette.grey[400] }} handle={item} collapsed={collapsed} path={itemPath} />,
                handle: item,
                isSelected: selectedFile?.handle === item,
                isContextMenu: state.contextMenu?.fileHandleInfo.handle === item,
            } as DirectoryExplorerNode);

            const absolutePath = PathUtils.combine(path, item.name);
            if (item.kind === 'directory' && directoryStructure.hasOwnProperty(absolutePath) && !collapsed) {
                result.push(...toTreeNodes(directoryStructure[absolutePath].content, depth + 1, absolutePath))
            }
        }

        return result;
    };

    const nodes = toTreeNodes(directoryStructure[PathUtils.rootPath].content, 1, PathUtils.rootPath);
    nodes.unshift({
        isCollapsable: false,
        depth: 0,
        label: rootDirectory?.name ?? PathUtils.rootPath,
        id: PathUtils.rootPath,
        icon: <WildeAvatar sx={{ mr: 0.6, ml: 0.6 }} name={rootDirectory?.name ?? PathUtils.rootPath} size="small" />,
        handle: rootDirectory,
        isSelected: selectedFile?.handle === rootDirectory,
        isContextMenu: state.contextMenu?.fileHandleInfo.handle === rootDirectory,
    } as DirectoryExplorerNode);

    return <Fragment>
        <TreeView nodes={nodes}
            itemSize={24}
            style={{ overflowX: 'hidden' }}
            onSelectEmptyArea={() => {
                if (!rootDirectory) {
                    return;
                }

                dispatch(setSelectedFile({
                    path: PathUtils.rootPath,
                    handle: rootDirectory
                }));
            }}
            onSelectedItem={node => {
                const directoryExplorerNode = node as DirectoryExplorerNode;

                dispatch(setSelectedFile({
                    path: node.id,
                    handle: directoryExplorerNode.handle
                }));

                if (node.isLeaf) {
                    dispatch(openEditor(fileEditorInfoBuilder(node.id, directoryExplorerNode.handle as FileSystemFileHandle)));
                    return;
                }

                if (node.collapsed) {

                    if (!directoryStructure.hasOwnProperty(node.id)) {
                        dispatch(scanDirectoryRequest({ path: node.id, dirHandle: directoryExplorerNode.handle as FileSystemDirectoryHandle }));
                    }

                    return props.setOpenedNodeIds([...props.openedNodeIds, node.id]);
                } else {
                    return props.setOpenedNodeIds(props.openedNodeIds.filter(id => id !== node.id));
                }
            }}
            onContextMenu={(node, event) => {
                event.preventDefault();
                setState(state => ({
                    ...state, contextMenu: {
                        fileHandleInfo: { handle: (node as any).handle, path: node.id },
                        mouseX: event.clientX + 2,
                        mouseY: event.clientY - 6
                    }
                }))
            }}
        />

        {!!state.contextMenu && <DirectoryExplorerContextMenu open={isContextMenuOpen}
            data={state.contextMenu}
            onClose={() => setState(state => ({ ...state, contextMenu: undefined }))} />}
    </Fragment>
}