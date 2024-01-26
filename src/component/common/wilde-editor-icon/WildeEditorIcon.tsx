import SettingsIcon from '@mui/icons-material/Settings';
import { SxProps, Theme } from "@mui/material";
import { FunctionComponent } from "react";
import { WildeEditorPath } from "../../../slice/OpenEditorsSlice";

export interface WildeEditorIconProps {
    sx?: SxProps<Theme>;
    path: WildeEditorPath;
    size?: 'large' | 'medium' | 'small';
}

export const WildeEditorIcon: FunctionComponent<WildeEditorIconProps> = props => {
    switch (props.path) {
        case "wilde://settings":
            return <SettingsIcon fontSize={props.size} sx={props.sx} />;
        default:
            return null;
    }
}
