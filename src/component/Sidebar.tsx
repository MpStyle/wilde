import { styled } from '@mui/system';
import {Box} from "@mui/material";

export const Sidebar= styled(Box)(({ theme }) =>({
    height: '100%',
    overflowX: 'hidden',
    minWidth: '250px'
}));