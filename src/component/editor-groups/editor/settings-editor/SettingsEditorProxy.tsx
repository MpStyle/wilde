import {SettingsDefinitionKey, SettingsItemDefinition, SettingsValue} from "../../../../slice/SettingsSlice";
import React, {Fragment, FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";

export type SettingsEditorProxyProps = {
    item: SettingsItemDefinition,
    value: SettingsValue,
    setValue: (key: SettingsDefinitionKey, newValue: SettingsValue) => void,
    search: string
};

export const SettingsEditorProxy: FunctionComponent<SettingsEditorProxyProps> = props => {
    const {item, value, setValue, search} = props;
    const {t} = useTranslation();
    const labelId = `settings-item-label-${item.key.join('-')}`;
    const label = t(item.label ?? item.key[item.key.length - 1]);
    const description = item.description ? t(item.description) : '';
    const isVisible=`${label}, ${description}`.indexOf(search) !== -1;

    return <FormControl key={`settings-item-${item.key.join('-')}`}
                        fullWidth
                        sx={{display: isVisible ? 'flex' : 'none'}}>
        {item.type === 'boolean' &&
            <FormControlLabel required={!item.nullable}
                              control={
                                  <Checkbox checked={!!value}
                                            onChange={e => setValue(item.key, e.target.checked)}/>
                              }
                              label={label}/>}

        {item.type === 'free-string' &&
            <TextField
                type="text"
                label={label}
                value={value as string}
                onChange={e => setValue(item.key, e.target.value)}/>}

        {item.type === 'number' &&
            <TextField
                type="number"
                label={label}
                value={value as number}
                onChange={e => setValue(item.key, e.target.value)}/>}

        {item.type === 'string' && <Fragment>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                label={label}
                value={(value ?? item.defaultValue) as string}
                onChange={e => setValue(item.key, e.target.value)}>
                {(item.values ?? []).map(value =>
                    <MenuItem value={value} key={`settings-item-${item.key.join("-")}-select-${value}`}>
                        {value}
                    </MenuItem>)}
            </Select>
        </Fragment>}

        {item.description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
};
