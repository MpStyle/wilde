import {Fragment, FunctionComponent, useEffect, useState} from "react";
import {Box} from "@mui/material";
import {ByteUtils} from "../../../book/ByteUtils";

export const ImageViewer: FunctionComponent<ImageViewerProps> = props => {
    const [state, setState] = useState<ImageViewerState | undefined>(undefined);

    useEffect(() => {
        const loadFileInfo = async () => {
            const file = await props.handle.getFile();
            const fileContent = await file.arrayBuffer();
            const blob = new Blob([fileContent], {type: "image/jpeg"});
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);

            const img = new Image();
            img.onload = () => {
                setState({
                    imageUrl,
                    fileSize: file.size,
                    width: img.width,
                    height: img.height
                });
            };
            img.src = imageUrl;
        }

        if (state === undefined) {
            loadFileInfo();
        }
    }, [state])

    return <Box sx={{
        height: `calc(100% - 48px)`,
        m: 0,
        p: 0,
        overflow: 'hidden'
    }}>
        {state && <Fragment>
            <Box sx={{
                height: '25px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <b>Image info</b>: {ByteUtils.format(state.fileSize)} - {state.width}x{state.height}
            </Box>
            <Box sx={{
                height: `calc(100% - 25px)`,
                m: 0,
                p: 0,
                overflow: 'auto',
                textAlign: 'center'
            }}>
                <img src={state.imageUrl}
                     alt={props.handle.name}/>
            </Box>
        </Fragment>}
        {!state && <div>Loading...</div>}
    </Box>;
}

export interface ImageViewerProps {
    handle: FileSystemFileHandle;
}

interface ImageViewerState {
    imageUrl: string;
    fileSize: number;
    height: number;
    width: number;
}