import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EventName = "onSave" | "onCloseDirectory";

type Listener = () => void;

type Listeners = Record<EventName, Listener[]>;

const initialState: Listeners = {
    onSave: [],
    onCloseDirectory: []
};

export const eventListenerSlice = createSlice({
    name: 'appEventListener',
    initialState,
    reducers: {
        addAppEventListener: (state, action: PayloadAction<{ eventName: EventName, callback: Listener }>) => {
            state[action.payload.eventName].push(action.payload.callback);
        },
        removeAppEventListener: (state, action: PayloadAction<{ eventName: EventName, callback: Listener }>) => {
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

export const { addAppEventListener: addEventListener, removeAppEventListener: removeEventListener } = eventListenerSlice.actions

export const eventListenerReducer = eventListenerSlice.reducer;