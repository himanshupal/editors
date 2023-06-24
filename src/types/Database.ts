export interface FileOrFolderBase {
	id: string;
	name: string;
	isFile: boolean;
	parentId?: string;
}

export interface Folder extends FileOrFolderBase {
	isExpanded: boolean;
	children?: Array<FileOrFolder>;
}

export interface File extends FileOrFolderBase {
	type?: string;
}

export type FileOrFolder = File | Folder;
