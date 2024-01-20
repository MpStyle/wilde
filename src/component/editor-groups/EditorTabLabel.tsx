import React, {FunctionComponent} from "react";
import {FileIcon} from "../common/file-icon/FileIcon";
import {alpha, Box, IconButton, Typography, useTheme} from "@mui/material";
import {PathUtils} from "../../book/PathUtils";
import {closeEditor, EditorInfoUnion, WildeProtocol} from "../../slice/OpenEditorsSlice";
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
        {props.editor.kind === 'file' && <FileIcon handle={props.editor.handle} sx={{mr: 1}} size='small'/>}

        <Typography variant="body2"
                    sx={{
                        textTransform: 'none',
                        flexGrow: 1,
                        color: props.isSelected ? theme.palette.text.primary : alpha(theme.palette.text.disabled, 0.7),
                        fontWeight: props.isSelected ? "bold" : 'normal',
                    }}>

            {props.editor.kind === 'file' && <Box component='span'>{props.editor.handle.name}</Box>}
            {props.editor.kind === 'wilde' && <Box component='span'>{props.editor.path.replace(WildeProtocol,'')}</Box>}

            {Boolean(props.editor.isChange) && " (*)"}
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
                    onClick={e => {
                        dispatch(closeEditor({
                            path: props.editor.path,
                        }));

                        e.stopPropagation();
                    }}>
            <CloseIcon/>
        </IconButton>
    </Box>;
}

export interface EditorTabLabelProps {
    isSelected: boolean;
    showPathInTab: boolean;
    editor: EditorInfoUnion;
}