import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {closeProjectDirectory} from "./ProjectDirectorySlice";

type OpenEditor = { path: string, handle: FileSystemFileHandle };

export interface EditorState {
    openEditors: OpenEditor[];
}

const initialState: EditorState = {
    openEditors: [],
}

export const openEditorsSlice = createSlice({
    name: 'openEditors',
    initialState,
    reducers: {
        openEditor: (state, action: PayloadAction<{ path: string, handle: FileSystemFileHandle }>) => {
            if (state.openEditors.findIndex(oe => oe.handle === action.payload.handle && oe.path === action.payload.path) !== -1) {
                return;
            }

            state.openEditors = [...state.openEditors, action.payload]
        },
        closeEditor: (state, action: PayloadAction<{ path: string, handle: FileSystemFileHandle }>) => {
            const editorIndex = state.openEditors.findIndex(oe => oe.handle === action.payload.handle && oe.path === action.payload.path);

            if (editorIndex === -1) {
                return;
            }

            state.openEditors.splice(editorIndex, 1);
        },
        closeAllEditors: (state) => {
            state.openEditors = [];
        },
        closeOthersEditors: (state, action: PayloadAction<{ path: string, handle: FileSystemFileHandle }>) => {
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
export const {openEditor, closeEditor, closeAllEditors, closeOthersEditors} = openEditorsSlice.actions

export const openEditorsReducer = openEditorsSlice.reducer;