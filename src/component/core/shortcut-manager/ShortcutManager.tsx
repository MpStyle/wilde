import React, { useEffect, useState } from 'react';
import { useWildeContext } from '../wilde-context/WildeContext';

export const ShortcutManager: React.FC = () => {
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);
    const wildeContext = useWildeContext();

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
        const isSPressed = pressedKeys.includes('s') || pressedKeys.includes('S');

        if (isCtrlPressed && isSPressed) {
            wildeContext.saveAllEditors();
        }
    }, [pressedKeys]);

    return <div />;
};