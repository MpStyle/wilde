import Box from "@mui/material/Box";
import React, {FunctionComponent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../../../../store/AppStore";
import {EditorProps} from "../../book/EditorProps";
import {
    SettingsDefinitionKey,
    SettingsItemDefinition,
    SettingsValue,
    updateSettings
} from "../../../../slice/SettingsSlice";
import {StringUtils} from "../../../../book/StringUtils";
import Typography from "@mui/material/Typography";
import {useWilde} from "../../../../hook/WildeHook";
import isequal from "lodash.isequal";
import {SettingsEditorProxy} from "./SettingsEditorProxy";

interface GroupedSettings {
    [key: string]: SettingsItemDefinition | GroupedSettings;
}

const groupSettings = (settingsDefinition: SettingsItemDefinition[]): GroupedSettings => {
    const groupedSettings: GroupedSettings = {};
    const sorted = [...settingsDefinition].sort((a, b) =>
        a.key.join('/').localeCompare(b.key.join('/')));

    sorted.forEach(item => {
        let currentGroup: any = groupedSettings;

        // Iterate over each part of the key to create nested objects
        item.key.forEach((keyPart, index) => {
            if (index === item.key.length - 1) {
                // Last part of the key, assign the item
                currentGroup[keyPart] = item;
            } else {
                // Create or update nested group
                currentGroup[keyPart] = currentGroup[keyPart] || {};
                currentGroup = currentGroup[keyPart];
            }
        });
    });

    return groupedSettings;
}

export const SettingsEditor: FunctionComponent<EditorProps> = props => {
    const settings = useSelector((appState: AppState) => appState.settings.values);
    const settingsDefinition = useSelector((appState: AppState) => appState.settings.definition);
    const [state, setState] = useState(settings);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();
    const groupedSettingsDefinition = groupSettings(settingsDefinition.items);

    useEffect(() => {
        if (!isequal(state, settings)) {
            props.onContentChange();
        }
    }, [settings, state]);

    // onSave event listener
    useEffect(() => {
        const onSaveAll = () => {
            dispatch(updateSettings(state));
            props.onContentSave();
        }

        wilde.subscribeTo(wilde.eventType.onSaveAll, onSaveAll);

        return () => wilde.unsubscribeFrom(wilde.eventType.onSaveAll, onSaveAll);
    });

    const setValue = (key: SettingsDefinitionKey, newValue: SettingsValue) => {
        setState(state => ({
            ...state,
            [key.join('/')]: newValue
        }));
    }

    return <Box sx={{pl: 2, pr: 2}}>
        {Object.keys(groupedSettingsDefinition).map(levelOneKey => {
            const levelOne = groupedSettingsDefinition[levelOneKey];

            if (levelOne.hasOwnProperty("key")) {
                const item = levelOne as SettingsItemDefinition;
                return <SettingsEditorProxy key={`settings-item-${item.key.join("-")}`}
                               item={item}
                               value={state[item.key.join('/')]}
                               setValue={setValue}/>
            }

            const levelOneGrouped = levelOne as GroupedSettings;

            return <Box key={`settings-level-one-${levelOneKey}`}>
                <Typography variant="h5" sx={{pt: 2, pb: 1}}>
                    {StringUtils.capitalize(levelOneKey)}
                </Typography>

                {Object.keys(levelOne).map(levelTwoKey => {
                    const levelTwo = levelOneGrouped[levelTwoKey];

                    if (levelTwo.hasOwnProperty("key")) {
                        const item = levelTwo as SettingsItemDefinition;
                        return <SettingsEditorProxy key={`settings-item-${item.key.join("-")}`}
                                       item={item}
                                       value={state[item.key.join('/')]}
                                       setValue={setValue}/>
                    }

                    const levelTwoGrouped = levelTwo as GroupedSettings;

                    return <Box key={`settings-level-two-${levelOneKey}`}>
                        <Typography variant="h6" sx={{pt: 1.5, pb: 0.5}}>
                            {StringUtils.capitalize(levelTwoKey)}
                        </Typography>

                        {Object.keys(levelTwo).map(levelThreeKey => {
                            const item = levelTwoGrouped[levelThreeKey] as SettingsItemDefinition;

                            return <SettingsEditorProxy key={`settings-item-${item.key.join("-")}`}
                                           item={item}
                                           value={state[item.key.join('/')]}
                                           setValue={setValue}/>
                        })}
                    </Box>
                })}
            </Box>
        })}
    </Box>
}
