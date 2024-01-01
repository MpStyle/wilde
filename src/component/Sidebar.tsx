import { styled } from '@mui/system';
import {Box} from "@mui/material";

export const Sidebar= styled(Box)(({ theme }) =>({
    height: '100%',
    overflowX: 'hidden',
    minWidth: '200px',
    maxWidth: '250px',
    borderRight: `1px solid ${theme.palette.text.disabled}`
}));