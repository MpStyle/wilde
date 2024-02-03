import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeDirectory } from "../../../slice/OpenedDirectorySlice";
import { useWilde } from "../../../hook/WildeHook";

export const CloseDirectoryDialog: FunctionComponent = () => {
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const wilde = useWilde();

    // onCloseDirectory event listener
    useEffect(() => {
        const onCloseDirectory = () => {
            setOpen(true);
        }

        wilde.subscribeTo(wilde.eventType.onCloseDirectory, onCloseDirectory);

        return () => {
            wilde.unsubscribeFrom(wilde.eventType.onCloseDirectory, onCloseDirectory);
        };
    });

    const onClose = () => setOpen(false);
    const onConfirm = () => {
        onClose();
        dispatch(closeDirectory());
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