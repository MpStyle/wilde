import { Box } from "@mui/material";
import { FunctionComponent } from 'react';
import { DirectoryExplorer } from './DirectoryExplorer';

export const Sidebar: FunctionComponent = () => {
    return <Box id='Sidebar'
        sx={{
            height: '100%',
            overflow: 'hidden',
            minWidth: '200px',
            maxWidth: '250px',
        }}>
        <DirectoryExplorer />
    </Box>
}