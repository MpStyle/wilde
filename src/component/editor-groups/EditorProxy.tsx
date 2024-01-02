import React, {Fragment, FunctionComponent} from "react";
import {TextEditor} from "./editor/TextEditor";

export const EditorProxy: FunctionComponent<EditorProxyProps> = props => {
    return <Fragment>
        <TextEditor handle={props.handle}/>
    </Fragment>;
}

export interface EditorProxyProps {
    handle: FileSystemFileHandle;
}