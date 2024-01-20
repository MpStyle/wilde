import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FunctionComponent } from "react";
import { useWilde } from "../../hook/WildeHook";
import { EditorBreadcrumbs } from "./EditorBreadcrumbs";
import { useSelector } from 'react-redux';
import { AppState } from '../../store/AppStore';

export const StatusBar: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const wilde = useWilde();

    return <Stack direction="row" sx={{ alignItems: 'center' }}>
        {Boolean(rootDirectory) && <EditorBreadcrumbs />}
        <div style={{ flex: 1 }} />
        <IconButton size="small" onClick={() => wilde.showAbout()}>
            <InfoIcon />
        </IconButton>
    </Stack>
}