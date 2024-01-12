import { FunctionComponent, PropsWithChildren, createContext, useContext } from "react";

type EventName = "onSave";

type Listener = () => void;

type Listeners = Record<EventName, Listener[]>;

interface WildeAction {
    addEventListener: (eventName: EventName, callback: Listener) => void;
    removeEventListener: (eventName: EventName, callback: Listener) => void;
    saveAllEditors: () => void;
}

const emptyListener: Listener = () => { }

const WildeContext = createContext<WildeAction>({
    addEventListener: emptyListener,
    removeEventListener: emptyListener,
    saveAllEditors: emptyListener
});

export const useWildeContext = () => useContext(WildeContext);

const listeners: Listeners = {
    onSave: [],
};

export const WildeProvider: FunctionComponent<PropsWithChildren> = props => {
    return <WildeContext.Provider value={{
        addEventListener: (eventName: EventName, callback: Listener) => {
            listeners[eventName].push(callback);
        },
        removeEventListener: (eventName, callback) => {
            const callbacks = listeners[eventName];

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
        },
        saveAllEditors: () => {
            const onSaveListeners = listeners['onSave'];

            if (onSaveListeners) {
                for (let index = 0; index < onSaveListeners.length; index++) {
                    onSaveListeners[index]();
                }
            }
        }
    }}>
        {props.children}
    </WildeContext.Provider>
}