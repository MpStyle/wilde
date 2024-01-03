import {FunctionComponent, useEffect, useState} from "react";
import {Box} from "@mui/material";

export const ImageViewer:FunctionComponent<ImageViewerProps>=props=>{
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadContent = async () => {
            const file = await props.handle.getFile();
            const fileContent = await file.arrayBuffer();
            const blob = new Blob( [ fileContent ], { type: "image/jpeg" } );
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL( blob );

            setImageUrl(imageUrl);
        }

        if (imageUrl === undefined) {
            loadContent();
        }
    }, [imageUrl])

    return <Box sx={{
                    height: `calc(100% - 48px - 8px)`,
                    m: 0,
                    pt: 1,
                    overflow: 'auto'
                }}>
        {imageUrl && <img src={imageUrl} alt={props.handle.name} />}
        {!imageUrl && <div>Loading...</div>}
    </Box>;
}

export interface ImageViewerProps {
    handle: FileSystemFileHandle;
}