export type ProjectStructure = {
    [path: string]: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
};