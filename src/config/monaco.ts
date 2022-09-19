import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { SolidityId } from '@/workers';

import codeSample from '@/utils/codeSample';

export const defaultMonacoConfig: editor.IStandaloneEditorConstructionOptions = {
	fontFamily: 'Cascadia Code, Jetbrains Mono',
	fontSize: 12,
	mouseWheelZoom: true,
	smoothScrolling: true,
	automaticLayout: true,
	fontLigatures: true,
	value: codeSample.logs,
	theme: SolidityId,
	language: SolidityId,
	fastScrollSensitivity: 7,
	occurrencesHighlight: false,
	renderLineHighlight: 'all',
	cursorSmoothCaretAnimation: true,
	cursorBlinking: 'phase',
	cursorStyle: 'block-outline',
	minimap: {
		enabled: false,
	},
	scrollbar: {
		verticalScrollbarSize: 5,
		horizontalScrollbarSize: 7.5,
	},
};
