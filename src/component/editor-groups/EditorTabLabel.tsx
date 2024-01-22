import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography, alpha, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { PathUtils } from "../../book/PathUtils";
import { EditorInfoUnion, closeEditor } from "../../slice/OpenEditorsSlice";
import { FileIcon } from "../common/file-icon/FileIcon";
import { WildeIcon } from "../common/file-icon/WildeIcon";

export const EditorTabLabel: FunctionComponent<EditorTabLabelProps> = props => {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    return <Box sx={{
        display: 'flex',
        alignItems: 'center',
        pr: 0,
    }}>
        <Box sx={{ mr: 1 }} component='span'>
            {props.editor.kind === 'wilde' && <WildeIcon size='small' path={props.editor.path} />}

            {props.editor.kind === 'file' && <FileIcon handle={props.editor.handle}
                path={props.editor.path}
                size='small' />}
        </Box>

        <Typography variant="body2"
            sx={{
                textTransform: 'none',
                flexGrow: 1,
                color: props.isSelected ? theme.palette.text.primary : alpha(theme.palette.text.disabled, 0.7),
                fontWeight: props.isSelected ? "bold" : 'normal',
            }}>

            {props.editor.kind === 'file' && <Box component='span'>
                {props.editor.handle.name}
            </Box>}

            {props.editor.kind === 'wilde' && <Box component='span'>
                {t(props.editor.path)}
            </Box>}

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
            sx={{ ml: 1 }}
            onClick={e => {
                dispatch(closeEditor({
                    path: props.editor.path,
                }));

                e.stopPropagation();
            }}>
            <CloseIcon />
        </IconButton>
    </Box>;
}

export interface EditorTabLabelProps {
    isSelected: boolean;
    showPathInTab: boolean;
    editor: EditorInfoUnion;
}