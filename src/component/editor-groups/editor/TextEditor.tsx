import {FunctionComponent, useEffect, useState} from "react";
import {Box, TextField} from "@mui/material";

export const TextEditor: FunctionComponent<TextEditorProps> = props => {
    const [content, setContent] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadContent = async () => {
            const file = await props.handler.getFile();
            const fileContent = await file.text();
            setContent(fileContent);
        }

        if (content === undefined) {
            loadContent();
        }
    }, [content])

    return <Box>
        <TextField multiline value={content ?? ''} fullWidth disabled/>
    </Box>;
}

export interface TextEditorProps {
    handler: FileSystemFileHandle;
}