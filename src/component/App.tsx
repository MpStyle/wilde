import React, {FunctionComponent} from 'react';
import './App.css';
import {ProjectExplorer} from "./project-explorer/ProjectExplorer";

export const App: FunctionComponent = () => {
    return <div className="App">
        <ProjectExplorer/>
    </div>;
}
