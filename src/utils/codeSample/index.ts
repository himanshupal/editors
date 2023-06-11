import { SupportedLanguagesKey, supportedLanguages } from '@/constants/editors';
import { isCodeSampleAvailable } from '@/utils/detectType';

import logs from './logs';
import sol from './sol';

export const codeSampleFor: Partial<Record<SupportedLanguagesKey, string>> = { logs, sol };

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
