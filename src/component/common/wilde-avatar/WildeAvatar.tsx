import { FunctionComponent } from "react";
import { WildeProtocol } from "../../../slice/OpenEditorsSlice";
import Avatar from "@mui/material/Avatar";
import { SxProps, Theme } from "@mui/material";
import { StringUtils } from "../../../book/StringUtils";

export const WildeAvatar: FunctionComponent<WildeAvatarProps> = props => {
    const page = props.name.replace(WildeProtocol, '');
    const children = page[0];
    const bgcolor = StringUtils.toColor(page);
    const sizeToSx = () => {
        switch (props.size) {
            default:
            case 'medium': return {};
            case 'small': return { width: 18, height: 18, fontSize: '0.8em' }
            case 'large': return { width: 28, height: 28, fontSize: '1.2em' }
        }
    }

    return <Avatar sx={{ ...props.sx, bgcolor, ...(sizeToSx()), borderRadius: '35%' }} children={children} />;
}

export interface WildeAvatarProps {
    sx?: SxProps<Theme>;
    name: string;
    size?: 'large' | 'medium' | 'small';
}