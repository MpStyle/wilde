import { FileSystemHandle } from "../../../entity/FileSystemHandle";

export type TreeNode = {
    handle: FileSystemHandle,
    depth: number,
    path: string,
    hasChildren: boolean,
    collapsed: boolean
};