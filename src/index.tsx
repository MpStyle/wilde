import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './component/App';
import { Provider } from "react-redux";
import { appStore } from "./store/AppStore";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as serviceWorker from './serviceWorker';
import { ShortcutManager } from './component/common/shortcut-manager/ShortcutManager';
import { CloseDirectoryDialog } from './component/common/close-directory-dialog/CloseDirectoryDialog';
import { NewDirectoryDialog } from './component/common/new-directory-dialog/NewDirectoryDialog';
import { NewFileDialog } from './component/common/new-file-dialog/NewFileDialog';
import { DeleteFileDialog } from './component/common/delete-file-dialog/DeleteFileDialog';
import { AboutWildeDialog } from './component/common/about-wilde-dialog/AboutWildeDialog';
import i18n from './book/i18n';
import { I18nextProvider } from 'react-i18next';

const theme = createTheme({
    typography: {
        fontSize: 14
    },
    palette: {
        primary: {
            main: '#3D44FF',
            contrastText: '#fff'
        },
        secondary: {
            main: '#6CB5FF',
        },
    },
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
                <Provider store={appStore}>
                    <ShortcutManager />

                    <App />

                    <CloseDirectoryDialog />

                    <NewDirectoryDialog />

                    <NewFileDialog />

                    <DeleteFileDialog />

                    <AboutWildeDialog />
                </Provider>
            </I18nextProvider>
        </ThemeProvider>
    </React.StrictMode>
);

serviceWorker.register();
