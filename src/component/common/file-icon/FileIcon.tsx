import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Avatar, AvatarProps, Icon } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { FunctionComponent } from "react";
import { IconResolver } from "../../../book/IconResolver";
import { WildeProtocol } from "../../../slice/OpenEditorsSlice";

export const FileIcon: FunctionComponent<FileIconProps> = props => {
    return <Icon sx={props.sx} fontSize={props.size}>
        <img src={IconResolver.byTreeNode(props.handle, props.collapsed)}
            alt={(props.path ?? '') + props.handle.name}
            style={{
                display: 'flex',
                height: 'inherit',
                width: 'inherit',
            }} />
    </Icon>;
}

export interface FileIconProps {
    sx?: SxProps<Theme>;
    handle: FileSystemHandle;
    path?: string;
    collapsed?: boolean;
    size?: 'inherit' | 'large' | 'medium' | 'small';
}