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

export const DirectoryTreeItem = memo((props: SpeedTreeItemProps) => {
    const selectedProjectFile = useSelector((appState: AppState) => appState.projectFolder.selectedProjectFile);
    const theme = useTheme();
    const dispatch = useDispatch();
    const node = props.data.flattenedData[props.index];
    const left = node.depth * 20;
    const isSelected = selectedProjectFile?.path === PathUtils.combine(node.path, node.handle.name);
    const treeNodeToFileHandleInfo = (treeNode: TreeNode) => ({
        path: PathUtils.combine(treeNode.path, treeNode.handle.name),
        handle: treeNode.handle
    })

    return <Box style={props.style}
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
            cursor: isSelected ? 'pointer' : undefined,
            '&:hover': {
                backgroundColor: isSelected ? undefined : theme.palette.grey.A200,
            },
        }}>
        <Box component="div"
            style={{
                position: 'absolute',
                left: `${left}px`,
                width: `calc(100% - ${left}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left'
            }}>
            <Box component={node.collapsed ? KeyboardArrowRightIcon : KeyboardArrowDownIcon}
                color="inherit"
                sx={{
                    visibility: node.handle.kind === "directory" ? 'visible' : 'hidden'
                }} />
            <FileIcon sx={{ mr: 1 }} handle={node.handle} collapsed={node.collapsed} path={node.path} />
            <Typography variant="body2"
                sx={{
                    fontWeight: 'inherit',
                    flexGrow: 1,
                    whiteSpace: 'nowrap'
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