import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {DirectoryStructure} from "../component/project-explorer/entity/DirectoryStructure";

export interface ProjectFolderState {
    directoryStructure: DirectoryStructure;
    rootDirectory: FileSystemDirectoryHandle | undefined;
}

const initialState: ProjectFolderState = {
    directoryStructure: {},
    rootDirectory: undefined,
}

const scanDirectory = async (path: string, dirHandle: FileSystemDirectoryHandle) => {
    const values: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];

    for await (const value of dirHandle.values()) {
        values.push(value);
    }

    return {path, handlers: values};
};

export const scanProjectDirectory = createAsyncThunk(
    'projectFolder/scanProjectDirectory',
    async (args: { path: string, dirHandle: FileSystemDirectoryHandle }) => {
        return scanDirectory(args.path, args.dirHandle);
    }
)

export const openProjectDirectory = createAsyncThunk(
    'projectFolder/openProjectDirectory',
    async (dirHandle: FileSystemDirectoryHandle) => {
        const scanResult = await scanDirectory("/", dirHandle);
        return {...scanResult, root: dirHandle};
    }
)

export const projectFolderSlice = createSlice({
    name: 'projectFolder',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(scanProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = action.payload.handlers;
            })
            .addCase(openProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = action.payload.handlers;
                state.rootDirectory = action.payload.root;
            })
    }
})

export const projectFolderReducer = projectFolderSlice.reducer;