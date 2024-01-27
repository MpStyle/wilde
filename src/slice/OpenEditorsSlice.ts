import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { closeProjectDirectory } from "./ProjectDirectorySlice";

interface EditorInfo {
    readonly path: string;
    isChanged?: boolean;
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

const findIndex = (openEditors: EditorInfoUnion[], editor: EditorInfoUnion) => {
    return openEditors.findIndex(oe => {
        if (oe.kind === 'wilde') {
            return oe.path === editor.path;
        }

        const fileEditor = editor as FileEditorInfo;

        return oe.handle === fileEditor.handle;
    });
}

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
        editorContentIsChanged: (state, action: PayloadAction<EditorInfoUnion>) => {
            const editorIndex = findIndex(state.openEditors, action.payload);

            if (editorIndex !== -1) {
                state.openEditors[editorIndex] = action.payload;
            }
        },
        currentEditor: (state, action: PayloadAction<EditorInfoUnion>) => {
            state.currentEditor = action.payload;
        },
        openEditor: (state, action: PayloadAction<EditorInfoUnion>) => {
            const editorIndex = findIndex(state.openEditors, action.payload);

            if (editorIndex !== -1) {
                state.currentEditor = action.payload;
                return;
            }

            state.openEditors = [...state.openEditors, action.payload]
            state.currentEditor = action.payload;
        },
        openEditors: (state, action: PayloadAction<EditorInfoUnion[]>) => {
            for (let i = 0; i < action.payload.length; i++) {
                const editorIndex = findIndex(state.openEditors, action.payload[i]);

                if (editorIndex === -1) {
                    state.openEditors = [...state.openEditors, action.payload[i]];
                }
            }

            state.currentEditor = action.payload[action.payload.length - 1];
        },
        closeEditor: (state, action: PayloadAction<EditorInfoUnion>) => {
            const editorIndex = findIndex(state.openEditors, action.payload);

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
            state.currentEditor = undefined;
        },
        closeOthersEditors: (state, action: PayloadAction<EditorInfoUnion>) => {
            const editorIndex = findIndex(state.openEditors, action.payload);

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
                state.currentEditor = undefined;
            })
    }
})

// Action creators are generated for each case reducer function
export const {
    openEditor,
    openEditors,
    closeEditor,
    closeAllEditors,
    closeOthersEditors,
    currentEditor,
    editorContentIsChanged
} = openEditorsSlice.actions

export const openEditorsReducer = openEditorsSlice.reducer;