import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Typography, useTheme } from "@mui/material";
import React, { CSSProperties, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { areEqual } from "react-window";
import { PathUtils } from "../../book/PathUtils";
import { setSelectedProjectFile } from "../../slice/ProjectDirectorySlice";
import { AppState } from "../../store/AppStore";
import { FileIcon } from "../common/file-icon/FileIcon";
import { TreeNode } from "./entity/TreeNode";
import { WildeAvatar } from '../common/wilde-avatar/WildeAvatar';

export const DirectoryTreeItem = memo((props: SpeedTreeItemProps) => {
    const selectedProjectFile = useSelector((appState: AppState) => appState.projectFolder.selectedProjectFile);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const theme = useTheme();
    const dispatch = useDispatch();
    const node = props.data.flattenedData[props.index];
    const left = node.depth * 8;
    const isSelected = selectedProjectFile?.handle === node.handle;
    const treeNodeToFileHandleInfo = (treeNode: TreeNode) => ({
        path: PathUtils.combine(treeNode.path, treeNode.handle.name),
        handle: treeNode.handle
    })

    return <Box style={props.style}
        className="directory-tree-item"
        onClick={(e) => {
            props.data.onOpen(node);
            dispatch(setSelectedProjectFile(treeNodeToFileHandleInfo(node)));
        }}
        onContextMenu={e => {
            props.data.openContextMenu(e);
            dispatch(setSelectedProjectFile(treeNodeToFileHandleInfo(node)));
        }}
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            backgroundColor: isSelected ? theme.palette.primary.light : undefined,
            color: isSelected ? theme.palette.primary.contrastText : undefined,
            border: isSelected ? `1px solid ${theme.palette.primary.main}` : undefined,
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.grey[300],
            },
        }}>
        <Box component="div"
            title={`${node.path}${PathUtils.separator}${node.handle.name}`.replace(`${PathUtils.rootPath}${PathUtils.separator}`, `${rootDirectory?.name}${PathUtils.separator}`)}
            sx={{
                position: 'absolute',
                left: `${left}px`,
                width: `calc(100% - ${left}px - ${theme.spacing(1)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                pl: 0.5,
                pr: 0.5,
            }}>
            {rootDirectory !== node.handle && <Box component={node.collapsed ? KeyboardArrowRightIcon : KeyboardArrowDownIcon}
                color={isSelected ? theme.palette.primary.contrastText : theme.palette.grey[600]}
                sx={{
                    visibility: node.handle.kind === "directory" ? 'visible' : 'hidden'
                }} />}
            {rootDirectory !== node.handle && <FileIcon sx={{ mr: 1, color: theme.palette.grey[400] }} handle={node.handle} collapsed={node.collapsed} path={node.path} />}
            {rootDirectory === node.handle && <WildeAvatar sx={{ mr: 0.6, ml: 0.6 }} name={rootDirectory.name} size="small" />}
            <Typography variant="body2"
                sx={{
                    fontWeight: 'inherit',
                    flexGrow: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                {node.handle.name}
            </Typography>
        </Box>
    </Box>;
}, areEqual);

interface RowPropsData {
    onOpen: (node: TreeNode) => void;
    flattenedData: TreeNode[];
    openContextMenu: (event: React.MouseEvent) => void;
}

interface SpeedTreeItemProps {
    data: RowPropsData;
    index: number;
    style?: CSSProperties;
}