import { FileSorter } from "./FileSorter";

describe('FileSorter', () => {
    describe('byTypeByName', () => {
        test('should sort files by type and then by name', () => {
            const file1 = { kind: 'file', name: 'file1.txt' } as FileSystemHandleUnion;
            const folder1 = { kind: 'directory', name: 'folder1' } as FileSystemHandleUnion;
            const file2 = { kind: 'file', name: 'file2.txt' } as FileSystemHandleUnion;
            const folder2 = { kind: 'directory', name: 'folder2' } as FileSystemHandleUnion;

            const unsortedFiles = [file2, folder2, file1, folder1];
            const sortedFiles = [folder1, folder2, file1, file2];

            expect(unsortedFiles.sort(FileSorter.byTypeByName)).toEqual(sortedFiles);
        });
    });
});