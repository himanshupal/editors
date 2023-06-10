export interface FileOrFolder {
	id: string;
	name: string;
	isFile: boolean;
	parentId?: string;
}

export interface Folder extends FileOrFolder {
	isExpanded: boolean;
}

export interface File extends FileOrFolder {
	type: string;
}
