export type DirectoryStructure = {
    [path: string]: {
        handler: FileSystemDirectoryHandle,
        content: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
    }
};