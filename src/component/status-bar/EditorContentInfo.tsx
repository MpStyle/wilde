import { Box } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FileUtils } from "../../book/FileUtils";
import { EditorInfoUnion } from "../../slice/OpenEditorsSlice";
import { AppState } from "../../store/AppStore";

const mimeDescriptionByExtension: { [key: string]: string } = {
    'tsx': 'Typescript JSX',
    'gitignore': 'Ignore',
    'ts': 'Typescript',
    'md': 'Markdown',
}

const mimeDescriptionByMimeType: { [key: string]: string } = {
    'text/css': 'CSS',
    'image/svg+xml': 'SVG',
    'application/json': 'JSON',
    'image/png': 'PNG image',
    'text/plain': 'Plain text',
}

const getEditorContentInfo = async (editor: EditorInfoUnion): Promise<string | undefined> => {
    if (editor.kind === 'wilde') {
        switch (editor.path) {
            case 'wilde://settings':
                return "Settings";
            default:
                return undefined;
        }
    }

    // file editor
    const file = await editor.handle.getFile();
    const fileType = file.type;
    let mimeDescription = undefined;

    if (!fileType.length) {
        const extension = FileUtils.getExtension(editor.handle.name);
        if (extension) {
            mimeDescription = mimeDescriptionByExtension[extension];
        }
    }
    else {
        mimeDescription = mimeDescriptionByMimeType[fileType]
    }

    return mimeDescription ?? fileType;
}

export const EditorContentInfo: FunctionComponent = () => {
    const currentEditor = useSelector((appState: AppState) => appState.openEditors.currentEditor);
    const [state, setState] = useState('');
    const { t } = useTranslation();

    const setEditorContentInfo = async (editor: EditorInfoUnion) => {
        const result = await getEditorContentInfo(editor);
        setState(t(result ?? ''));
    }

    useEffect(() => {
        if (!currentEditor) {
            return;
        }

        setEditorContentInfo(currentEditor);
    }, [currentEditor]);

    if (!currentEditor) {
        return null;
    }

    return <Box sx={{ pl: 1, pr: 1 }}>
        {state}
    </Box>
}