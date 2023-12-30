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
        const error = !PathUtils.isValid(...parts);

        if (error) {
            throw new Error("Invalid chars in path");
        }

        if (parts.length === 1) {
            return parts[0];
        }

        const isPathRooted = (path: string): boolean => path?.startsWith(PathUtils.separator) ?? false;

        const combineNoChecks = (path1: string, path2: string): string => {
            if (path2.length === 0) return path1;
            if (path1.length === 0 || isPathRooted(path2)) return path2;

            const ch = path1[path1.length - 1];
            return `${path1}${ch !== PathUtils.separator ? PathUtils.separator : ''}${path2}`;
        };

        return parts.reduce(combineNoChecks, '');
    },
    getInvalidPathChars: (): string[] => {
        return [
            ...Array.from({length: 31}, (_, i) => i.toString(16)),
            ...['|', '"', "<", ">"].map(c => c.charCodeAt(0).toString(16))
        ];
    },
    getInvalidFileNameChars: (): string[] => {
        return [
            ...Array.from({length: 31}, (_, i) => i.toString(16)),
            ...['|', '"', "<", ">"].map(c => c.charCodeAt(0).toString(16))
        ];
    }
}