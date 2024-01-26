import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

export interface BooleanSettingProps {
    name: string;
    value: boolean | undefined;
    setValue: (newValue: boolean) => void;
}

export const BooleanSetting: FunctionComponent<BooleanSettingProps> = props => {
    const { t } = useTranslation();
    return <FormControl fullWidth>
        <FormControlLabel
            control={
                <Checkbox checked={props.value}
                    onChange={e => props.setValue(e.target.checked)} />
            }
            label={t(`settings-${props.name}-label`)} />
        <FormHelperText>{t(`settings-${props.name}-description`)}</FormHelperText>
    </FormControl>
}