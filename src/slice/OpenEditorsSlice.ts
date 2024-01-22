import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { closeProjectDirectory } from "./ProjectDirectorySlice";

interface EditorInfo {
    readonly path: string;
    isChange?: boolean;
    readonly kind: "wilde" | "file";
}

export const WildeProtocol = "wilde://";

export type WildeEditorPath = `${typeof WildeProtocol}settings`;

export interface WildeEditorInfo extends EditorInfo {
    readonly kind: "wilde";
    readonly path: WildeEditorPath;
}

export interface FileEditorInfo extends EditorInfo {
    readonly kind: "file";
    handle: FileSystemFileHandle;
}

export type EditorInfoUnion = WildeEditorInfo | FileEditorInfo;

export const fileEditorInfoBuilder = (path: string, handle: FileSystemFileHandle): FileEditorInfo => ({
    path, handle, kind: "file"
})

export const wildeEditorInfoBuilder = (path: WildeEditorPath): WildeEditorInfo => ({
    path, kind: "wilde"
})

export interface EditorState {
    openEditors: EditorInfoUnion[];
    currentEditor?: EditorInfoUnion | undefined;
}

const initialState: EditorState = {
    openEditors: [],
}

export const openEditorsSlice = createSlice({
    name: 'openEditors',
    initialState,
    reducers: {
        editorContentIsChanged: (state, action: PayloadAction<{ path: string, isChanged: boolean }>) => {
            const changedEditor = state.openEditors.find(editor => editor.path === action.payload.path);

            if (changedEditor) {
                changedEditor.isChange = action.payload.isChanged;
            }
        },
        currentEditor: (state, action: PayloadAction<EditorInfoUnion>) => {
            state.currentEditor = action.payload;
        },
        openEditor: (state, action: PayloadAction<EditorInfoUnion>) => {
            if (state.openEditors.findIndex(oe => oe.path === action.payload.path) !== -1) {
                state.currentEditor = action.payload;
                return;
            }

            state.openEditors = [...state.openEditors, action.payload]
            state.currentEditor = action.payload;
        },
        closeEditor: (state, action: PayloadAction<{ path: string }>) => {
            const editorIndex = state.openEditors.findIndex(oe => oe.path === action.payload.path);

            if (editorIndex === -1) {
                return;
            }

            const updateCurrentEditor = state.currentEditor?.path === action.payload.path;

            state.openEditors.splice(editorIndex, 1);

            if (updateCurrentEditor && state.openEditors.length > 0) {
                state.currentEditor = state.openEditors[0];
            }

            if (state.openEditors.length === 0) {
                state.currentEditor = undefined;
            }
        },
        closeAllEditors: (state) => {
            state.openEditors = [];
        },
        closeOthersEditors: (state, action: PayloadAction<EditorInfo>) => {
            const editorIndex = state.openEditors.findIndex(oe => oe.path === action.payload.path);

            if (editorIndex === -1) {
                return;
            }

            const arr = [...state.openEditors];
            const removedElement = arr.splice(editorIndex, 1);
            arr.length = 0;
            arr.push(removedElement[0]);

            state.openEditors = arr;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(closeProjectDirectory, (state) => {
                state.openEditors = [];
            })
    }
})

// Action creators are generated for each case reducer function
export const {
    openEditor,
    closeEditor,
    closeAllEditors,
    closeOthersEditors,
    currentEditor,
    editorContentIsChanged
} = openEditorsSlice.actions

export const openEditorsReducer = openEditorsSlice.reducer;