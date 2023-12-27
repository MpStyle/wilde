import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './component/App';
import {Provider} from "react-redux";
import {appStore} from "./store/AppStore";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={appStore}>
            <App/>
        </Provider>
    </React.StrictMode>
);