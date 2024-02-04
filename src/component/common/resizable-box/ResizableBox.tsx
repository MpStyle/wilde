import { Box, Stack, StackProps, useTheme } from "@mui/material";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";

export interface ResizableBoxProps extends StackProps {
    width: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
}

export const ResizableBox: FunctionComponent<ResizableBoxProps> = props => {
    const { children, width, minWidth, maxWidth, sx, ...others } = props;
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(width);
    const theme = useTheme();

    const startResizing = useCallback(() => setIsResizing(true), []);
    const stopResizing = useCallback(() => setIsResizing(false), []);
    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing && sidebarRef && sidebarRef.current) {
                setSidebarWidth(mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left);
            }
        },
        [isResizing]
    );

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return <Stack direction="row"
        {...others}
        className='ResizableBox'
        ref={sidebarRef}
        sx={{ width: sidebarWidth, minWidth, maxWidth, ...sx }}
        onMouseDown={(e) => e.preventDefault()}>
        <Box className="ResizableBox-content" sx={{ flex: 1, height: '100%' }}>
            {children}
        </Box>
        <Box className="ResizableBox-resizer"
            sx={{
                width: isResizing ? '3px' : '2px',
                background: isResizing ? theme.palette.primary.main : theme.palette.grey[400],
                cursor: 'col-resize',
                '&:hover': {
                    width: '3px',
                    background: theme.palette.primary.main,
                }
            }}
            onMouseDown={startResizing} />
    </Stack>
}