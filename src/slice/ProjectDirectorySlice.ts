import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PathUtils } from "../book/PathUtils";
import { FileHandleInfo } from '../entity/FileHandleInfo';

export type DirectoryInfo = {
    handle: FileSystemDirectoryHandle,
    content: FileSystemHandleUnion[],
    isScanning: boolean
};

export type DirectoryStructure = {
    [path: string]: DirectoryInfo
};

export interface ProjectFolderState {
    selectedProjectFile: FileHandleInfo | undefined;
    directoryStructure: DirectoryStructure;
    rootDirectory: FileSystemDirectoryHandle | undefined;
}

const initialState: ProjectFolderState = {
    selectedProjectFile: undefined,
    directoryStructure: {},
    rootDirectory: undefined,
}

const scanDirectory = async (path: string, dirHandle: FileSystemDirectoryHandle) => {
    const values: FileSystemHandleUnion[] = [];

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
        const scanResult = await scanDirectory(PathUtils.rootPath, dirHandle);
        return { ...scanResult, root: dirHandle };
    }
)

export const refreshProjectDirectory = createAsyncThunk(
    'projectDirectory/refreshProjectDirectory',
    async (args: { rootHandle: FileSystemDirectoryHandle, paths: string[] }) => {
        const directoryStructureBuilder = async (path: string, handle: FileSystemDirectoryHandle) => {
            let result: DirectoryStructure = {};
            const scanResult = await scanDirectory(path, handle);

            result[path] = { content: scanResult.handles, handle, isScanning: false };

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

        return directoryStructureBuilder(PathUtils.rootPath, args.rootHandle);
    }
)

export const projectDirectorySlice = createSlice({
    name: 'projectDirectory',
    initialState,
    reducers: {
        closeProjectDirectory: (state) => {
            state.directoryStructure = {};
            state.rootDirectory = undefined;
        },
        setSelectedProjectFile: (state, action: PayloadAction<FileHandleInfo>) => {
            state.selectedProjectFile = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(scanProjectDirectory.pending, (state, action) => {
                const currentState = state.directoryStructure[action.meta.arg.path] ?? {};

                state.directoryStructure[action.meta.arg.path] = {
                    content: currentState?.content ?? [],
                    handle: currentState?.handle,
                    isScanning: true,
                };
            })
            .addCase(scanProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = {
                    content: action.payload.handles,
                    handle: action.payload.handle,
                    isScanning: false,
                };
            })
            .addCase(openProjectDirectory.pending, (state) => {
                const currentState = state.directoryStructure[PathUtils.rootPath] ?? {};

                state.directoryStructure[PathUtils.rootPath] = {
                    content: currentState?.content ?? [],
                    handle: currentState?.handle,
                    isScanning: true,
                };
            })
            .addCase(openProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = {
                    content: action.payload.handles,
                    handle: action.payload.handle,
                    isScanning: false
                };
                state.rootDirectory = action.payload.root;
                state.selectedProjectFile = {
                    handle: action.payload.root,
                    path: PathUtils.rootPath
                };
            })
            .addCase(refreshProjectDirectory.fulfilled, (state, action) => {
                state.directoryStructure = action.payload;
            })
    }
})

export const { closeProjectDirectory, setSelectedProjectFile } = projectDirectorySlice.actions

export const projectFolderReducer = projectDirectorySlice.reducer;