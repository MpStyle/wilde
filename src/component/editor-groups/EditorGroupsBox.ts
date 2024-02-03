import { Box, styled } from "@mui/material";

export type EditorGroupsBoxProps = { showBackground: boolean };

export const EditorGroupsBox = styled(Box, { shouldForwardProp: propsName => propsName !== 'showBackground' })<EditorGroupsBoxProps>((props) => ({
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
    backgroundImage: props.showBackground ? 'url("images/wilde-logo.png")' : undefined,
    backgroundSize: '75%',
    [props.theme.breakpoints.up('sm')]: {
        backgroundSize: '50%',
    },
    [props.theme.breakpoints.up('md')]: {
        backgroundSize: '45%',
    },
    [props.theme.breakpoints.up('lg')]: {
        backgroundSize: '35%',
    },
    [props.theme.breakpoints.up('lg')]: {
        backgroundSize: '25%',
    },
    [props.theme.breakpoints.up('xl')]: {
        backgroundSize: '15%',
    },
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
}));