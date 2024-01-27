import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Menu, MenuItem } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useWilde } from "../../hook/WildeHook";
import { AppDispatch, AppState } from '../../store/AppStore';
import { EditorBreadcrumbs } from "./EditorBreadcrumbs";
import { openEditor, wildeEditorInfoBuilder } from '../../slice/OpenEditorsSlice';
import { EditorContentInfo } from './EditorContentInfo';
import { useTranslation } from 'react-i18next';

export const StatusBar: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const wilde = useWilde();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <Stack direction="row" sx={{ alignItems: 'center' }}>
        {Boolean(rootDirectory) && <EditorBreadcrumbs />}

        <div style={{ flex: 1 }} />

        <EditorContentInfo />

        <IconButton size="small"
            id="basic-button"
            aria-controls={open ? 'settings-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <SettingsIcon />
        </IconButton>

        <Menu id="settings-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}>
            <MenuItem onClick={() => {
                dispatch(openEditor(wildeEditorInfoBuilder('wilde://settings')));
                handleClose();
            }}>
                {t("Settings")}
            </MenuItem>
            <MenuItem onClick={() => {
                wilde.showAbout();
                handleClose();
            }}>
                {t("About wilde")}
            </MenuItem>
        </Menu>
    </Stack>
}