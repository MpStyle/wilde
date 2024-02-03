import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LogUtils } from '../book/LogUtils';

const localStorageKey = "wilde-settings";

export class Settings {
    'editor/minimap/enabled': boolean;
    'editor/minimap/autoHide'?: boolean;
    'editor/language/default'?: string;
}

export type SettingsOption = { value: string | undefined, name?: string, isDefault?: boolean }

export type SettingsType = 'boolean' | 'string' | 'number' | Array<SettingsOption>;

export type SettingsDefinition = {
    [K in keyof Settings]: SettingsType;
};

interface SettingsState {
    settings: Settings;
    settingsDefinitions: SettingsDefinition;
}

const settings = (() => {
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

const initialState: SettingsState = {
    settings,
    settingsDefinitions: {
        "editor/minimap/enabled": 'boolean',
        "editor/minimap/autoHide": 'boolean',
        'editor/language/default': [{ value: undefined, name: 'Auto detect', isDefault: true }, { value: 'en' }, { value: 'it' }]
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