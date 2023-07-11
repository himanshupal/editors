import type { FileOrFolderBase, File } from '@/types/Database';

export const isFile = (fileOrFolder: FileOrFolderBase): fileOrFolder is File => fileOrFolder.isFile;
