import React, {CSSProperties, memo} from "react";
import {Box, Typography} from "@mui/material";
import {areEqual} from "react-window";
import {TreeNode} from "../../entity/TreeNode";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {FileIcon} from "../core/FileIcon";
import {useDirectoryExplorerActions} from "./DirectoryExplorerContext";
import {PathUtils} from "../../book/PathUtils";

export const DirectoryTreeItem = memo((props: SpeedTreeItemProps) => {
    const node = props.data.flattenedData[props.index];
    const left = node.depth * 20;
    const actions = useDirectoryExplorerActions();

    return <Box style={props.style}
                onClick={() => props.data.onOpen(node)}
                onContextMenu={e => {
                    actions.openContextMenu(e, {
                        path: PathUtils.combine(node.path, node.handler.name),
                        handler: node.handler
                    });
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    '&:hover': {
                        backgroundColor: 'rgba(207, 208, 209, 1)',
                        cursor: 'pointer'
                    }
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
                 color="text.secondary"
                 sx={{
                     visibility: node.handler.kind === "directory" ? 'visible' : 'hidden'
                 }}/>
            <FileIcon sx={{mr: 1}} node={node}/>
            <Typography variant="body2"
                        sx={{
                            fontWeight: 'inherit',
                            flexGrow: 1,
                            whiteSpace: 'nowrap'
                        }}>
                {node.handler.name}
            </Typography>
        </Box>
    </Box>;
}, areEqual);

interface RowPropsData {
    onOpen: (node: TreeNode) => void;
    flattenedData: TreeNode[];
}

interface SpeedTreeItemProps {
    data: RowPropsData;
    index: number;
    style?: CSSProperties;
}