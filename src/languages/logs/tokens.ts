import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import { logsId } from '@/constants';

languages.setMonarchTokensProvider(logsId, {
	tokenizer: {
		root: [
			[/\[error.*/, 'custom-error'],
			[/\[notice.*/, 'custom-notice'],
			[/\[info.*/, 'custom-info'],
			[/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
		],
	},
});
