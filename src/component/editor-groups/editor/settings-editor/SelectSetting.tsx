import { Box, FormHelperText, InputLabel, MenuItem, Select, Stack, SxProps, Theme, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { SettingEditorStringsOption } from "./entity/SettingsDefinition";

export interface SelectSettingProps {
    settingsKey: string;
    label: string;
    description: string;
    value: string | undefined;
    options: SettingEditorStringsOption[]
    setValue: (newValue: string | undefined) => void;
    sx?: SxProps<Theme>;
}

export const SelectSetting: FunctionComponent<SelectSettingProps> = props => {
    const { t } = useTranslation();
    const undefinedValue = "####UNDEFINED####";

    return <Box sx={props.sx}>
        <FormControl>
            <InputLabel id={`settings-${props.settingsKey}-select-label`}>{props.label}</InputLabel>
            <Select
                labelId={`settings-${props.settingsKey}-select-label`}
                id={`settings-${props.settingsKey}-select`}
                value={props.value ?? undefinedValue}
                label={props.label}
                onChange={e => props.setValue(e.target.value === undefinedValue ? undefined : e.target.value)}>
                {props.options.map((o, index) => <MenuItem value={o.value ?? undefinedValue} key={`settings-${props.settingsKey}-select-value-${o.name ?? o.value ?? index}`}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline' }}>
                        <span>{o.name ? t(o.name) : o.value}</span>
                        {o.isDefault && <Typography variant="caption" color='primary'>DEFAULT</Typography>}
                    </Stack>
                </MenuItem>)}
            </Select>
            <FormHelperText sx={{ mt: 0 }}>{props.description}</FormHelperText>
        </FormControl >
    </Box>
}