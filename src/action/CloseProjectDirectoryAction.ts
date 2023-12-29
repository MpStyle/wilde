import {closeAllEditors} from "../slice/OpenEditorsSlice";
import {closeProjectDirectory} from "../slice/ProjectDirectorySlice";
import {Dispatch} from "@reduxjs/toolkit";

export const closeProjectDirectoryAction = (dispatch: Dispatch) => {
    dispatch(closeAllEditors());
    dispatch(closeProjectDirectory());
}