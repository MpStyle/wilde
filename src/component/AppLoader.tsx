import React, { Fragment } from 'react';
import { useCheckCompatibility } from '../hook/CheckCompatibilityHook';
import CompatibilityResult from './CompatibilityResult';
import { App } from './App';

const AppLoader: React.FC = () => {
    const compatibilityResult = useCheckCompatibility();

    return <Fragment>
        {!compatibilityResult.isCompatible && <CompatibilityResult {...compatibilityResult} />}
        {compatibilityResult.isCompatible && <App />}
    </Fragment>;
};

export default AppLoader;