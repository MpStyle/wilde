export const FileUtils = {
    writeContent: async (fileHandle: FileSystemFileHandle, content: string): Promise<void> => {
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    },
    getExtension: (fileName: string): string | null => {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return null;
        }

        const extension = fileName.slice(lastDotIndex + 1);
        return extension.toLowerCase();
    },
    isTextFile: async (fileHandle: FileSystemFileHandle): Promise<boolean> => {
        try {
            const file = await fileHandle.getFile();
            const reader = new FileReader();

            // Read only the first N bytes to determine if it's a text file
            const chunkSize = 512;
            const blob = file.slice(0, chunkSize);

            return new Promise<boolean>((resolve, reject) => {
                reader.onloadend = () => {
                    if (reader.error) {
                        reject(reader.error);
                    } else {
                        // Get the first bytes as an array
                        const byteArray = new Uint8Array(reader.result as ArrayBuffer);

                        // Check if it contains non-text characters
                        const isText = !byteArray.some(byte => byte < 9 || (byte > 13 && byte < 32) || byte === 127);

                        resolve(isText);
                    }
                };

                // Read the first N bytes as an ArrayBuffer
                reader.readAsArrayBuffer(blob);
            });
        } catch (error) {
            console.error("Error reading the file:", error);
            return false;
        }
    },
    exists: async (folder: FileSystemDirectoryHandle, fileName: string): Promise<boolean> => {
        let result = false;
        for await (const value of folder.values()) {
            result = value.name === fileName;
            if (result) {
                break;
            }
        }

        return result;
    }
}