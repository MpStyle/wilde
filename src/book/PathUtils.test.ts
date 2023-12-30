import {PathUtils} from "./PathUtils";

describe('PathUtils', () => {
    test('combine folders', () => {
        const result = PathUtils.combine('root', 'folder1', 'folder2');
        expect(result).toBe('root/folder1/folder2');
    });

    test('combine folders and file', () => {
        const result = PathUtils.combine('root', 'folder1', 'folder2', 'file.txt');
        expect(result).toBe('root/folder1/folder2/file.txt');
    });

    test('combine folder with empty parts', () => {
        expect(() => PathUtils.combine('', 'folder1', '', 'file.txt')).toThrow(Error);
    });

    test('should add a trailing separator when necessary', () => {
        const result = PathUtils.combine('/');
        expect(result).toBe('/');
    });
});