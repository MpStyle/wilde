export type DirectoryStructure = {
    [path: string]: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
};