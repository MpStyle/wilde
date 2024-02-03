import { Settings } from "../../../../../slice/SettingsSlice";

type SettingEditorSectionInfo = {
    readonly type: 'section' | 'subsection'
}

type SettingEditorBooleanInfo = {
    readonly type: 'boolean'
}

type SettingEditorStringInfo = {
    readonly type: 'string'
}

type SettingEditorNumberInfo = {
    readonly type: 'number',
    min?: number,
    max?: number,
}

export type SettingEditorStringsOption = { value: string | undefined, name?: string, isDefault?: boolean }

type SettingEditorStringsInfo = {
    readonly type: 'strings',
    options: Array<SettingEditorStringsOption>,
}

export type SettingEditorInfo = SettingEditorBooleanInfo | SettingEditorStringInfo | SettingEditorNumberInfo | SettingEditorStringsInfo;

type SettingsEditorInfoMap = {
    [K in keyof Settings]: SettingEditorInfo;
};

export const settingsEditorInfoMap: SettingsEditorInfoMap = {
    "editor/minimap/enabled": { type: 'boolean' },
    "editor/minimap/autoHide": { type: 'boolean' },
    'editor/language/default': { type: 'strings', options: [{ value: undefined, name: 'Auto detect', isDefault: true }, { value: 'en' }, { value: 'it' }] }
}

export type FlatSettingEditorInfo = (SettingEditorSectionInfo | SettingEditorInfo) & {
    tags: string[];
    label: string;
    description: string;
};