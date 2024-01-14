import React, { CSSProperties, memo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { areEqual } from "react-window";
import { TreeNode } from "./entity/TreeNode";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FileIcon } from "../common/file-icon/FileIcon";
import { PathUtils } from "../../book/PathUtils";
import { FileHandleInfo } from "../../entity/FileHandleInfo";

export const DirectoryTreeItem = memo((props: SpeedTreeItemProps) => {
    const node = props.data.flattenedData[props.index];
    const left = node.depth * 20;
    const isSelected = props.data.selectedFileHandleInfo?.path === PathUtils.combine(node.path, node.handle.name);
    const theme = useTheme();

    return <Box style={props.style}
        onClick={() => {
            props.data.onOpen(node);
            props.data.setSelectedFileHandleInfo(node);
        }}
        onContextMenu={e => {
            props.data.openContextMenu(e, {
                path: PathUtils.combine(node.path, node.handle.name),
                handle: node.handle
            });
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
    selectedFileHandleInfo: FileHandleInfo | undefined;
    setSelectedFileHandleInfo: (fileHandleInfo: FileHandleInfo) => void;
    openContextMenu: (event: React.MouseEvent, options: FileHandleInfo) => void;
}

interface SpeedTreeItemProps {
    data: RowPropsData;
    index: number;
    style?: CSSProperties;
}