import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import { logsId } from '@/constants';

languages.register({
	id: logsId,
	extensions: ['.log'],
});
