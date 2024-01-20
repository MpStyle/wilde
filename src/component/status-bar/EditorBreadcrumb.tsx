import { Button, Menu } from "@mui/material";
import Box from "@mui/material/Box";
import { Fragment, FunctionComponent, KeyboardEventHandler, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FileSorter } from "../../book/FileSorter";
import { PathUtils } from "../../book/PathUtils";
import { DirectoryInfo } from "../../slice/ProjectDirectorySlice";
import { AppState } from "../../store/AppStore";
import { FileIcon } from "../common/file-icon/FileIcon";
import { BreadcrumbsMenuItem } from "./BreadcrumbsMenuItem";
import { BreadcrumbsMenuLoadingItem } from "./BreadcrumbsMenuLoadingItem";
import { BreadcrumbsMenuEmptyItem } from "./BreadcrumbsMenuEmptyItem";

export interface EditorBreadcrumbProps {
    path: string;
    label: string;
    handle: FileSystemHandleUnion;
}

export const EditorBreadcrumb: FunctionComponent<EditorBreadcrumbProps> = props => {
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const { path } = props;
    const boxRef = useRef<HTMLElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const hasMenu = props.handle.kind === 'directory';
    const directoryInfo = directoryStructure.hasOwnProperty(path) ? directoryStructure[path] : {} as DirectoryInfo;
    const directoryContent = [...(directoryInfo.content ?? [])];
    directoryContent.sort(FileSorter.byTypeByName);

    const handleItemKeyDown: KeyboardEventHandler<HTMLElement> = (ev) => {
        if ((ev.key !== 'ArrowRight' && ev.key !== 'Enter') || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) return
        ev.preventDefault()
        ev.stopPropagation()
        open()
    }

    return <Fragment>
        <Box
            onKeyDown={handleItemKeyDown}
            ref={boxRef}
            sx={{ pt: 0, pb: 0, textTransform: 'none', minWidth: 'auto', fontSize: '1em', display: 'flex' }}
            onClick={open}
            component={hasMenu ? Button : 'span'}>
            <FileIcon handle={props.handle}
                sx={{ mr: '0.25em' }}
                size='small' />
            {props.label}
        </Box>

        {hasMenu && isOpen && <Menu
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={isOpen}
            anchorEl={boxRef.current ?? undefined}
            onClose={close}>

            {directoryInfo.isScanning && <BreadcrumbsMenuLoadingItem />}

            {!directoryInfo.isScanning && Boolean(!directoryContent.length) && <BreadcrumbsMenuEmptyItem />}

            {!directoryInfo.isScanning && directoryContent.map(child => <BreadcrumbsMenuItem
                onFileClick={close}
                key={`breadcrumbs-menu-item-${PathUtils.combine(path, child.name)}`}
                handle={child}
                path={PathUtils.combine(path, child.name)} />)}
        </Menu>}
    </Fragment>
}