import React, {FunctionComponent} from "react";
import {Box} from "@mui/material";
import {TextEditor} from "./TextEditor";

export const EditorProxy: FunctionComponent<EditorProxyProps> = props => {
    return <Box>
        <TextEditor handler={props.handler}/>
    </Box>;
}

export interface EditorProxyProps {
    handler: FileSystemFileHandle;
}