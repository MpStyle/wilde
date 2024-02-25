import { CSSProperties, FunctionComponent } from "react";
import { TreeNode } from "./TreeNode";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export interface TreeViewItemData {
    nodes: TreeNode[];
    onSelectedItem: (node: TreeNode) => void;
    onContextMenu: (node: TreeNode, event: React.MouseEvent) => void;
}

export interface TreeViewItemProps {
    data: TreeViewItemData;
    index: number;
    style: CSSProperties;
}

export const TreeViewItem: FunctionComponent<TreeViewItemProps> = props => {
    const theme = useTheme();
    const { data, index } = props;
    const { nodes, onSelectedItem, onContextMenu } = data;
    const currentNode = nodes[index];
    const left = currentNode.depth * 8;

    return <Box style={props.style}
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            backgroundColor: currentNode.isSelected ? theme.palette.primary.light : undefined,
            color: currentNode.isSelected ? theme.palette.primary.contrastText : undefined,
            border: currentNode.isSelected || currentNode.isContextMenu ? `1px solid ${theme.palette.primary.main}` : undefined,
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: currentNode.isSelected ? theme.palette.primary.light : theme.palette.grey[300],
            }
        }}
        onClick={() => onSelectedItem(currentNode)}
        onContextMenu={event => onContextMenu(currentNode, event)}>
        <Stack direction='row' sx={{
            position: 'absolute',
            left: `${left}px`,
            width: `calc(100% - ${left}px - ${theme.spacing(1)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            pl: 0.5,
            pr: 0.5,
        }}>
            <Box component={currentNode.collapsed ? KeyboardArrowRightIcon : KeyboardArrowDownIcon}
                color={currentNode.isSelected ? theme.palette.primary.contrastText : theme.palette.grey[600]}
                sx={{
                    visibility: currentNode.isLeaf ? 'hidden' : 'visible'
                }} />
            {currentNode.icon}

            <Typography variant="body2" sx={{
                fontWeight: 'inherit',
                flexGrow: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}>
                {currentNode.label}
            </Typography>
        </Stack>
    </Box>
}