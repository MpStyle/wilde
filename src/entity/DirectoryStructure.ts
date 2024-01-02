export type DirectoryStructure = {
    [path: string]: {
        handle: FileSystemDirectoryHandle,
        content: (FileSystemDirectoryHandle | FileSystemFileHandle)[]
    }
};