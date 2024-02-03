import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LogUtils } from '../book/LogUtils';

const localStorageKey = "wilde-settings";

export class Settings {
    'editor/minimap/enabled': boolean;
    'editor/minimap/autoHide'?: boolean;
    'editor/language/default'?: string;
}

const initialState = (() => {
    const defaultSettings: Settings = {
        "editor/minimap/enabled": true,
    };
    const localStorageSettings = localStorage.getItem(localStorageKey);
    let userSettings = {};
    try {
        userSettings = localStorageSettings ? JSON.parse(localStorageSettings) : {}
    }
    catch (e) {
        LogUtils.error("Invalid local storage settings");
    }

    return { ...defaultSettings, ...userSettings }
})()

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSettings: (state, action: PayloadAction<Settings>) => {
            Object.assign(state, action.payload);
            localStorage.setItem(localStorageKey, JSON.stringify(state));
        },
    },
})

export const { updateSettings } = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer;