import { Box, useTheme } from "@mui/material";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    closeAllEditors,
    closeEditor,
    closeOthersEditors,
    currentEditor,
    editorContentIsChanged,
    EditorInfoUnion
} from "../../slice/OpenEditorsSlice";
import { AppState } from "../../store/AppStore";
import { EditorGroupsContextMenu } from "./EditorGroupsContextMenu";
import { EditorProxy } from "./EditorProxy";
import { EditorTabLabel } from "./EditorTabLabel";
import { EditorTabPanel } from "./EditorTabPanel";
import { tabHeight } from "./book/TabHeight";

export const EditorGroups: FunctionComponent = () => {
    const editors = useSelector((state: AppState) => state.openEditors);
    const dispatch = useDispatch();
    const showBackground = useSelector((appState: AppState) => !appState.openEditors.openEditors || !appState.openEditors.openEditors.length);
    const theme = useTheme();

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

    const isCurrentEditor = (editor: EditorInfoUnion) => {
        if (!editors.currentEditor) {
            return false;
        }

        return editor.path === editors.currentEditor.path;
    }

    return <Box sx={{
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
        backgroundImage: showBackground ? 'url("images/wilde-logo.png")' : null,
        backgroundSize: '75%',
        [theme.breakpoints.up('sm')]: {
            backgroundSize: '50%',
        },
        [theme.breakpoints.up('md')]: {
            backgroundSize: '45%',
        },
        [theme.breakpoints.up('lg')]: {
            backgroundSize: '35%',
        },
        [theme.breakpoints.up('lg')]: {
            backgroundSize: '25%',
        },
        [theme.breakpoints.up('xl')]: {
            backgroundSize: '15%',
        },
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }}>
        {Boolean(editors.openEditors.length) && <Tabs value={editors.openEditors.findIndex(oe => isCurrentEditor(oe))}
            onChange={handleChange}
            variant="scrollable"
            aria-label="Open editors"
            sx={{ height: tabHeight, minHeight: tabHeight }}
            TabIndicatorProps={{ sx: { height: 3 } }}>
            {editors.openEditors.map((editor, i) => {
                // A portion of the path will be displayed if there are multiple files open with the same name
                const showPathInTab = editors.openEditors.filter(oe => oe.kind === 'file' && editor.kind === 'file' && oe.handle.name === editor.handle.name).length > 1;

                return <Tab id={`editor-tab-${i}`}
                    sx={{ pl: 1.4, pr: 0.6, pt: 0, pb: 0, height: tabHeight, minHeight: tabHeight }}
                    title={editor.path}
                    onContextMenu={(e) => openContextMenu(e)}
                    key={`open-editor-tab-${i}`}
                    label={<EditorTabLabel editor={editor}
                        showPathInTab={showPathInTab}
                        isSelected={isCurrentEditor(editor)} />} />;
            })}
        </Tabs>}
        {editors.openEditors.map((editor, i) => {
            if (!editor) {
                return null;
            }

            return <EditorTabPanel editor={editor}
                index={i}
                key={`open-editor-${i}`}
                hidden={!isCurrentEditor(editor)}>
                <EditorProxy
                    editor={editor}
                    onContentChange={() => dispatch(editorContentIsChanged({ ...editor, isChanged: true }))}
                    onContentRestore={() => dispatch(editorContentIsChanged({ ...editor, isChanged: false }))}
                    onContentSave={() => dispatch(editorContentIsChanged({ ...editor, isChanged: false }))}
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
    </Box>
}

