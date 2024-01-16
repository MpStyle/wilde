export type SortResult = -1 | 0 | 1;

export const FileSorter = {
    byTypeByName: (a: FileSystemHandleUnion, b: FileSystemHandleUnion): SortResult => {
        if (a.kind < b.kind) {
            return -1;
        }
        if (a.kind > b.kind) {
            return 1;
        }

        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }
}