import { languages } from 'monaco-editor/esm/vs/editor/editor.api';
import { abiId } from '@/constants';

languages.register({
	id: abiId,
	extensions: ['.abi'],
});
