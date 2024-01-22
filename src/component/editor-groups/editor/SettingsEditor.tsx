import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { FunctionComponent, useEffect, useState } from "react";
import { tabPanelHeight } from "../book/TabHeight";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../store/AppStore";
import { useWilde } from "../../../hook/WildeHook";
import { Settings, updateSettings } from "../../../slice/SettingsSlice";
import { EditorProps } from "../book/EditorProps";

export const SettingsEditor: FunctionComponent<EditorProps> = props => {
    const settings = useSelector((appState: AppState) => appState.settings.settings);
    const [state, setState] = useState<Settings>(JSON.parse(JSON.stringify(settings)));
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();
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

    return <Box sx={{
        height: tabPanelHeight,
        m: 0,
        p: 0,
        overflow: 'auto',
    }}>
        <Box>
            <Typography variant="h5">Editor</Typography>

            <Typography variant="h6">Minimap</Typography>

            <Typography variant="subtitle1">Enabled</Typography>

            <FormControlLabel
                control={
                    <Checkbox checked={state.editor.minimap.enabled}
                        onChange={e => setNewSettings(state => {
                            const newState = { ...state };
                            newState.editor.minimap.enabled = e.target.checked;
                            return newState;
                        })} />
                }
                label="Controls whether the minimap is shown" />

            <Typography variant="subtitle1">Autohide</Typography>

            <FormControlLabel
                control={
                    <Checkbox checked={state.editor.minimap.autoHide}
                        onChange={e => setNewSettings(state => {
                            const newState = { ...state };
                            newState.editor.minimap.autoHide = e.target.checked;
                            return newState;
                        })} />
                }
                label="Controls whether the minimap is hidden automatically" />
        </Box>
    </Box>
}