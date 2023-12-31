import {DirectoryUtils} from "./DirectoryUtils";

describe('DirectoryUtils', () => {
    test('parent of directory', () => {
        const result = DirectoryUtils.getParent('root/folder1/folder2');
        expect(result).toBe('root/folder1');
    });

    test('parent of file', () => {
        const result = DirectoryUtils.getParent('root/folder1/file.txt');
        expect(result).toBe('root/folder1');
    });
})