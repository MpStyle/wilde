import React, {CSSProperties, memo} from "react";
import {Box, Typography} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {areEqual} from "react-window";
import {TreeNode} from "./entity/SpeedTreeNode";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const SpeedTreeItem = memo((props: SpeedTreeItemProps) => {
    const node = props.data.flattenedData[props.index];
    const left = node.depth * 20;

    return <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    '&:hover':{
                        backgroundColor: 'rgba(207, 208, 209, 1)',
                        cursor: 'pointer'
                    }
                }}
                style={props.style}
                onClick={() => props.data.onOpen(node)}>
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
                     visibility: node.handler.kind === "directory" ? 'visible' : 'hidden'
                 }}/>
            <Box component={node.handler.kind === "directory" ? FolderIcon : InsertDriveFileIcon}
                 color="inherit"
                 sx={{mr: 1}}/>
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