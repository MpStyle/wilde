import { useCheckCompatibility } from "./CheckCompatibilityHook";

describe('useCheckCompatibility', () => {
    test('should return correct compatibility flags', () => {
        const {
            isUrlCreatorCompatible,
            isEventListenerCompatible,
            isFileSystemCompatible,
            isIndexedDbCompatible,
            isCompatible
        } = useCheckCompatibility();

        // Test for URL creator compatibility
        expect(typeof isUrlCreatorCompatible).toBe('boolean');

        // Test for event listener compatibility
        expect(typeof isEventListenerCompatible).toBe('boolean');

        // Test for file system compatibility
        expect(typeof isFileSystemCompatible).toBe('boolean');

        // Test for IndexedDB compatibility
        expect(typeof isIndexedDbCompatible).toBe('boolean');

        // Test for overall compatibility
        expect(typeof isCompatible).toBe('boolean');

        // Ensure overall compatibility flag is correct based on individual flags
        expect(isCompatible).toBe(
            isUrlCreatorCompatible &&
            isEventListenerCompatible &&
            isFileSystemCompatible &&
            isIndexedDbCompatible
        );
    });
});
