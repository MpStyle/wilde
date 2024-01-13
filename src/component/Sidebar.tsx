import { Box, useTheme } from "@mui/material";
import { FunctionComponent } from 'react';
import { DirectoryExplorer } from './directory-explorer/DirectoryExplorer';

export const Sidebar: FunctionComponent = () => {
    const theme = useTheme();

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