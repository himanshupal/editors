import type { FileOrFolder, Folder } from '@/types/Database';
import type { SupportedLanguagesKey } from '@/constants';
import { supportedLanguages } from '@/constants';
import { isFile } from './detectType';

export const join = (...classes: Array<string | boolean | undefined>) => classes.filter(Boolean).join(' ');

export const getLanguageForFileName = (fileName: string): SupportedLanguagesKey | undefined => {
	const containsExtension = /\.(.*)$/g.exec(fileName);

	return supportedLanguages.find(({ extensions }) => {
		const localExtensions = extensions as readonly string[] | undefined;

		if (containsExtension) {
			const [_match, extension] = containsExtension;
			return localExtensions?.includes(extension);
		}

		return localExtensions?.includes(fileName);
	})?.key;
};

export const getParentsIdsForFile = (f: FileOrFolder, allFolders: Folder[]): string[] => {
	if (!f.parentId) return [];
	const parentFolder = allFolders.find(({ id, isExpanded }) => id === f.parentId && !isExpanded);
	const parentIds = !parentFolder ? [] : getParentsIdsForFile(parentFolder, allFolders);
	return [f.parentId, ...parentIds];
};

export const getChildrenIds = (f: FileOrFolder): string[] => {
	if (f.isFile) return [f.id];
	return [f.id, ...((f as Folder).children || []).flatMap((f) => getChildrenIds(f))];
};

export const sortStoredFiles = (data: FileOrFolder[]): FileOrFolder[] => {
	const initialSortedData = data.sort((a) => (isFile(a) ? 1 : -1));
	const filesAfterIndex = initialSortedData.findLastIndex(({ isFile }) => !isFile) + 1;
	return [
		...initialSortedData.slice(0, filesAfterIndex),
		...initialSortedData.slice(filesAfterIndex).sort((a, b) => {
			const [f, s] = [a.name.toLocaleLowerCase(), b.name.toLocaleLowerCase()];
			return f < s ? -1 : f > s ? 1 : 0;
		}),
	];
};
