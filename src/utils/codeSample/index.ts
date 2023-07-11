import { SupportedLanguagesKey, supportedLanguages } from '@/constants/editors';

import logs from './logs';
import sol from './sol';

export const codeSampleFor: Partial<Record<SupportedLanguagesKey, string>> = { logs, sol };

export const isCodeSampleAvailable = (key: SupportedLanguagesKey): key is keyof typeof codeSampleFor =>
	key in codeSampleFor;

const codeSample = supportedLanguages.reduce(
	(p, c) => ({
		...p,
		...(c.key
			? {
					[c.key]: isCodeSampleAvailable(c.key) ? codeSampleFor[c.key] : '',
			  }
			: {}),
	}),
	{} as Record<SupportedLanguagesKey, string>
);

export default codeSample;
