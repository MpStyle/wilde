import Menu, { MenuProps } from '@mui/material/Menu';
import { FunctionComponent, KeyboardEventHandler, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileSorter } from '../../book/FileSorter';
import { PathUtils } from '../../book/PathUtils';
import { DirectoryInfo, scanProjectDirectory } from '../../slice/ProjectDirectorySlice';
import { AppDispatch, AppState } from '../../store/AppStore';
import { BreadcrumbsMenuEmptyItem } from './BreadcrumbsMenuEmptyItem';
import { BreadcrumbsMenuItem } from './BreadcrumbsMenuItem';
import { BreadcrumbsMenuLoadingItem } from './BreadcrumbsMenuLoadingItem';

export interface BreadcrumbsMenuProps extends Omit<MenuProps, 'open' | 'onClose' | 'anchorEl' | 'onKeyDown'> {
    menuItemRef: null | HTMLElement;
    setIsOpen: (open: boolean) => void;
    isOpen: boolean;
    path: string;
    dirHandle: FileSystemDirectoryHandle;
    onExited: () => void;
    onFileClick: () => void;
}

export const BreadcrumbsMenu: FunctionComponent<BreadcrumbsMenuProps> = props => {
    const { path, dirHandle, menuItemRef, isOpen, setIsOpen, onExited, onFileClick, ...other } = props;
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const dispatch = useDispatch<AppDispatch>();
    const directoryInfo = directoryStructure.hasOwnProperty(path) ? directoryStructure[path] : {} as DirectoryInfo;
    const directoryContent = [...(directoryInfo.content ?? [])];
    const isScanning = directoryInfo.isScanning ?? false;

    directoryContent.sort(FileSorter.byTypeByName);

    useEffect(() => {
        if (!directoryStructure.hasOwnProperty(path)) {
            dispatch(scanProjectDirectory({ path, dirHandle }))
        }
    }, [])

    const handleMenuKeyDown: KeyboardEventHandler<HTMLDivElement> = (ev) => {
        ev.stopPropagation()

        if ((ev.key !== 'ArrowLeft' && ev.key !== 'Escape') || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey)
            return;

        ev.preventDefault();
        setIsOpen(false);
    }

    return <Menu
        {...other}
        TransitionProps={{
            onExited: onExited
        }}
        disableRestoreFocus
        onKeyDown={handleMenuKeyDown}
        sx={{
            pointerEvents: 'none',
            '& .MuiList-root': {
                pointerEvents: 'auto'
            }
        }
        }
        MenuListProps={{
            ...other.MenuListProps
        }}
        anchorEl={menuItemRef}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorOrigin={other.anchorOrigin ?? { vertical: 'center', horizontal: 'right' }}
        transformOrigin={other.transformOrigin ?? { vertical: 'center', horizontal: 'left' }}>

        {isScanning && <BreadcrumbsMenuLoadingItem />}

        {!isScanning && Boolean(!directoryContent.length) && <BreadcrumbsMenuEmptyItem />}

        {!isScanning && directoryContent.map(child => <BreadcrumbsMenuItem
            onFileClick={onFileClick}
            key={`breadcrumbs-menu-item-${PathUtils.combine(path, child.name)}`}
            handle={child}
            path={PathUtils.combine(path, child.name)} />)}
    </Menu>;
}