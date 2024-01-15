import { Box, Stack, useTheme } from "@mui/material";
import { FunctionComponent, useEffect } from 'react';
import { Sidebar } from "./sidebar/Sidebar";
import { StatusBar } from "./status-bar/StatusBar";
import { EditorGroups } from "./editor-groups/EditorGroups";

export const App: FunctionComponent = () => {
    const theme = useTheme();
    const statusBarHeight = '28px';

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
                borderTop: `1px solid ${theme.palette.text.disabled}`
            },
        }}>

        <Stack direction="row" sx={{
            height: `calc(100% - ${statusBarHeight})`,
            overflowX: 'hidden',
            '& > :first-child': {
                borderRight: `1px solid ${theme.palette.text.disabled}`
            },
        }}>
            <Sidebar />
            <EditorGroups />
        </Stack>

        <StatusBar />
    </Stack>;
}
