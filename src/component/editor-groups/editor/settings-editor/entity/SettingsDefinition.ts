import { Settings } from "../../../../../slice/SettingsSlice";
import { SettingsType } from "./SettingsType";

type SettingsDefinition = {
    [K in keyof Settings]: SettingsType;
};

export const settingsDefinitions: SettingsDefinition = {
    "editor/minimap/enabled": 'boolean',
    "editor/minimap/autoHide": 'boolean',
    'editor/language/default': [{ value: undefined, name: 'Auto detect', isDefault: true }, { value: 'en' }, { value: 'it' }]
}