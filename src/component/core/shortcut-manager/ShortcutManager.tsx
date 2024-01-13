import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/AppStore';

export const ShortcutManager: FunctionComponent = () => {
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);
    const listeners = useSelector((appState: AppState) => appState.eventListeners);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (!pressedKeys.includes(key)) {
                setPressedKeys((prevKeys) => [...prevKeys, key]);
            }

            if (key === 's' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key;

            if (pressedKeys.includes(key)) {
                setPressedKeys((prevKeys) => prevKeys.filter((pressedKey) => pressedKey !== key));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [pressedKeys]);

    useEffect(() => {
        const isCtrlPressed = pressedKeys.includes('Control') || pressedKeys.includes('Meta');
        const isSPressed = pressedKeys.includes('s');

        if (isCtrlPressed && isSPressed) {
            const listener = listeners['onSave'];

            if (listener) {
                for (let index = 0; index < listener.length; index++) {
                    listener[index]();
                }
            }
        }
    }, [pressedKeys]);

    return <div />;
};