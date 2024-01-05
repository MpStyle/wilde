import React, {FunctionComponent} from "react";
import {FileIcon} from "../core/FileIcon";
import {alpha, Box, IconButton, Typography, useTheme} from "@mui/material";
import {PathUtils} from "../../book/PathUtils";
import {closeEditor} from "../../slice/OpenEditorsSlice";
import CloseIcon from "@mui/icons-material/Close";
import {useDispatch} from "react-redux";

export const EditorTabLabel: FunctionComponent<EditorTabLabelProps> = props => {
    const theme = useTheme();
    const dispatch = useDispatch();

    return <Box sx={{
        display: 'flex',
        alignItems: 'center',
        pr: 0,
    }}>
        <FileIcon handle={props.editor.handle}
                  sx={{mr: 1}}
                  size='small'/>
        <Typography variant="body2"
                    sx={{
                        textTransform: 'none',
                        flexGrow: 1,
                        color: props.isSelected ? theme.palette.text.primary : alpha(theme.palette.text.disabled, 0.7),
                        fontWeight: props.isSelected ? "bold" : 'normal',
                    }}>
            {props.editor.handle.name}
        </Typography>
        {props.showPathInTab && <Typography variant='caption'
                                            sx={{
                                                ml: 0.8,
                                                textTransform: 'none',
                                                color: theme.palette.text.disabled,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "70px",
                                                direction: "rtl",
                                                textAlign: "left"
                                            }}>
            {props.editor.path}{PathUtils.separator}
        </Typography>}
        <IconButton component="span"
                    sx={{ml: 1}}
                    onClick={() => {
                        if (!props.editor.handle) {
                            return;
                        }

                        dispatch(closeEditor({
                            path: props.editor.path,
                            handle: props.editor.handle
                        }));
                    }}>
            <CloseIcon/>
        </IconButton>
    </Box>;
}

export interface EditorTabLabelProps {
    isSelected: boolean;
    showPathInTab: boolean;
    editor: { path: string, handle: FileSystemFileHandle };
}