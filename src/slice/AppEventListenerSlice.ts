import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WildeEvent = {};

// ---------------

//#region Events definitions
export interface OnSaveEvent extends WildeEvent { }
export interface OnCloseDirectoryEvent extends WildeEvent { }
//#endregion

type StateDefinition = {
    onSaveAll: OnSaveEvent,
    onCloseDirectory: OnCloseDirectoryEvent
}

// ---------------

export type EventName = keyof StateDefinition;

type EventCallback<K extends keyof StateDefinition = EventName> = { eventName: K, callback: (event: StateDefinition[K]) => void };

type State = {
    [K in keyof StateDefinition]: Array<(event: StateDefinition[K]) => void>;
};

const initialState: State = {
    onCloseDirectory: [],
    onSaveAll: []
};

export const eventListenerSlice = createSlice({
    name: 'appEventListener',
    initialState,
    reducers: {
        addAppEventListener: (state, action: PayloadAction<EventCallback>) => {
            state[action.payload.eventName].push(action.payload.callback);
        },
        removeAppEventListener: (state, action: PayloadAction<EventCallback>) => {
            const callbacks = state[action.payload.eventName];

            if (callbacks) {
                const index = callbacks.indexOf(action.payload.callback);
                if (index !== -1) {
                    callbacks.splice(index, 1);
                } else {
                    console.error('Callback not found for the given key.');
                }
            } else {
                console.error('Key not found in the data structure.');
            }
        },
    }
});

export const { addAppEventListener, removeAppEventListener } = eventListenerSlice.actions

export const eventListenerReducer = eventListenerSlice.reducer;