import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export const CloseDirectoryDialog:FunctionComponent<CloseDirectoryDialogProps>=props=>{
    return <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Close folder</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to close the folder?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={props.onConfirm} color="primary" autoFocus>
                Confirm
            </Button>
        </DialogActions>
    </Dialog>;
}

export interface CloseDirectoryDialogProps{
    open:boolean;
    onClose:()=>void;
    onConfirm:()=>void;
}