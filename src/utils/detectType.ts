import type { SupportedLanguagesKey } from '@/constants';
import type { FileOrFolderBase, File } from '@/types/Database';
import { codeSampleFor } from '@/utils/codeSample';

export const isFile = (fileOrFolder: FileOrFolderBase): fileOrFolder is File => fileOrFolder.isFile;

export const isCodeSampleAvailable = (key: SupportedLanguagesKey): key is keyof typeof codeSampleFor =>
	key in codeSampleFor;
