import {FunctionComponent} from "react";
import {Box, Button, Typography} from "@mui/material";
import {closeProjectDirectory, openProjectDirectory} from "../../slice/ProjectDirectorySlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/AppStore";

export const EmptyDirectoryExplorer: FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const selectProjectDirectory = async () => {
        try {
            const dirHandle = await window.showDirectoryPicker();
            dispatch(closeProjectDirectory());
            dispatch(openProjectDirectory(dirHandle));
        } catch (e) {
            console.error(e);
        }
    }

    return <Box sx={{padding: 1}}>
        <Typography>No folder has been opened yet.</Typography>
        <Box sx={{textAlign: 'center', m: '10px 0'}}>
            <Button title="Open folder"
                    variant="contained"
                    onClick={() => selectProjectDirectory()}>
                Open folder
            </Button>
        </Box>
        <Typography>Opening a folder will close all currently open edits.</Typography>
    </Box>
}