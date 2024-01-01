import React, {Fragment, FunctionComponent} from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useSelector} from "react-redux";
import {AppState} from "../../store/AppStore";
import {EditorProxy} from "./EditorProxy";
import {PathUtils} from "../../book/PathUtils";
import {EditorTabLabel} from "./EditorTabLabel";
import {EditorTabPanel} from "./EditorTabPanel";


export const EditorGroups: FunctionComponent = () => {
    const editors = useSelector((state: AppState) => state.openEditors);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const [value, setValue] = React.useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return <Fragment>
        <Tabs value={value} onChange={handleChange} aria-label="Open editors">
            {editors.openEditors.map((editor, i) => {
                if (!editor.handler) {
                    return null;
                }

                const path = PathUtils.combine(editor.path, editor.handler.name).replace("./", `${rootDirectory!.name}/`)
                const showPathInTab = editors.openEditors.filter(oe => oe.handler.name === editor.handler.name).length > 1;

                return <Tab id={`editor-tab-${i}`}
                            sx={{pl: 1, pr: 0.6, pt: 0.2, pb: 0.2}}
                            title={path}
                            key={`open-editor-tab-${i}`}
                            label={<EditorTabLabel editor={editor}
                                                   showPathInTab={showPathInTab}
                                                   isSelected={i === value}/>}/>;
            })}
        </Tabs>
        {editors.openEditors.map((editor, i) => {
            if (!editor.handler) {
                return null;
            }

            return <EditorTabPanel value={value} index={i} key={`open-editor-${i}`}>
                <EditorProxy handler={editor.handler}/>
            </EditorTabPanel>
        })}
    </Fragment>
}