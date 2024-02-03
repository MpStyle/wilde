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
import ClearIcon from '@mui/icons-material/Clear';
import { settingsDefinitions } from "./entity/SettingsDefinition";
import { FlatSettingsType } from "./entity/FlatSettingsType";

const SettingsEditorBox = styled(Box)(() => ({
    height: tabPanelHeight,
    margin: 0,
    padding: '0.5em',
    overflow: 'auto',
}));

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

    const reactKeyBuilder = (key: string) => `settings-${key}-key`;
    const labelBuilder = (key: string) => t(`settings-${key}-label`);
    const descriptionBuilder = (key: string) => t(`settings-${key}-description`);

    // Iterates throught "settingsDefinitions" to create a flat object with section, subsection and setting type
    const flatSettings = Object.entries(settingsDefinitions).reduce((acc, [key, value]) => {
        const upsert = (key: string, type: FlatSettingsType, tags: string[]) => {
            if (!acc[key]) {
                acc[key] = { type, tags: [] };
            }
            acc[key].tags = [...acc[key].tags, ...tags];
        }
        const [section, subsection, item] = key.split("/");

        upsert(section, 'section', [labelBuilder(key), descriptionBuilder(key)]);

        if (item !== undefined) {
            upsert(`${section}/${subsection}`, 'subsection', [labelBuilder(key), descriptionBuilder(key)]);
        }

        upsert(key, value, [labelBuilder(key), descriptionBuilder(key)]);
        return acc;
    }, {} as { [key: string]: { type: FlatSettingsType, tags: string[] } });
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
                const label = labelBuilder(key);
                const description = descriptionBuilder(key);

                switch (settingDefinition.type) {
                    case 'section':
                        return <Typography key={reactKey} variant="h5" data-tags={settingDefinition.tags}>
                            {label}
                        </Typography>
                    case 'subsection':
                        return <Typography key={reactKey} variant="h6" data-tags={settingDefinition.tags}>
                            {label}
                        </Typography>
                    case 'boolean':
                        return <BooleanSetting key={reactKey}
                            data-tags={settingDefinition.tags}
                            label={label}
                            description={description}
                            sx={{ ml: 1.5 }}
                            value={state[settingKey] as boolean}
                            setValue={(newValue) => {
                                const newState = cloneDeep(state);
                                (newState[settingKey] as boolean) = newValue;

                                setNewSettings(newState);
                            }} />
                    default:
                        if (!Array.isArray(settingDefinition.type)) {
                            return null;
                        }

                        return <SelectSetting key={reactKey}
                            data-tags={settingDefinition.tags}
                            settingsKey={key}
                            label={label}
                            description={description}
                            sx={{ ml: 1.5 }}
                            value={state[settingKey] as string}
                            options={settingDefinition.type}
                            setValue={(newValue) => {
                                const newState = cloneDeep(state);
                                (newState[settingKey] as (string | undefined)) = newValue;

                                setNewSettings(newState);
                            }} />
                }
            })}
        </Stack>
    </SettingsEditorBox>
}