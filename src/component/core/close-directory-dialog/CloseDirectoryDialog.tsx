import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { addEventListener, removeEventListener } from "../../../slice/AppEventListenerSlice";
import { useDispatch } from "react-redux";
import { closeProjectDirectory } from "../../../slice/ProjectDirectorySlice";

export const CloseDirectoryDialog: FunctionComponent = () => {
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch();

    // onClose event listener
    useEffect(() => {
        const onCloseDirectory = () => {
            setOpen(true);
        }

        dispatch(addEventListener({ eventName: 'onCloseDirectory', callback: onCloseDirectory }));

        return () => {
            dispatch(removeEventListener({ eventName: 'onCloseDirectory', callback: onCloseDirectory }));
        };
    });

    const onClose = () => setOpen(false);
    const onConfirm = () => {
        onClose();
        dispatch(closeProjectDirectory());
    };

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Close folder</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to close the folder?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={onConfirm} color="primary" autoFocus>
                Confirm
            </Button>
        </DialogActions>
    </Dialog>;
}