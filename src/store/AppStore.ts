import { configureStore } from '@reduxjs/toolkit';
import { openEditorsReducer } from "../slice/OpenEditorsSlice";
import { openedDirectoryReducer } from "../slice/OpenedDirectorySlice";
import { versionApi } from '../slice/VersionSlice';
import { settingsReducer } from '../slice/SettingsSlice';

export const appStore = configureStore({
    reducer: {
        [versionApi.reducerPath]: versionApi.reducer,
        openedDirectory: openedDirectoryReducer,
        openEditors: openEditorsReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(versionApi.middleware),
})

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch
