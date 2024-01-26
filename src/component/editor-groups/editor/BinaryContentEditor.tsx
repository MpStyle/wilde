import { FunctionComponent } from "react";
import { Box } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const BinaryContentEditor: FunctionComponent = () => {
    return <Box sx={{
        height: `calc(100% - 48px - 8px)`,
        alignItems: 'center',
        m: 0,
        p: 0,
        display: 'flex',
        overflow: 'auto'
    }}>
        <Box sx={{ maxWidth: '600px', textAlign: 'center', margin: '0 auto' }}>
            <WarningAmberIcon sx={{ fontSize: '6em', color: 'rgb(203,167,0)' }} />
            <Box>The file is not displayed in the text editor because it is either binary or uses an unsupported text encoding.</Box>
        </Box>
    </Box>
}