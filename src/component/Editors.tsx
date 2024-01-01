import {Box} from "@mui/material";
import {FunctionComponent, PropsWithChildren} from "react";

export const Editors: FunctionComponent<PropsWithChildren<EditorsProps>>= props => {
    return <Box id='Editors'
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflow: 'hidden',
                    backgroundImage: props.showBackground ? 'url("images/wilde-logo.png")' : null,
                    backgroundSize: '25%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
        {props.children}
    </Box>
}

export interface EditorsProps {
    showBackground: boolean;
}