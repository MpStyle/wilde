import { CSSProperties, FunctionComponent } from "react";
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import memoizeOne from 'memoize-one';
import { TreeNode } from "./TreeNode";
import { TreeViewItem } from "./TreeViewItem";

const getItemData = memoizeOne(
    (
        nodes: TreeNode[],
        onSelectedItem: (node: TreeNode) => void,
        onContextMenu: (node: TreeNode, event: React.MouseEvent) => void
    ) => ({
        nodes,
        onSelectedItem,
        onContextMenu
    }));

export interface TreeViewProps {
    id?: string;
    nodes: TreeNode[];
    onSelectedItem: (node: TreeNode) => void;
    onSelectEmptyArea?: () => void;
    onContextMenu?: (node: TreeNode, event: React.MouseEvent) => void;
    itemSize?: number;
    style?: CSSProperties | undefined;
}

export const TreeView: FunctionComponent<TreeViewProps> = props => {
    const { id, onSelectedItem, nodes, onSelectEmptyArea, onContextMenu } = props;
    const fixedListClass = "TreeView-FixedList";
    const itemData = getItemData(nodes, onSelectedItem, onContextMenu ?? (() => { }));

    return <AutoSizer id={id}
        onClick={(event) => {
            const classList = (event.target as any).classList;
            if (Array.from(classList).includes(fixedListClass) && onSelectEmptyArea) {
                onSelectEmptyArea();
            }
        }}>
        {({ height, width }: { height: string | number, width: string | number }) =>
            <List height={height}
                width={width}
                style={props.style}
                className={fixedListClass}
                itemCount={nodes.length}
                itemSize={props.itemSize ?? 22}
                itemKey={index => nodes[index].id}
                itemData={itemData}>
                {TreeViewItem}
            </List>}
    </AutoSizer>
}