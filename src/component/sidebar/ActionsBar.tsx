import { ButtonGroup, IconButton } from "@mui/material";
import { FunctionComponent, Fragment } from "react";
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { useWilde } from "../../hook/WildeHook";
import { refreshProjectDirectory } from "../../slice/ProjectDirectorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store/AppStore";

export const ActionsBar: FunctionComponent<ActionsBarProps> = props => {
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const dispatch = useDispatch<AppDispatch>();
    const wilde = useWilde();

    const handleRefreshProjectDirectory = async () => {
        if (!rootDirectory) {
            return;
        }

        dispatch(refreshProjectDirectory({
            rootHandle: rootDirectory,
            paths: props.openedNodeIds
        }));
    };

    return <ButtonGroup variant="text"
        aria-label="project explorer actions"
        size="small">
        {rootDirectory && <Fragment>
            <IconButton title="New File..."
                size="small"
                onClick={() => wilde.newFile()}>
                <NoteAddIcon fontSize="small" />
            </IconButton>
            <IconButton title="New folder..."
                size="small"
                onClick={() => wilde.newDirectory()}>
                <CreateNewFolderIcon fontSize="small" />
            </IconButton>
            <IconButton title="Collapse all"
                size="small"
                onClick={props.handleCollapseAllClick}>
                <UnfoldLessIcon fontSize="small" />
            </IconButton>
            <IconButton title="Refresh"
                size="small"
                onClick={() => handleRefreshProjectDirectory()}>
                <CachedIcon fontSize="small" />
            </IconButton>
            <IconButton title="Close folder"
                size="small"
                onClick={() => wilde.closeDirectory()}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>}
    </ButtonGroup>;
};

export interface ActionsBarProps {
    openedNodeIds: string[];
    handleCollapseAllClick: () => void;
}