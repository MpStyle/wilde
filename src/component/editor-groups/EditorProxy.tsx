import React, { FunctionComponent, useEffect, useState } from "react";
import { TextEditor } from "./editor/TextEditor";
import { FileUtils } from "../../book/FileUtils";
import { ImageViewer } from "./editor/ImageViewer";
import { EditorLoader } from "./common/EditorLoader";
import { BinaryContentWarningMessage } from "./common/BinaryContentWarningMessage";
import { EditorProps } from "./book/EditorProps";

export const EditorProxy: FunctionComponent<EditorProps> = props => {
    const [isTextFile, setIsTextFile] = useState<boolean | undefined>(undefined);
    const extension = FileUtils.getExtension(props.handle.name);

    useEffect(() => {
        if (isTextFile === undefined) {
            FileUtils.isTextFile(props.handle).then(result => setIsTextFile(result));
        }
    }, [isTextFile]);

    if (isTextFile === undefined) {
        return <EditorLoader />;
    }

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'ico':
            return <ImageViewer {...props} />;
        default:
            return isTextFile ? <TextEditor {...props} /> : <BinaryContentWarningMessage />;
    }
}