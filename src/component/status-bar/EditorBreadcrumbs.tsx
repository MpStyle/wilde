import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs } from "@mui/material";
import { FunctionComponent, useId } from "react";
import { useSelector } from "react-redux";
import { PathUtils } from "../../book/PathUtils";
import { AppState } from "../../store/AppStore";
import { EditorBreadcrumb } from './EditorBreadcrumb';

export const EditorBreadcrumbs: FunctionComponent = () => {
    const currentEditor = useSelector((appState: AppState) => appState.openEditors.currentEditor);
    const rootDirectory = useSelector((appState: AppState) => appState.projectFolder.rootDirectory);
    const directoryStructure = useSelector((appState: AppState) => appState.projectFolder.directoryStructure);
    const crumbId = useId();

    if (!rootDirectory) {
        return null;
    }

    const breadcrumbsParts = () => {
        if (!currentEditor) {
            return <EditorBreadcrumb
                label={rootDirectory.name ?? PathUtils.rootPath}
                path={PathUtils.rootPath}
                handle={rootDirectory}
                key={crumbId} />;
        }

        const currentEditorPath = currentEditor.path.replace(PathUtils.rootPath, rootDirectory.name);
        const completePathParts = currentEditor.path.split(PathUtils.separator);
        const currentEditorPathParts = currentEditorPath.split(PathUtils.separator);

        return currentEditorPathParts.map((part, i) => {
            const isLast = i === currentEditorPathParts.length - 1;
            const path = PathUtils.combine(...(completePathParts.slice(0, i + 1)));

            let handle: FileSystemHandleUnion | undefined = currentEditor?.handle;
            if (!isLast) {
                const selectedPathStructure = path && directoryStructure.hasOwnProperty(path) ? directoryStructure[path] : undefined;
                handle = selectedPathStructure?.handle;
            }

            if (!handle) {
                return null;
            }

            return <EditorBreadcrumb
                label={part}
                path={PathUtils.combine(...(completePathParts.slice(0, i + 1)))}
                handle={handle}
                key={`breadcrumbs-path-part-${i}`} />
        });
    }

    return <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
        {breadcrumbsParts()}
    </Breadcrumbs>;
}