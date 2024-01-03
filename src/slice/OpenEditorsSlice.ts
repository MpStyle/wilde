import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {closeProjectDirectory} from "./ProjectDirectorySlice";

export type EditorInfo = { path: string, handle: FileSystemFileHandle };

export interface EditorState {
    openEditors: EditorInfo[];
    currentEditor?: EditorInfo | undefined;
}

const initialState: EditorState = {
    openEditors: [],
}

export const openEditorsSlice = createSlice({
    name: 'openEditors',
    initialState,
    reducers: {
        currentEditor: (state, action: PayloadAction<EditorInfo>) => {
            state.currentEditor = action.payload;
        },
        openEditor: (state, action: PayloadAction<EditorInfo>) => {
            if (state.openEditors.findIndex(oe => oe.handle === action.payload.handle && oe.path === action.payload.path) !== -1) {
                state.currentEditor = action.payload;
                return;
            }

            state.openEditors = [...state.openEditors, action.payload]
            state.currentEditor = action.payload;
        },
        closeEditor: (state, action: PayloadAction<EditorInfo>) => {
            const editorIndex = state.openEditors.findIndex(oe => oe.handle === action.payload.handle && oe.path === action.payload.path);

            if (editorIndex === -1) {
                return;
            }

            state.openEditors.splice(editorIndex, 1);

            if (state.openEditors.length) {
                state.currentEditor = state.openEditors[0];
            }
        },
        closeAllEditors: (state) => {
            state.openEditors = [];
        },
        closeOthersEditors: (state, action: PayloadAction<EditorInfo>) => {
            const editorIndex = state.openEditors.findIndex(oe => oe.handle === action.payload.handle && oe.path === action.payload.path);

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
export const {openEditor, closeEditor, closeAllEditors, closeOthersEditors, currentEditor} = openEditorsSlice.actions

export const openEditorsReducer = openEditorsSlice.reducer;