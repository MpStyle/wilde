import { CSSProperties, FunctionComponent } from "react";
import { TreeNode } from "./TreeNode";
import { Box, Stack, Typography, styled, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

//#region TreeViewItemBoxProps
type TreeViewItemBoxProps = { node: TreeNode }

const TreeViewItemBox = styled(Box)<TreeViewItemBoxProps>(props => {
    const { node, theme } = props;

    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        backgroundColor: node.isSelected ? theme.palette.primary.light : undefined,
        color: node.isSelected ? theme.palette.primary.contrastText : undefined,
        border: node.isSelected || node.isContextMenu ? `1px solid ${theme.palette.primary.main}` : undefined,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: node.isSelected ? theme.palette.primary.light : theme.palette.grey[300],
        }
    };
});
//#endregion

//#region TreeViewItemStackProps
type TreeViewItemStackProps = { left: number }

const TreeViewItemStack = styled(Stack)<TreeViewItemStackProps>(props => {
    const { left, theme } = props;

    return {
        position: 'absolute',
        left: `${left}px`,
        width: `calc(100% - ${left}px - ${theme.spacing(1)})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        pl: 0.5,
        pr: 0.5,
    };
});
//#endregion

//#region TreeViewItemTypography
const TreeViewItemTypography = styled(Typography)(() => ({
    fontWeight: 'inherit',
    flexGrow: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
}));
//#endregion

//#region TreeViewItem
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
        node={currentNode}
        onClick={() => onSelectedItem(currentNode)}
        onContextMenu={event => onContextMenu(currentNode, event)}>
        <TreeViewItemStack direction='row' left={left}>
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
//#endregion