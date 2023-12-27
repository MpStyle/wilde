import {configureStore} from '@reduxjs/toolkit'
import {openEditorsReducer} from "../slice/OpenEditorsSlice";
import {projectFolderReducer} from "../slice/ProjectFolderSlice";

export const appStore = configureStore({
    reducer: {
        projectFolder: projectFolderReducer,
        openEditors: openEditorsReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch