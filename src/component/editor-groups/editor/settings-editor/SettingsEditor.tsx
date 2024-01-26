import { Typography, styled } from "@mui/material";
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

const SettingsEditorBox = styled(Box)(() => ({
    height: tabPanelHeight,
    m: 0,
    p: 0,
    overflow: 'auto',
}));

export const SettingsEditor: FunctionComponent<EditorProps> = props => {
    const settings = useSelector((appState: AppState) => appState.settings.settings);
    const [state, setState] = useState<Settings>(JSON.parse(JSON.stringify(settings)));
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();
    const { t } = useTranslation();
    const setNewSettings = (f: (s: Settings) => Settings) => {
        setState(f);
        props.onContentChange();
    }

    // onSave event listener
    useEffect(() => {
        const onSaveAll = () => {
            dispatch(updateSettings(state));
            props.onContentSave();
        }

        wilde.addEventListener('onSaveAll', onSaveAll);

        return () => wilde.removeEventListener('onSaveAll', onSaveAll);
    });

    return <SettingsEditorBox>
        <Typography variant="h5">Editor</Typography>

        <Typography variant="h6">Minimap</Typography>

        <BooleanSetting name="enabled"
            value={state.editor.minimap.enabled}
            setValue={(newValue) => {
                setNewSettings(state => {
                    const newState = cloneDeep(state);
                    newState.editor.minimap.enabled = newValue;
                    return newState;
                });
            }} />

        <BooleanSetting name="autohide"
            value={state.editor.minimap.autoHide}
            setValue={(newValue) => {
                setNewSettings(state => {
                    const newState = cloneDeep(state);
                    newState.editor.minimap.autoHide = newValue;
                    return newState;
                });
            }} />
    </SettingsEditorBox>
}