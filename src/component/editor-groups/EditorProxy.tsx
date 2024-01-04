import React, {FunctionComponent, useEffect, useState} from "react";
import {TextEditor} from "./editor/TextEditor";
import {FileUtils} from "../../book/FileUtils";
import {ImageViewer} from "./editor/ImageViewer";
import {LoaderEditor} from "./editor/LoaderEditor";
import {IsBinaryEditor} from "./editor/IsBinaryEditor";

export const EditorProxy: FunctionComponent<EditorProxyProps> = props => {
    const [isTextFile, setIsTextFile] = useState<boolean | undefined>(undefined);
    const extension = FileUtils.getExtension(props.handle.name);

    useEffect(() => {
        if (isTextFile === undefined) {
            FileUtils.isTextFile(props.handle).then(result => setIsTextFile(result));
        }
    }, [isTextFile]);

    if (isTextFile === undefined) {
        return <LoaderEditor/>;
    }

    switch (extension) {
        case 'png':
        case 'jpg':
        case 'ico':
            return <ImageViewer handle={props.handle}/>;
        default:
            return isTextFile ? <TextEditor handle={props.handle}/> : <IsBinaryEditor/>;
    }
}

export interface EditorProxyProps {
    handle: FileSystemFileHandle;
}