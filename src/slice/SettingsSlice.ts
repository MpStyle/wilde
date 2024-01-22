import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Settings {
    editor: {
        minimap: {
            enabled: boolean;
            autoHide?: boolean;
        }
    }
}

interface SettingsState {
    settings: Settings;
}

const initialState: SettingsState = {
    settings: {
        editor: {
            minimap: {
                enabled: true,
            }
        }
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