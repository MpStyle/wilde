import {FileUtils} from "./FileUtils";

const iconsFolder = 'icons/default/';

const directoryIconByTreeNode = (node: FileSystemHandle, collapsed: boolean | undefined): string => {
    let fileName = 'default_folder';

    switch (node.name) {
        case 'images':
        case 'imgs':
            fileName = 'folder_type_images';
            break;
        case '.git':
            fileName = 'folder_type_git';
            break;
        case 'web':
            fileName = 'folder_type_www';
            break;
        case 'public':
            fileName = 'folder_type_public';
            break;
        case 'bin':
            fileName = 'folder_type_binary';
            break;
    }

    return collapsed ? fileName : `${fileName}_opened`;
}

const fileIconByTreeNode = (node: FileSystemHandle): string => {
    const extension = FileUtils.getExtension(node.name);

    if (extension) {
        switch (extension) {
            case 'png':
            case 'gif':
            case 'jpg':
            case 'svg':
                return `file_type_image`;
            case 'json':
                return 'file_type_json';
            case 'txt':
                return 'file_type_text';
            case 'html':
            case 'htm':
                return 'file_type_html';
            case 'xml':
                return 'file_type_xml';
            case 'gitignore':
                return 'file_type_git';
            case 'md':
                return 'file_type_markdown';
            case 'css':
                return 'file_type_css';
            case 'ts':
                return 'file_type_typescript';
            case 'tsx':
                return 'file_type_reactts';
            case 'jsx':
                return 'file_type_reactjs';
            case 'ino':
                return 'file_type_arduino';
            case 'ico':
                return 'file_type_favicon';
            case 'cs':
                return 'file_type_csharp';
            case 'csproj':
                return 'file_type_csproj';
            case 'sln':
                return 'file_type_sln';
        }
    }

    switch (node.name) {
        case 'LICENSE':
            return 'file_type_license';
    }

    return `default_file`
}

export const IconResolver = {
    byTreeNode: (node: FileSystemHandle, collapsed: boolean | undefined): string => {
        switch (node.kind) {
            case "directory":
                return `${iconsFolder}${directoryIconByTreeNode(node, collapsed)}.svg`;
            case "file":
                return `${iconsFolder}${fileIconByTreeNode(node)}.svg`
        }
    }
}