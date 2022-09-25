import { logsId } from '@/constants';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

editor.defineTheme(logsId, {
	colors: {},
	base: 'vs',
	inherit: false,
	rules: [
		{ token: 'custom-info', foreground: '808080' },
		{ token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold', background: 'ffffff' },
		{ token: 'custom-notice', foreground: 'FFA500' },
		{ token: 'custom-date', foreground: '008800' },
	],
});
