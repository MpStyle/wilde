import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const localStorageKey = "wilde-settings";

export class Settings {
    'editor/minimap/enabled': boolean;
    'editor/minimap/autoHide'?: boolean;
}

export type SettingsType = 'boolean' | 'string' | 'number' | Array<string>;

export type SettingsDefinition = {
    [K in keyof Settings]: SettingsType;
};

interface SettingsState {
    settings: Settings;
    settingsDefinitions: SettingsDefinition;
}

const localStorageSettings = localStorage.getItem(localStorageKey);
const settings = localStorageSettings ? JSON.parse(localStorageSettings) : {
    "editor/minimap/enabled": true
}

const initialState: SettingsState = {
    settings,
    settingsDefinitions: {
        "editor/minimap/enabled": 'boolean',
        "editor/minimap/autoHide": 'boolean'
    }
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSettings: (state, action: PayloadAction<Settings>) => {
            state.settings = action.payload;
            localStorage.setItem(localStorageKey, JSON.stringify(state.settings));
        },
    },
})

export const { updateSettings } = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer;