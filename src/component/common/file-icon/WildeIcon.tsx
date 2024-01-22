import { FunctionComponent } from "react";
import { WildeProtocol } from "../../../slice/OpenEditorsSlice";
import Avatar from "@mui/material/Avatar";
import { SxProps, Theme } from "@mui/material";

const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export const WildeIcon: FunctionComponent<WildeIconProps> = props => {
    const page = props.path.replace(WildeProtocol, '');
    const children = page[0];
    const bgcolor = stringToColor(page);
    const sizeToSx = () => {
        switch (props.size) {
            default:
            case 'medium': return {};
            case 'small': return { width: 20, height: 20, fontSize: '0.8em' }
            case 'large': return { width: 28, height: 28, fontSize: '1.2em' }
        }
    }

    return <Avatar sx={{ ...props.sx, bgcolor, ...(sizeToSx()) }} children={children} />;
}

export interface WildeIconProps {
    sx?: SxProps<Theme>;
    path: string;
    size?: 'large' | 'medium' | 'small';
}