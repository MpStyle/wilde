export type WildeEvent = {};

// ---------------

//#region Events definitions
//#endregion

type AppEventMap = {
    onSaveAll: WildeEvent,
    onCloseDirectory: WildeEvent,
    onNewDirectory: WildeEvent,
    onNewFile: WildeEvent,
    onDeleteFile: WildeEvent,
    onShowAbout: WildeEvent,
}

// ---------------

export type EventName = keyof AppEventMap;

type State = {
    [K in keyof AppEventMap]: Array<(event: AppEventMap[K]) => void>;
};

const state: State = {
    onCloseDirectory: [],
    onSaveAll: [],
    onNewDirectory: [],
    onNewFile: [],
    onDeleteFile: [],
    onShowAbout: []
};

export const useWilde = () => {
    const emitEvent = <K extends keyof AppEventMap>(eventName: K, event: AppEventMap[K]) => {
        const onCloseListeners = state[eventName];
        for (let index = 0; index < onCloseListeners.length; index++) {
            onCloseListeners[index](event);
        }
    };
    const addEventListener = <K extends keyof AppEventMap>(eventName: K, callback: (ev: AppEventMap[K]) => void) => {
        state[eventName].push(callback);
    };
    const removeEventListener = <K extends keyof AppEventMap>(eventName: K, callback: (ev: AppEventMap[K]) => void) => {
        const callbacks = state[eventName];

        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            } else {
                console.error('Callback not found for the given key.');
            }
        } else {
            console.error('Key not found in the data structure.');
        }
    };

    return {
        closeDirectory: () => emitEvent('onCloseDirectory', {}),
        saveAll: () => emitEvent('onSaveAll', {}),
        newDirectory: () => emitEvent('onNewDirectory', {}),
        newFile: () => emitEvent('onNewFile', {}),
        deleteFile: () => emitEvent('onDeleteFile', {}),
        showAbout: () => emitEvent('onShowAbout', {}),
        addEventListener,
        removeEventListener
    }
}