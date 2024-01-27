import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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

const initialState: SettingsState = {
    settings: {
        "editor/minimap/enabled": true
    },
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
        },
    },
})

export const { updateSettings } = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer;