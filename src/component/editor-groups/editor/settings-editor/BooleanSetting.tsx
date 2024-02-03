import { Box, SxProps, Theme } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

export interface BooleanSettingProps {
    label: string;
    description: string;
    value: boolean | undefined;
    setValue: (newValue: boolean) => void;
    sx?: SxProps<Theme>;
}

export const BooleanSetting: FunctionComponent<BooleanSettingProps> = props => {
    const { t } = useTranslation();

    return <Box sx={props.sx}>
        <FormControl>
            <FormControlLabel
                control={
                    <Checkbox checked={props.value}
                        onChange={e => props.setValue(e.target.checked)} />
                }
                label={props.label} />
            <FormHelperText sx={{ mt: 0 }}>{props.description}</FormHelperText>
        </FormControl>
    </Box>
}