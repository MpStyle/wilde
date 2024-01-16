import { PathUtils } from "./PathUtils";

export const DirectoryUtils = {
    getParent: (filePath: string): string => {
        if (!filePath) {
            throw new Error("Invalid path");
        }

        const normalizedPath = filePath.replace(/\\/g, '/');
        const pathParts = normalizedPath.split(PathUtils.separator);

        pathParts.pop();

        const parentDirectoryPath = pathParts.join(PathUtils.separator);

        if (normalizedPath.startsWith(PathUtils.separator)) {
            return `/${parentDirectoryPath}`;
        }

        return parentDirectoryPath;
    },
    exists: async (folder: FileSystemDirectoryHandle, directoryName: string): Promise<boolean> => {
        let result = false;
        for await (const value of folder.values()) {
            result = value.name === directoryName;
            if (result) {
                break;
            }
        }

        return result;
    }
}