// https://github.com/microsoft/vscode/blob/main/extensions/theme-seti/icons/vs-seti-icon-theme.json

import { iconDefinitions, fileExtensions, fileNames, languageIds } from '@/assets/icons-config.json';

type IconKeys = [string, keyof typeof iconDefinitions];

const getIcons = (v: Record<string, string>): Record<string, (typeof iconDefinitions)['_asm']> => {
	return (Object.entries(v) as IconKeys[]).reduce(
		(p, [k, v]) => ({
			...p,
			[k]: iconDefinitions[v],
		}),
		{}
	);
};

export default {
	fileExtensions: getIcons(fileExtensions),
	languageIds: getIcons(languageIds),
	fileNames: getIcons(fileNames),
};
