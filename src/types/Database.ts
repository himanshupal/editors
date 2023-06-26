export interface FileOrFolderBase {
	id: string;
	name: string;
	isFile: boolean;
	parentId?: string;
}

export interface Folder<C = FileOrFolder> extends FileOrFolderBase {
	isExpanded: boolean;
	children?: Array<C>;
}

export interface File extends FileOrFolderBase {
	type?: string;
}

export type FileOrFolder = File | Folder;
export type FileOrFolderWithPriority = (File | Folder<FileOrFolderWithPriority>) & { isFirst: boolean };
