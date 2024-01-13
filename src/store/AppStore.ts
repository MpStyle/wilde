import { configureStore } from '@reduxjs/toolkit'
import { openEditorsReducer } from "../slice/OpenEditorsSlice";
import { projectFolderReducer } from "../slice/ProjectDirectorySlice";
import { eventListenerReducer } from '../slice/AppEventListenerSlice';

export const appStore = configureStore({
    reducer: {
        eventListeners: eventListenerReducer,
        projectFolder: projectFolderReducer,
        openEditors: openEditorsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch