import { CSSProperties, FunctionComponent } from "react";
import { TreeNode } from "./TreeNode";
import { Box, Stack, Typography, styled, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const TreeViewItemBox = styled(Box)(() => {
    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: 'pointer',
    };
});

const TreeViewItemStack = styled(Stack)<{ left: number, node: TreeNode }>(props => {
    const { left, theme, node } = props;

    return {
        position: 'absolute',
        left: `${left}px`,
        width: `calc(100% - ${left}px - ${theme.spacing(1)})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        pl: 0.5,
        pr: 0.5,
        backgroundColor: node.isSelected ? theme.palette.primary.light : undefined,
        color: node.isSelected ? theme.palette.primary.contrastText : undefined,
        border: `1px solid ${node.isSelected || node.isContextMenu ? theme.palette.primary.main : 'rgba(0,0,0,0)'}`,
        '&:hover': {
            backgroundColor: node.isSelected ? theme.palette.primary.light : theme.palette.grey[300],
            border: `1px solid ${node.isSelected ? theme.palette.primary.light : theme.palette.grey[300]}`,
        }
    };
});

const TreeViewItemTypography = styled(Typography)(() => ({
    fontWeight: 'inherit',
    flexGrow: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
}));

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
    const isCollapsable = currentNode.isCollapsable === undefined ? true : currentNode.isCollapsable;

    return <TreeViewItemBox style={props.style}
        onClick={() => onSelectedItem(currentNode)}
        onContextMenu={event => onContextMenu(currentNode, event)}>
        <TreeViewItemStack direction='row' left={left} node={currentNode}>
            {isCollapsable && <Box component={currentNode.collapsed ? KeyboardArrowRightIcon : KeyboardArrowDownIcon}
                color={currentNode.isSelected ? theme.palette.primary.contrastText : theme.palette.grey[600]}
                sx={{ visibility: currentNode.isLeaf ? 'hidden' : 'visible' }} />}

            {currentNode.icon}

            <TreeViewItemTypography variant="body2">
                {currentNode.label}
            </TreeViewItemTypography>
        </TreeViewItemStack>
    </TreeViewItemBox>
}