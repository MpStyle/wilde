import {EditorInfoUnion, FileEditorInfo} from "../../../slice/OpenEditorsSlice";

export interface EditorProps {
    editor: EditorInfoUnion;
    onContentChange: () => void;
    onContentRestore: () => void;
    onContentSave: () => void;
}

export interface FileEditorProps {
    editor: FileEditorInfo;
    onContentChange: () => void;
    onContentRestore: () => void;
    onContentSave: () => void;
}