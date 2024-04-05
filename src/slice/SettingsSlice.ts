import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {LogUtils} from '../book/LogUtils';

const localStorageKey = "wilde-settings";

export type SettingsDefinitionKey = [string, string, string] | [string, string];

export interface SettingsItemDefinition {
    key: SettingsDefinitionKey,
    nullable?: boolean;
    type: "string" | "free-string" | "boolean" | "number";
    defaultValue?: string | boolean | number | null;
    values?: string[] | number[];
    label?: string;
    description?: string;
}

export interface SettingsDefinition {
    items: SettingsItemDefinition[];
}

const settingsDefinition: SettingsDefinition = {
    items: [
        {
            key: ['editor', 'minimap', 'enabled'],
            type: 'boolean',
            defaultValue: true,
            label: 'Minimap enabled',
            description: 'Show minimap on the right side of the editor'
        },
        {
            key: ['editor', 'language'],
            nullable: true,
            type: 'string',
            defaultValue: 'en',
            values: ['en', 'it'],
            label: 'Default language',
            description: 'Default language for the editor'
        },
        {
            key: ['editor', 'minimap', 'autoHide'],
            nullable: true,
            type: 'boolean',
            defaultValue: true,
            label: 'Auto hide minimap',
            description: 'Hide minimap when not in use'
        },
    ]
}

export type SettingsValue = string | boolean | number | null;

export interface Settings {
    [key: string]: SettingsValue;
}

type SettingsSliceState = {
    values: Settings,
    definition: SettingsDefinition
}

const settingsValues: Settings = (() => {
    const defaultSettings: Settings = {};

    for (const item of settingsDefinition.items.filter(i => i.defaultValue)) {
        defaultSettings[item.key.join("/")] = item.defaultValue!;
    }

    const localStorageSettings = localStorage.getItem(localStorageKey);
    let userSettings = {} as Settings;
    try {
        userSettings = localStorageSettings ? JSON.parse(localStorageSettings) : {};
    } catch (e) {
        LogUtils.error("Invalid local storage settings");
    }

    return {...defaultSettings, ...userSettings}
})()

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {values: settingsValues, definition: settingsDefinition},
    reducers: {
        updateSettings: (state, action: PayloadAction<Settings>) => {
            state.values = action.payload;
            localStorage.setItem(localStorageKey, JSON.stringify(state.values));
        },
        addSettingsDefinition: (state, action: PayloadAction<SettingsItemDefinition>) => {
            state.definition.items.push(action.payload);
        },
    },
})

export const {updateSettings, addSettingsDefinition} = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer;