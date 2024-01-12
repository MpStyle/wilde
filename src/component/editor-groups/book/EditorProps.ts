export interface EditorProps {
    handle: FileSystemFileHandle;
    onContentChange: () => void;
    onContentRestore: () => void;
    onContentSave: () => void;
}