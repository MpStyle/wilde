import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { closeProjectDirectory, openProjectDirectory } from "../../slice/ProjectDirectorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/AppStore";
import { fileEditorInfoBuilder, openEditors } from "../../slice/OpenEditorsSlice";
import { OpenedDirectory, OpenedDirectoryRepository } from "../../book/OpenedDirectoryRepository";

export const EmptyDirectoryExplorer: FunctionComponent = () => {
    const [state, setState] = useState<OpenedDirectory[]>([]);
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const retrieveOpenedDirectory = async () => {
            const openedDirectories = await OpenedDirectoryRepository.search({ count: 5 });
            if (openedDirectories.payload) {
                setState(openedDirectories.payload);
            }
        }

        if (!state.length) {
            retrieveOpenedDirectory();
        }
    }, [state]);

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

        {Boolean(state.length) && <Fragment>
            <Divider sx={{ mt: 2, mb: 1 }} >Recent folders</Divider>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: '1rem' }}>
                {state.map(openedDir => <li style={{ display: 'block', color: theme.palette.primary.main, fontWeight: 'bold', cursor: 'pointer', paddingBottom: '0.8rem' }}
                    title={`Open "${openedDir.name}" folder`}
                    onClick={() => dispatch(openProjectDirectory(openedDir.handle))}
                    key={`recent-opened-directory-${openedDir.name}-${openedDir.inserted ?? 0}`}>
                    {openedDir.name}
                </li>)}
            </ul>
        </Fragment>}
    </Box>
}