export const DirectoryUtils = {
    getParent: (filePath: string): string => {
        if (!filePath) {
            throw new Error("Invalid path");
        }

        const normalizedPath = filePath.replace(/\\/g, '/');
        const pathParts = normalizedPath.split('/');

        pathParts.pop();

        const parentDirectoryPath = pathParts.join('/');

        if (normalizedPath.startsWith('/')) {
            return `/${parentDirectoryPath}`;
        }

        return parentDirectoryPath;
    }
}