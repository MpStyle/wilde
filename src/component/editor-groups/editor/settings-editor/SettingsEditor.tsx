import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, Stack, TextField, Typography, alpha, styled, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import cloneDeep from "lodash.clonedeep";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useWilde } from "../../../../hook/WildeHook";
import { Settings, updateSettings } from "../../../../slice/SettingsSlice";
import { AppDispatch, AppState } from "../../../../store/AppStore";
import { EditorProps } from "../../book/EditorProps";
import { tabPanelHeight } from "../../book/TabHeight";
import { BooleanSetting } from "./BooleanSetting";
import { SelectSetting } from "./SelectSetting";
import { FlatSettingEditorInfo, settingsEditorInfoMap as settingsEditorInfo } from "./entity/SettingsDefinition";

const SettingsEditorBox = styled(Box)(() => ({
    height: tabPanelHeight,
    margin: 0,
    padding: '0.5em',
    overflow: 'auto',
}));

const reactKeyBuilder = (key: string) => `settings-${key}-key`;
const labelKeyBuilder = (key: string) => `settings-${key}-label`;
const descriptionKeyBuilder = (key: string) => `settings-${key}-description`;

export const SettingsEditor: FunctionComponent<EditorProps> = props => {
    const settings = useSelector((appState: AppState) => appState.settings);
    const [state, setState] = useState<Settings>(settings);
    const [searchSettings, setSearchSettings] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();
    const theme = useTheme();
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

        wilde.subscribeTo(wilde.eventType.onSaveAll, onSaveAll);

        return () => wilde.unsubscribeFrom(wilde.eventType.onSaveAll, onSaveAll);
    });

    // Iterates throught "settingsDefinitions" to create a flat object with section, subsection and setting type
    const flatSettings = Object.entries(settingsEditorInfo).reduce((acc, [key, value]) => {
        const [section, subsection, item] = key.split("/");
        const label = t(labelKeyBuilder(key));
        const description = t(descriptionKeyBuilder(key));
        const newTags = [label, label, description];

        acc[section] = { type: 'section', label, description, tags: newTags.concat(acc[section]?.tags ?? []) };

        if (item !== undefined) {
            acc[`${section}/${subsection}`] = { type: 'subsection', label, description, tags: newTags.concat((acc[`${section}/${subsection}`]?.tags ?? [])) };
        }

        acc[key] = { ...value, label, description, tags: newTags.concat(acc[key]?.tags ?? []) };

        return acc;
    }, {} as { [key: string]: FlatSettingEditorInfo });
    const settingsKeys = Object.keys(flatSettings)
        .sort()
        .filter(sk => searchSettings === '' || flatSettings[sk].tags.filter(tag => tag.toLowerCase().indexOf(searchSettings.toLowerCase()) !== -1).length);

    return <SettingsEditorBox id="SettingsEditorBox">
        <TextField size="small"
            fullWidth
            placeholder={t("Search settings..")}
            sx={{
                mb: 2,
                "& .Mui-focused .MuiIconButton-root": { color: "primary.main" },
                "& .Mui-focused .MuiTypography-root": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.6),
                    color: theme.palette.primary.contrastText
                },
            }}
            value={searchSettings}
            onChange={e => setSearchSettings(e.target.value)}
            InputProps={{
                endAdornment: (
                    <Stack direction='row' sx={{ alignItems: 'center' }}>
                        {searchSettings !== '' && <Typography variant="caption" sx={{ color: theme.palette.grey[500], whiteSpace: 'nowrap', border: `1px solid ${theme.palette.grey[500]}`, padding: '2px 15px', borderRadius: '10px', fontWeight: 'bold' }}>
                            {settingsKeys.filter(sk => flatSettings[sk].type !== 'section' && flatSettings[sk].type !== 'subsection').length} Settings found
                        </Typography>}
                        <IconButton
                            sx={{ visibility: searchSettings !== '' ? "visible" : "hidden" }}
                            onClick={() => setSearchSettings('')}>
                            <ClearIcon />
                        </IconButton>
                    </Stack>
                ),
            }} />

        <Stack direction='column' spacing={1.5}>
            {settingsKeys.map((key) => {
                const settingKey = key as keyof Settings;
                const settingDefinition = flatSettings[settingKey];
                const reactKey = reactKeyBuilder(key);

                switch (settingDefinition.type) {
                    case 'section':
                        return <Typography key={reactKey} variant="h5" data-tags={settingDefinition.tags}>
                            {settingDefinition.label}
                        </Typography>
                    case 'subsection':
                        return <Typography key={reactKey} variant="h6" data-tags={settingDefinition.tags}>
                            {settingDefinition.label}
                        </Typography>
                    case 'boolean':
                        return <BooleanSetting key={reactKey}
                            data-tags={settingDefinition.tags}
                            label={settingDefinition.label}
                            description={settingDefinition.description}
                            sx={{ ml: 1.5 }}
                            value={state[settingKey] as boolean}
                            setValue={(newValue) => {
                                const newState = cloneDeep(state);
                                (newState[settingKey] as boolean) = newValue;

                                setNewSettings(newState);
                            }} />
                    case "strings":
                        return <SelectSetting key={reactKey}
                            data-tags={settingDefinition.tags}
                            settingsKey={key}
                            label={settingDefinition.label}
                            description={settingDefinition.description}
                            sx={{ ml: 1.5 }}
                            value={state[settingKey] as string}
                            options={settingDefinition.options}
                            setValue={(newValue) => {
                                const newState = cloneDeep(state);
                                (newState[settingKey] as (string | undefined)) = newValue;

                                setNewSettings(newState);
                            }} />
                    default:
                        return null;
                }
            })}
        </Stack>
    </SettingsEditorBox>
}