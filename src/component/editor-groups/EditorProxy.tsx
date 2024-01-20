import React, {FunctionComponent, useEffect, useState} from "react";
import {TextEditor} from "./editor/TextEditor";
import {FileUtils} from "../../book/FileUtils";
import {ImageViewer} from "./editor/ImageViewer";
import {EditorLoader} from "./common/EditorLoader";
import {BinaryContentWarningMessage} from "./common/BinaryContentWarningMessage";
import {EditorProps} from "./book/EditorProps";
import {FileEditorInfo} from "../../slice/OpenEditorsSlice";

export const EditorProxy: FunctionComponent<EditorProps> = props => {
    const [isTextFile, setIsTextFile] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (isTextFile === undefined && props.editor.kind === 'file') {
            FileUtils.isTextFile(props.editor.handle).then(result => setIsTextFile(result));
        }
    }, [isTextFile]);

    if (props.editor.kind === 'wilde') {
        return <div/>;
    }

    const extension = FileUtils.getExtension(props.editor.handle.name);

    if (isTextFile === undefined) {
        return <EditorLoader/>;
    }

    const fileEditorProps = {...props, editor: props.editor as FileEditorInfo};

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'ico':
            return <ImageViewer {...fileEditorProps} />;
        default:
            return isTextFile ? <TextEditor {...fileEditorProps} /> : <BinaryContentWarningMessage/>;
    }
}