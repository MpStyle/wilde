import React, {FunctionComponent} from "react";
import {FileIcon} from "../core/FileIcon";
import {TreeNode} from "../../entity/TreeNode";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
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
        <FileIcon node={{handler: props.editor.handler} as TreeNode}
                  sx={{mr: 1}}
                  size='small'/>
        <Typography variant="body2"
                    sx={{
                        textTransform: 'none',
                        flexGrow: 1,
                        color: props.isSelected ? theme.palette.text.primary : theme.palette.text.disabled
                    }}>
            {props.editor.handler.name}
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
                        if (!props.editor.handler) {
                            return;
                        }

                        dispatch(closeEditor({
                            path: props.editor.path,
                            handler: props.editor.handler
                        }));
                    }}>
            <CloseIcon/>
        </IconButton>
    </Box>;
}

export interface EditorTabLabelProps {
    isSelected: boolean;
    showPathInTab: boolean;
    editor: { path: string, handler: FileSystemFileHandle };
}