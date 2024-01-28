import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PathUtils } from "../book/PathUtils";
import { FileHandleInfo } from '../entity/FileHandleInfo';
import { OpenedDirectoryRepository } from '../book/OpenedDirectoryRepository';

export type DirectoryInfo = {
    handle: FileSystemDirectoryHandle,
    content: FileSystemHandleUnion[],
    isScanning: boolean
};

export type DirectoryStructure = {
    [path: string]: DirectoryInfo
};

export interface DirectoryState {
    selectedFile: FileHandleInfo | undefined;
    directoryStructure: DirectoryStructure;
    rootDirectory: FileSystemDirectoryHandle | undefined;
}

const initialState: DirectoryState = {
    selectedFile: undefined,
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

export const scanDirectoryRequest = createAsyncThunk(
    'openedDirectory/scanDirectoryRequest',
    async (args: { path: string, dirHandle: FileSystemDirectoryHandle }) => {
        return scanDirectory(args.path, args.dirHandle);
    }
)

export const openDirectoryRequest = createAsyncThunk(
    'openedDirectory/openDirectoryRequest',
    async (dirHandle: FileSystemDirectoryHandle) => {
        OpenedDirectoryRepository.upsert({
            name: dirHandle.name,
            handle: dirHandle
        });

        const scanResult = await scanDirectory(PathUtils.rootPath, dirHandle);
        return { ...scanResult, root: dirHandle };
    }
)

export const refreshDirectoryRequest = createAsyncThunk(
    'openedDirectory/refreshDirectoryRequest',
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

export const openedDirectorySlice = createSlice({
    name: 'openedDirectory',
    initialState,
    reducers: {
        closeDirectory: (state) => {
            state.directoryStructure = {};
            state.rootDirectory = undefined;
        },
        setSelectedFile: (state, action: PayloadAction<FileHandleInfo>) => {
            state.selectedFile = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(scanDirectoryRequest.pending, (state, action) => {
                const currentState = state.directoryStructure[action.meta.arg.path] ?? {};

                state.directoryStructure[action.meta.arg.path] = {
                    content: currentState?.content ?? [],
                    handle: currentState?.handle,
                    isScanning: true,
                };
            })
            .addCase(scanDirectoryRequest.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = {
                    content: action.payload.handles,
                    handle: action.payload.handle,
                    isScanning: false,
                };
            })
            .addCase(openDirectoryRequest.pending, (state) => {
                const currentState = state.directoryStructure[PathUtils.rootPath] ?? {};

                state.directoryStructure[PathUtils.rootPath] = {
                    content: currentState?.content ?? [],
                    handle: currentState?.handle,
                    isScanning: true,
                };
            })
            .addCase(openDirectoryRequest.fulfilled, (state, action) => {
                state.directoryStructure[action.payload.path] = {
                    content: action.payload.handles,
                    handle: action.payload.handle,
                    isScanning: false
                };
                state.rootDirectory = action.payload.root;
                state.selectedFile = {
                    handle: action.payload.root,
                    path: PathUtils.rootPath
                };
            })
            .addCase(refreshDirectoryRequest.fulfilled, (state, action) => {
                state.directoryStructure = action.payload;
            })
    }
})

export const { closeDirectory, setSelectedFile } = openedDirectorySlice.actions

export const openedDirectoryReducer = openedDirectorySlice.reducer;