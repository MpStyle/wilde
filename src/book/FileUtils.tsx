export const FileUtils = {
    getExtension: (fileName: string): string | null => {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return null;
        }

        const extension = fileName.slice(lastDotIndex + 1);
        return extension.toLowerCase();
    }
}