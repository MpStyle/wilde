import { Stack, useTheme } from "@mui/material";
import { FunctionComponent, useEffect } from 'react';
import { useSelector } from "react-redux";
import { AppState } from "../store/AppStore";
import { ActivityBar } from "./activity-bar/ActivityBar";
import { EditorGroups } from "./editor-groups/EditorGroups";
import { Sidebar } from "./sidebar/Sidebar";
import { StatusBar } from "./status-bar/StatusBar";

export const App: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const theme = useTheme();
    const statusBarHeight = rootDirectory ? '28px' : '0px';

    useEffect(() => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return;
        }

        const unloadCallback = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);

        return () => {
            window.removeEventListener("beforeunload", unloadCallback);
        }
    }, []);

    return <Stack direction="column"
        id="App"
        sx={{
            height: '100%',
            overflow: 'hidden',
            '& > :last-child': {
                borderTop: `1px solid ${theme.palette.grey[400]}`
            },
        }}>

        <Stack direction="row" sx={{
            height: `calc(100% - ${statusBarHeight})`,
            overflowX: 'hidden',
        }}>
            {false && <ActivityBar />}
            <Sidebar />
            <EditorGroups />
        </Stack>

        {Boolean(rootDirectory) && <StatusBar />}
    </Stack>;
}
