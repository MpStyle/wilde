export type DirectoryStructure = {
    [path: string]: {
        handler: FileSystemHandle,
        content: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
    }
};