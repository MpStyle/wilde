import {FileSystemHandle} from "./FileSystemHandle";

export type TreeNode = {
    handler: FileSystemHandle,
    depth: number,
    path: string,
    hasChildren: boolean,
    collapsed: boolean
};