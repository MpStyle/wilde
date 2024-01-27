import { FunctionComponent } from "react";
import { Box, Button, Typography } from "@mui/material";
import { closeProjectDirectory, openProjectDirectory } from "../../slice/ProjectDirectorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/AppStore";
import { fileEditorInfoBuilder, openEditors } from "../../slice/OpenEditorsSlice";

export const EmptyDirectoryExplorer: FunctionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const selectFile = async () => {
        try {
            const fileHandles = await window.showOpenFilePicker({ multiple: true });
            dispatch(openEditors(fileHandles.map(fileHandle => fileEditorInfoBuilder(fileHandle.name, fileHandle))));
        } catch (e) {
            console.error(e);
        }
    }

    const selectDirectory = async () => {
        try {
            const dirHandle = await window.showDirectoryPicker();
            dispatch(closeProjectDirectory());
            dispatch(openProjectDirectory(dirHandle));
        } catch (e) {
            console.error(e);
        }
    }

    return <Box sx={{ p: 1 }}>
        <Typography>You can open a file (or some files):</Typography>
        <Box sx={{ textAlign: 'center', m: '10px 0' }}>
            <Button title="Open file(s)"
                variant="contained"
                fullWidth
                onClick={() => selectFile()}>
                Open file(s)
            </Button>
        </Box>
        <Typography>Or a folder:</Typography>
        <Box sx={{ textAlign: 'center', m: '10px 0' }}>
            <Button title="Open folder"
                variant="contained"
                fullWidth
                onClick={() => selectDirectory()}>
                Open folder
            </Button>
        </Box>
        <Typography>Opening a folder will close all currently open edits.</Typography>
    </Box>
}