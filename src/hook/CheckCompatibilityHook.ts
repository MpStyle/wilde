export type CompatibilityInfo = {
    isUrlCreatorCompatible: boolean;
    isEventListenerCompatible: boolean;
    isFileSystemCompatible: boolean;
    isIndexedDbCompatible: boolean;
    isCompatible: boolean;
};

export const useCheckCompatibility = () => {
    // window.URL
    // window.webkitURL
    const isUrlCreatorCompatible = typeof window.URL !== "undefined" || typeof window.webkitURL !== "undefined";

    // window.addEventListener
    // window.removeEventListener
    const isEventListenerCompatible = typeof window.addEventListener !== "undefined" && typeof window.removeEventListener !== "undefined";

    // window.showOpenFilePicker
    // window.showDirectoryPicker
    const isFileSystemCompatible = typeof window.showOpenFilePicker !== "undefined" && typeof window.showDirectoryPicker !== "undefined";

    // IndexedDB
    const isIndexedDbCompatible = 'indexedDB' in window;

    const isCompatible = isUrlCreatorCompatible && isEventListenerCompatible && isFileSystemCompatible && isIndexedDbCompatible;

    return {
        isUrlCreatorCompatible,
        isEventListenerCompatible,
        isFileSystemCompatible,
        isIndexedDbCompatible,
        isCompatible
    } as CompatibilityInfo;
}