import React, {Fragment, FunctionComponent, useState} from 'react';
import './App.css';
import {TreeItem, TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const App: FunctionComponent = () => {
    const [projectItems, setProjectItems] = useState<{
        [path: string]: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
    }>({});
    const [root, setRoot] = useState<FileSystemDirectoryHandle | undefined>(undefined)

    const addFolder = async (path: string, dirHandle: FileSystemDirectoryHandle) => {
        const values: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
        console.log("Index", path);

        for await (const value of dirHandle.values()) {
            values.push(value);
        }

        for (let value of values) {
            if (value.kind === 'directory') {
                await addFolder(path + value.name + "/", value);
            }
        }

        setProjectItems(projectItems => ({
            ...projectItems,
            [path]: values
        }));
    }

    const openFolder = async () => {
        const dirHandle = await window.showDirectoryPicker();
        setRoot(dirHandle);
        await addFolder("/", dirHandle);
    }

    const Folder: FunctionComponent<{ path: string }> = props => {
        console.log("Render", props.path);

        if (!projectItems.hasOwnProperty(props.path)) {
            return null;
        }

        return <Fragment>
            {projectItems[props.path].map(item =>
                <TreeItem
                    nodeId={item.name}
                    label={item.name}
                    key={props.path + "/" + item.name}>
                    {item.kind === 'directory' && <Folder path={props.path + item.name + "/"}/>}
                </TreeItem>
            )}
        </Fragment>;
    }

    return <div className="App">
        <button onClick={() => openFolder()}>Open folder</button>
        <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            sx={{flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}>
            {projectItems.hasOwnProperty("/") && <Folder path="/"/>}
        </TreeView>
    </div>;
}
