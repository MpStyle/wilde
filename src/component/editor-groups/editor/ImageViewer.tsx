import { Box } from "@mui/material";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { ByteUtils } from "../../../book/ByteUtils";
import { Loader } from "../../common/loader/Loader";
import { FileEditorProps } from "../book/EditorProps";
import { tabPanelHeight } from "../book/TabHeight";

export const ImageViewer: FunctionComponent<FileEditorProps> = props => {
    const [state, setState] = useState<ImageViewerState | undefined>(undefined);

    useEffect(() => {
        const loadFileInfo = async () => {
            const file = await props.editor.handle.getFile();
            const fileContent = await file.arrayBuffer();
            const blob = new Blob([fileContent], { type: "image/jpeg" });
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
        height: tabPanelHeight,
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
                    alt={props.editor.handle.name} />
            </Box>
        </Fragment>}
        {!state && <Loader message="Loading image, please wait..." />}
    </Box>;
}

interface ImageViewerState {
    imageUrl: string;
    fileSize: number;
    height: number;
    width: number;
}