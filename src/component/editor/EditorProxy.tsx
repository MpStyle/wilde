import React, {Fragment, FunctionComponent} from "react";
import {TextEditor} from "./TextEditor";

export const EditorProxy: FunctionComponent<EditorProxyProps> = props => {
    return <Fragment>
        <TextEditor handler={props.handler}/>
    </Fragment>;
}

export interface EditorProxyProps {
    handler: FileSystemFileHandle;
}