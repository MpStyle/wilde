import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from "react-redux";
import i18n from './book/i18n';
import { SplashScreen } from './component/SplashScreen';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { appStore } from "./store/AppStore";

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
                    <SplashScreen />
                </Provider>
            </I18nextProvider>
        </ThemeProvider>
    </React.StrictMode>
);

serviceWorker.register();
