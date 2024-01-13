import { FunctionComponent, useEffect, useState } from 'react';
import { useWilde } from '../../../hook/WildeHook';

export const ShortcutManager: FunctionComponent = () => {
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);
    const wilde = useWilde();

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
            wilde.saveAll();
        }
    }, [pressedKeys]);

    return <div />;
};