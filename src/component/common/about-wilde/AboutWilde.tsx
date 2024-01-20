import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useWilde } from "../../../hook/WildeHook";
import { useGetMinorVersionQuery } from "../../../slice/VersionSlice";
import CloseIcon from '@mui/icons-material/Close';

export const AboutWilde: FunctionComponent = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { data, error, isLoading } = useGetMinorVersionQuery();
    const wilde = useWilde();

    // onShowAboutWilde event listener
    useEffect(() => {
        const onShowAbout = () => {
            setOpen(true);
        }

        wilde.addEventListener('onShowAbout', onShowAbout);

        return () => {
            wilde.removeEventListener('onShowAbout', onShowAbout);
        };
    });

    const onClose = () => setOpen(false);

    const formatTimestamp = (timestampInSeconds: number): string => {
        // Converti il timestamp in millisecondi
        const timestampInMilliseconds = timestampInSeconds * 1000;

        // Ottieni la data attuale
        const currentDate = new Date();

        // Calcola la differenza in millisecondi tra la data attuale e il timestamp
        const timeDifference = currentDate.getTime() - timestampInMilliseconds;

        // Calcola le differenze in giorni, ore, minuti e secondi
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Formatta la data nel formato richiesto
        const formattedDate =
            days > 0
                ? `${currentDate.toISOString()} (${days} ${days === 1 ? 'day' : 'days'} ago)`
                : hours > 0
                    ? `${currentDate.toISOString()} (${hours} ${hours === 1 ? 'hour' : 'hours'} ago)`
                    : minutes > 0
                        ? `${currentDate.toISOString()} (${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago)`
                        : `${currentDate.toISOString()} (${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago)`;

        return formattedDate;
    };

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>
            <Stack direction="row" alignItems="center">
                <img src="logo100.png" height="40" />
                <Typography variant="h3" sx={{ ml: 1.5 }}>{process.env.REACT_APP_NAME}</Typography>
            </Stack>
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
        </IconButton>
        <DialogContent>
            <Typography><strong>Version:</strong> {process.env.REACT_APP_VERSION}.{data ?? 0}</Typography>
            {data && <Typography><strong>Date:</strong> {formatTimestamp(parseInt(data))}</Typography>}
            <Typography><strong>Browser:</strong> {navigator.userAgent}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}
                aria-label="close">
                Close
            </Button>
        </DialogActions>
    </Dialog>
}