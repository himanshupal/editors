import type { FileOrFolder, File } from '@/types/Database';

export const isFile = (fileOrFolder: FileOrFolder): fileOrFolder is File => fileOrFolder.isFile;
