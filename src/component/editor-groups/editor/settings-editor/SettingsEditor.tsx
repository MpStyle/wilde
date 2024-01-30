import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";
import cloneDeep from "lodash.clonedeep";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useWilde } from "../../../../hook/WildeHook";
import { Settings, SettingsType, updateSettings } from "../../../../slice/SettingsSlice";
import { AppDispatch, AppState } from "../../../../store/AppStore";
import { EditorProps } from "../../book/EditorProps";
import { tabPanelHeight } from "../../book/TabHeight";
import { BooleanSetting } from "./BooleanSetting";

const SettingsEditorBox = styled(Box)(() => ({
    height: tabPanelHeight,
    margin: 0,
    padding: '0.5em',
    overflow: 'auto',
}));

export const SettingsEditor: FunctionComponent<EditorProps> = props => {
    const settings = useSelector((appState: AppState) => appState.settings.settings);
    const settingsDefinitions = useSelector((appState: AppState) => appState.settings.settingsDefinitions);
    const [state, setState] = useState<Settings>(settings);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();
    const { t } = useTranslation();
    const setNewSettings = (newState: Settings) => {
        setState(newState);

        if (JSON.stringify(newState) === JSON.stringify(settings)) {
            props.onContentRestore();
        }
        else {
            props.onContentChange();
        }
    }

    // onSave event listener
    useEffect(() => {
        const onSaveAll = () => {
            dispatch(updateSettings(state));
            props.onContentSave();
        }

        wilde.subscribeTo(wilde.event.onSaveAll, onSaveAll);

        return () => wilde.unsubscribeFrom(wilde.event.onSaveAll, onSaveAll);
    });

    // Iterates throught "settingsDefinitions" to create a flat object with section, subsection and setting type
    const flatSettings = Object.entries(settingsDefinitions).reduce((acc, [key, value]) => {
        const [section, subsection, item] = key.split("/");
        acc[section] = 'section';

        if (item !== undefined) {
            acc[`${section}/${subsection}`] = 'subsection';
        }

        acc[key] = value;
        return acc;
    }, {} as { [key: string]: 'section' | 'subsection' | SettingsType });
    const settingsKeys = Object.keys(flatSettings).sort();

    return <SettingsEditorBox id="SettingsEditorBox">
        {settingsKeys.map((key) => {
            const settingKey = key as keyof Settings;
            const settingDefinition = flatSettings[settingKey];

            switch (settingDefinition) {
                case 'section':
                    return <Typography key={`settings-${key}-item`} variant="h5">{t(`settings-${key}-label`)}</Typography>
                case 'subsection':
                    return <Typography key={`settings-${key}-item`} variant="h6">{t(`settings-${key}-label`)}</Typography>
                case 'boolean':
                    return <BooleanSetting key={`settings-${key}-item`}
                        name={settingKey}
                        sx={{ ml: 1.5 }}
                        value={state[settingKey] as boolean}
                        setValue={(newValue) => {
                            const newState = cloneDeep(state);
                            newState[settingKey] = newValue;

                            setNewSettings(newState);
                        }} />
                default: return null;
            }
        })}
    </SettingsEditorBox>
}