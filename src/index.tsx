import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './component/App';
import {Provider} from "react-redux";
import {appStore} from "./store/AppStore";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import * as serviceWorker from './serviceWorker';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3D44FF',
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
            <Provider store={appStore}>
                <App/>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>
);

serviceWorker.register();
