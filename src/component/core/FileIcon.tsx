import React, {FunctionComponent} from "react";
import {IconResolver} from "../../book/IconResolver";
import {Icon} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {TreeNode} from "../../entity/TreeNode";

export const FileIcon: FunctionComponent<FileIconProps> = props => {
    return <Icon sx={props.sx} fontSize={props.size}>
        <img src={IconResolver.byTreeNode(props.handle, props.collapsed)}
             alt={(props.path??'') + props.handle.name}
             style={{
                 display: 'flex',
                 height: 'inherit',
                 width: 'inherit',
             }}/>
    </Icon>;
}

export interface FileIconProps {
    sx?: SxProps<Theme>;
    handle: FileSystemHandle;
    path?: string;
    collapsed?: boolean;
    size?: 'inherit' | 'large' | 'medium' | 'small';
}