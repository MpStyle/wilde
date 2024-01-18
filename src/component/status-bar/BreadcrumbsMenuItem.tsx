import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, MenuItem, MenuItemProps, MenuProps, Typography } from '@mui/material'
import { FunctionComponent, KeyboardEventHandler, useCallback, useId, useRef, useState } from 'react'
import { FileIcon } from '../common/file-icon/FileIcon'
import { BreadcrumbsMenu } from './BreadcrumbsMenu'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/AppStore'
import { openEditor } from '../../slice/OpenEditorsSlice'

type BreadcrumbsMenuItemProps = {
    button?: true
    MenuProps?: Omit<MenuProps, 'open' | 'onClose' | 'anchorEl' | 'onKeyDown'>
    path: string;
    handle: FileSystemHandleUnion;
    onFileClick: () => void;
} & Omit<MenuItemProps, 'onKeyDown' | 'onMouseEnter' | 'onMouseLeave'>

export const BreadcrumbsMenuItem: FunctionComponent<BreadcrumbsMenuItemProps> = props => {
    const { path, handle, children, MenuProps, onFileClick, ...other } = props;
    const [isOpen, setIsOpen] = useState(false)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), []);
    const dispatch = useDispatch<AppDispatch>();

    const menuItemRef = useRef<HTMLLIElement>(null)

    const handleItemKeyDown: KeyboardEventHandler<HTMLLIElement> = (ev) => {
        if ((ev.key !== 'ArrowRight' && ev.key !== 'Enter') || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey)
            return;

        ev.preventDefault()
        ev.stopPropagation()
        open()
    }

    return <MenuItem
        {...other}
        onKeyDown={handleItemKeyDown}
        ref={menuItemRef}
        sx={[{ display: 'block' }, isOpen && { backgroundColor: 'action.hover' }]}
        onMouseEnter={open}
        onMouseLeave={close}
        onClick={() => {
            if (handle.kind === 'file') {
                dispatch(openEditor({ handle, path }));
                onFileClick();
            }
        }}>

        <Box sx={{ display: 'flex' }}>
            <FileIcon sx={{ mr: 1 }} handle={handle} collapsed={!isOpen} path={path} />

            <Typography variant='body2' sx={{ flex: 1 }}>
                {handle.name}
            </Typography>

            {handle.kind === 'directory' && <NavigateNextIcon sx={{ fontSize: '1.2rem' }} />}
        </Box>

        {handle.kind === 'directory' && <BreadcrumbsMenu
            onFileClick={onFileClick}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            menuItemRef={menuItemRef.current}
            path={path}
            dirHandle={handle}
            onExited={() => menuItemRef.current?.focus()}
            {...MenuProps} />}
    </MenuItem>
}
