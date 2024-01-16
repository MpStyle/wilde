export type TreeNode = {
    handle: FileSystemHandleUnion,
    depth: number,
    path: string,
    hasChildren: boolean,
    collapsed: boolean
};