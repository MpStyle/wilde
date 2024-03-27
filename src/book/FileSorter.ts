export type SortResult = -1 | 0 | 1;

export const FileSorter = {
    byTypeByName: (a: FileSystemHandleUnion, b: FileSystemHandleUnion): SortResult => {
        if (a.kind < b.kind) {
            return -1;
        }
        if (a.kind > b.kind) {
            return 1;
        }

        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName < bName) {
            return -1;
        }

        if (aName > bName) {
            return 1;
        }

        return 0;
    }
}