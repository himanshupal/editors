import type { SupportedLanguagesKey } from '@/constants';
import type { FileOrFolder } from '@/types/Database';
import { supportedLanguages } from '@/constants';

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

export const getParentsIdsForFile = (f: FileOrFolder, allFolders: FileOrFolder[]): string[] => {
	if (!f.parentId) return [];
	const parentFolder = allFolders.find(({ id }) => id === f.parentId);
	const parentIds = !parentFolder ? [] : getParentsIdsForFile(parentFolder, allFolders);
	return [f.parentId, ...parentIds];
};
