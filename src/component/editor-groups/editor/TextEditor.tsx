import {FunctionComponent, useEffect, useState} from "react";
import {Box, useTheme} from "@mui/material";

export const TextEditor: FunctionComponent<TextEditorProps> = props => {
    const [content, setContent] = useState<string | undefined>(undefined);
    const theme=useTheme();

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

    return <Box component='pre'
                sx={{
                    height: `calc(100% - 48px - 8px)`,
                    m: 0,
                    pt: 1,
                    overflow: 'scroll'
                }}>
        {content ?? ''}
    </Box>;
}

export interface TextEditorProps {
    handler: FileSystemFileHandle;
}