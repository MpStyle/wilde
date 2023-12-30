export const PathUtils = {
    separator: '/',
    isValid: (...parts: string[]): boolean => {
        const invalidPathChars = PathUtils.getInvalidPathChars();
        return (() => {
            for (const part of parts) {
                if (!part || !part.length) {
                    return false;
                }

                for (const char of part) {
                    if (invalidPathChars.includes(char.charCodeAt(0).toString(16))) {
                        return false;
                    }
                }
            }
            return true;
        })();
    },
    combine: (...parts: string[]): string => {
        const error = !PathUtils.isValid();

        if (error) {
            throw new Error("Invalid chars in path");
        }

        let combinedPath = parts.join(PathUtils.separator);

        if (combinedPath.endsWith(PathUtils.separator) && combinedPath.length > 1) {
            combinedPath = combinedPath.slice(0, -1);
        }

        return combinedPath;
    },
    getInvalidPathChars: (): string[] => {
        return [
            ...Array.from({length: 31}, (_, i) => i.toString(16)),
            ...['|', '"', "<", ">"].map(c => c.charCodeAt(0).toString(16))
        ];

        // return [
        //     ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)), // Uppercase letters
        //     ...Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i)), // Lowercase letters
        //     ...Array.from({length: 10}, (_, i) => i.toString()),              // Numbers
        //     '_', '-', ' ', '.'                                                      // Underscore, hyphen, space
        // ].map(c => c.charCodeAt(0).toString(16));
    },
    getInvalidFileNameChars: (): string[] => {
        return [
            ...Array.from({length: 31}, (_, i) => i.toString(16)),
            ...['|', '"', "<", ">"].map(c => c.charCodeAt(0).toString(16))
        ];
    }
}