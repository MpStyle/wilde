import { configureStore } from '@reduxjs/toolkit';
import { openEditorsReducer } from "../slice/OpenEditorsSlice";
import { projectFolderReducer } from "../slice/ProjectDirectorySlice";
import { versionApi } from '../slice/VersionSlice';

export const appStore = configureStore({
    reducer: {
        [versionApi.reducerPath]: versionApi.reducer,
        projectFolder: projectFolderReducer,
        openEditors: openEditorsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(versionApi.middleware),
})

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch