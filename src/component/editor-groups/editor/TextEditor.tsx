import { Box } from "@mui/material";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { FileUtils } from "../../../book/FileUtils";
import { useWilde } from "../../../hook/WildeHook";
import { EditorProps } from "../book/EditorProps";

export const TextEditor: FunctionComponent<EditorProps> = props => {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);
    const wilde = useWilde();

    const getLanguage = () => {
        const extension = FileUtils.getExtension(props.handle.name);
        switch (extension) {
            case 'ts': return 'typescript';
            case 'js': return 'javascript';
            case 'css': return 'css';
            case 'json': return 'json';
            case 'html':
            case 'htm':
                return 'html';
            default: return undefined;
        }
    }

    // onSave event listener
    useEffect(() => {
        const onSaveAll = () => {
            if (editor) {
                FileUtils.writeContent(props.handle, editor.getValue())
                props.onContentSave();
            }
        }

        wilde.addEventListener('onSaveAll', onSaveAll);

        return () => {
            wilde.removeEventListener('onSaveAll', onSaveAll);
        };
    });

    // Load editor and its content
    useEffect(() => {
        const loadContent = async () => {
            const file = await props.handle.getFile();
            const fileContent = await file.text();

            setEditor((editor) => {
                if (editor) return editor;

                const newEditor = monaco.editor.create(monacoEl.current!, {
                    value: fileContent,
                    language: getLanguage(),
                    automaticLayout: true,
                });

                newEditor.onDidChangeModelContent((e) => {
                    props.onContentChange();
                })

                return newEditor;
            });
        }

        if (monacoEl) {
            loadContent();
        }

        return () => editor?.dispose();
    }, [monacoEl.current]);

    return <Box
        ref={monacoEl}
        sx={{
            width: '100vw',
            height: `calc(100% - 48px - 8px)`,
        }}>
    </Box>;
}