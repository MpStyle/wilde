import { FileUtils } from "./FileUtils";

const iconsFolder = 'icons/default/';

const directoryIconByTreeNode = (node: FileSystemHandle, collapsed: boolean | undefined): string => {
    let fileName = 'default_folder';

    switch (node.name) {
        case 'images':
        case 'imgs':
        case 'icons':
            fileName = 'folder_type_images';
            break;
        case 'common':
            fileName = 'folder_type_common';
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
        case '.github':
            fileName = 'folder_type_github';
            break;
        case '.idea':
            fileName = 'folder_type_idea';
            break;
        case 'docs':
            fileName = 'folder_type_docs';
            break;
        case 'src':
            fileName = 'folder_type_src';
            break;
        case 'js':
            fileName = 'folder_type_js';
            break;
        case 'node_modules':
            fileName = 'folder_type_node';
            break;
        case 'component':
            fileName = 'folder_type_component';
            break;
        case 'locale':
        case 'locales':
            fileName = 'folder_type_locale';
            break;
        case 'hook':
        case 'hooks':
            fileName = 'folder_type_hook';
            break;
        case 'coverage':
            fileName = 'folder_type_coverage';
            break;
    }

    return collapsed ? fileName : `${fileName}_opened`;
}

const fileIconByTreeNode = (node: FileSystemHandle): string => {
    switch (node.name) {
        case 'robots.txt':
            return 'file_type_robots';
        case 'package.json':
        case 'package-lock.json':
            return 'file_type_npm';
        case 'tsconfig.json':
            return 'file_type_tsconfig';
    }

    const extension = FileUtils.getExtension(node.name);

    if (extension) {
        switch (extension) {
            case 'svg':
                return `file_type_svg`;
            case 'png':
            case 'gif':
            case 'jpg':
                return `file_type_image`;
            case 'js':
                if (node.name.endsWith('.test.js')) {
                    return 'file_type_testjs';
                }

                return 'file_type_js';
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
                if (node.name.endsWith('.test.ts')) {
                    return 'file_type_testts';
                }

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