import {Box, useTheme} from "@mui/material";
import {FunctionComponent, PropsWithChildren} from "react";

export const Editors: FunctionComponent<PropsWithChildren<EditorsProps>>= props => {
    const theme=useTheme();

    return <Box id='Editors'
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflow: 'hidden',
                    backgroundImage: props.showBackground ? 'url("images/wilde-logo.png")' : null,
                    backgroundSize: '75%',
                    [theme.breakpoints.up('sm')]: {
                        backgroundSize: '50%',
                    },
                    [theme.breakpoints.up('md')]: {
                        backgroundSize: '45%',
                    },
                    [theme.breakpoints.up('lg')]: {
                        backgroundSize: '35%',
                    },
                    [theme.breakpoints.up('lg')]: {
                        backgroundSize: '25%',
                    },
                    [theme.breakpoints.up('xl')]: {
                        backgroundSize: '15%',
                    },
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
        {props.children}
    </Box>
}

export interface EditorsProps {
    showBackground: boolean;
}