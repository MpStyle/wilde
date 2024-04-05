import {Stack, useTheme} from "@mui/material";
import {Fragment, FunctionComponent, useEffect} from 'react';
import {EditorGroups} from "./editor-groups/EditorGroups";
import {Sidebar} from "./sidebar/Sidebar";
import {StatusBar} from "./status-bar/StatusBar";
import {CloseDirectoryDialog} from "./common/close-directory-dialog/CloseDirectoryDialog";
import {NewDirectoryDialog} from "./common/new-directory-dialog/NewDirectoryDialog";
import {NewFileDialog} from "./common/new-file-dialog/NewFileDialog";
import {DeleteFileDialog} from "./common/delete-file-dialog/DeleteFileDialog";
import {AboutWildeDialog} from "./common/about-wilde-dialog/AboutWildeDialog";
import {ShortcutManager} from "./common/shortcut-manager/ShortcutManager";
import {useSelector} from "react-redux";
import {AppState} from "../store/AppStore";

export const App: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.openedDirectory.rootDirectory);
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

    return <Fragment>
        <ShortcutManager/>

        <Stack direction="column"
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
                <Sidebar/>
                <EditorGroups/>
            </Stack>

            <StatusBar/>
        </Stack>

        {rootDirectory && <Fragment>
            <CloseDirectoryDialog/>

            <NewDirectoryDialog/>

            <NewFileDialog/>

            <DeleteFileDialog/>
        </Fragment>}

        <AboutWildeDialog/>
    </Fragment>;
}
