import React, { FunctionComponent, useEffect, useState } from "react";
import { TextEditor } from "./editor/TextEditor";
import { FileUtils } from "../../book/FileUtils";
import { ImageViewer } from "./editor/ImageViewer";
import { EditorLoader } from "./common/EditorLoader";
import { BinaryContentEditor } from "./editor/BinaryContentEditor";
import { EditorProps } from "./book/EditorProps";
import { FileEditorInfo } from "../../slice/OpenEditorsSlice";
import { SettingsEditor } from "./editor/settings-editor/SettingsEditor";

export const EditorProxy: FunctionComponent<EditorProps> = props => {
    const [isTextFile, setIsTextFile] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (isTextFile === undefined && props.editor.kind === 'file') {
            FileUtils.isTextFile(props.editor.handle).then(result => setIsTextFile(result));
        }
    }, [isTextFile]);

    if (props.editor.kind === 'wilde') {
        switch (props.editor.path) {
            case 'wilde://settings':
                return <SettingsEditor {...props} />;
            default:
                return <div />;
        }
    }

    if (isTextFile === undefined) {
        return <EditorLoader />;
    }

    const extension = FileUtils.getExtension(props.editor.handle.name);
    const isImage = extension && ['png', 'jpg', 'ico'].includes(extension);

    if (isTextFile === false && !isImage) {
        return <BinaryContentEditor />;
    }

    const fileEditorProps = { ...props, editor: props.editor as FileEditorInfo };

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'ico':
            return <ImageViewer {...fileEditorProps} />;
        default:
            return <TextEditor {...fileEditorProps} />;
    }
}