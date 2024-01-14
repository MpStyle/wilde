import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PathUtils } from "../book/PathUtils";

type DirectoryStructure = {
    [path: string]: {
        handle: FileSystemDirectoryHandle,
        content: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
    }
};

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

    return { path, handle: dirHandle, handles: values };
};

export const scanProjectDirectory = createAsyncThunk(
    'projectDirectory/scanProjectDirectory',
    async (args: { path: string, dirHandle: FileSystemDirectoryHandle }) => {
        return scanDirectory(args.path, args.dirHandle);
    }
)

export const openProjectDirectory = createAsyncThunk(
    'projectDirectory/openProjectDirectory',
    async (dirHandle: FileSystemDirectoryHandle) => {
        const scanResult = await scanDirectory(".", dirHandle);
        return { ...scanResult, root: dirHandle };
    }
)

export const refreshProjectDirectory = createAsyncThunk(
    'projectDirectory/refreshProjectDirectory',
    async (args: { rootHandle: FileSystemDirectoryHandle, paths: string[] }) => {
        const directoryStructureBuilder = async (path: string, handle: FileSystemDirectoryHandle) => {
            let result: DirectoryStructure = {};
            const scanResult = await scanDirectory(path, handle);

            result[path] = { content: scanResult.handles, handle };

            for (let subHandle of scanResult.handles) {
                const subPath = PathUtils.combine(path, subHandle.name);

                if (args.paths.includes(subPath)) {
                    const internalScanResult = await directoryStructureBuilder(subPath, subHandle as FileSystemDirectoryHandle);

                    result = {
                        ...result,
                        ...internalScanResult
                    }
                }
            }

            return result;
        }

        return directoryStructureBuilder(".", args.rootHandle);
    }
)

export const projectDirectorySlice = createSlice({
    name: 'projectDirectory',
    initialState,
    reducers: {
        closeProjectDirectory: (state) => {
            state.directoryStructure = {};
            state.rootDirectory = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(scanProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = {
                    content: action.payload.handles,
                    handle: action.payload.handle
                };
            })
            .addCase(openProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = {
                    content: action.payload.handles,
                    handle: action.payload.handle
                };
                state.rootDirectory = action.payload.root;
            })
            .addCase(refreshProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure = action.payload;
            })
    }
})

export const { closeProjectDirectory } = projectDirectorySlice.actions

export const projectFolderReducer = projectDirectorySlice.reducer;