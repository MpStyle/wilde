import React, {FunctionComponent} from "react";
import {TextEditor} from "./editor/TextEditor";
import {FileUtils} from "../../book/FileUtils";
import {ImageViewer} from "./editor/ImageViewer";

export const EditorProxy: FunctionComponent<EditorProxyProps> = props => {
    const extension=FileUtils.getExtension(props.handle.name);

    switch(extension){
        case 'png':
        case 'jpg':
        case 'ico':
            return <ImageViewer handle={props.handle} />
        default:
            return <TextEditor handle={props.handle}/>
    }
}

export interface EditorProxyProps {
    handle: FileSystemFileHandle;
}