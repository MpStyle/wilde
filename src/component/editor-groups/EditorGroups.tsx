import React, { Fragment, FunctionComponent } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store/AppStore";
import { EditorProxy } from "./EditorProxy";
import { PathUtils } from "../../book/PathUtils";
import { EditorTabLabel } from "./EditorTabLabel";
import { EditorTabPanel } from "./EditorTabPanel";
import { EditorGroupsContextMenu } from "./EditorGroupsContextMenu";
import {
    closeAllEditors,
    closeEditor,
    closeOthersEditors,
    currentEditor,
    EditorInfo
} from "../../slice/OpenEditorsSlice";


export const EditorGroups: FunctionComponent = () => {
    const editors = useSelector((state: AppState) => state.openEditors);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const dispatch = useDispatch();

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        dispatch(currentEditor(editors.openEditors[newValue]));
    };

    //#region Context menu
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const isContextMenuOpen = contextMenu !== null;

    const openContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6, } : null);
    };
    const closeContextMenu = () => setContextMenu(null);
    //#endregion

    const isCurrentEditor = (editor: EditorInfo) => {
        if (!editors.currentEditor) {
            return false;
        }

        return PathUtils.combine(editor.path, editor.handle.name) === PathUtils.combine(editors.currentEditor.path, editors.currentEditor.handle.name);
    }


    return <Fragment>
        <Tabs value={editors.openEditors.findIndex(oe => isCurrentEditor(oe))}
            onChange={handleChange}
            variant="scrollable"
            aria-label="Open editors"
            TabIndicatorProps={{ sx: { height: 3 } }}>
            {editors.openEditors.map((editor, i) => {
                if (!editor.handle) {
                    return null;
                }

                const path = PathUtils.combine(editor.path, editor.handle.name).replace("./", `${rootDirectory!.name}/`)

                // A portion of the path will be displayed if there are multiple files open with the same name
                const showPathInTab = editors.openEditors.filter(oe => oe.handle.name === editor.handle.name).length > 1;

                return <Tab id={`editor-tab-${i}`}
                    sx={{ pl: 1.4, pr: 0.6, pt: 0.2, pb: 0.2 }}
                    title={path}
                    onContextMenu={(e) => openContextMenu(e)}
                    key={`open-editor-tab-${i}`}
                    label={<EditorTabLabel editor={editor}
                        showPathInTab={showPathInTab}
                        isSelected={isCurrentEditor(editor)} />} />;
            })}
        </Tabs>
        {editors.openEditors.map((editor, i) => {
            if (!editor) {
                return null;
            }

            return <EditorTabPanel editor={editor}
                index={i}
                key={`open-editor-${i}`}
                hidden={!isCurrentEditor(editor)}>
                <EditorProxy
                    handle={editor.handle}
                    onContentChange={() => { }}
                    onContentRestore={() => { }}
                    onContentSave={() => { }}
                />
            </EditorTabPanel>
        })}

        <EditorGroupsContextMenu open={isContextMenuOpen}
            position={contextMenu}
            onClose={closeContextMenu}
            close={() => {
                if (editors.currentEditor) {
                    dispatch(closeEditor(editors.currentEditor));
                }

                closeContextMenu();
            }}
            closeAll={() => {
                dispatch(closeAllEditors());
                closeContextMenu();
            }}
            closeOthers={() => {
                if (editors.currentEditor) {
                    dispatch(closeOthersEditors(editors.currentEditor));
                }

                closeContextMenu();
            }} />
    </Fragment>
}

