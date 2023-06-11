import type { SupportedLanguagesKey } from '@/constants';
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
