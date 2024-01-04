import {DirectoryUtils} from "./DirectoryUtils";
import {ByteUtils} from "./ByteUtils";

describe('ByteUtils', () => {
    test('format', () => {
        expect(ByteUtils.format(1)).toBe('1 B');
        expect(ByteUtils.format(1024)).toBe('1 KB');
        expect(ByteUtils.format(1499)).toBe('1.46 KB');
        expect(ByteUtils.format(Math.pow(1024, 2))).toBe('1 MB');
        expect(ByteUtils.format(Math.pow(1024, 3))).toBe('1 GB');
        expect(ByteUtils.format(Math.pow(1024, 4))).toBe('1 TB');
        expect(ByteUtils.format(Math.pow(1024, 5))).toBe('1 PB');
    });
})