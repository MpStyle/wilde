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

    const isCompatible = isUrlCreatorCompatible && isEventListenerCompatible && isFileSystemCompatible;

    return {
        isUrlCreatorCompatible,
        isEventListenerCompatible,
        isFileSystemCompatible,
        isCompatible
    }
}