import { logsId } from '@/constants';
import codeSample from '@/utils/codeSample';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

window.editor = editor;

export const defaultEditorConfig: editor.IStandaloneEditorConstructionOptions = {
	model: editor.createModel(codeSample.logs, 'logs'),
	fontFamily: 'Cascadia Code, Jetbrains Mono',
	fontSize: 12,
	mouseWheelZoom: true,
	smoothScrolling: true,
	automaticLayout: true,
	fontLigatures: true,
	theme: logsId,
	// theme: 'aura-dark',
	fastScrollSensitivity: 7,
	occurrencesHighlight: false,
	renderLineHighlight: 'all',
	cursorSmoothCaretAnimation: 'on',
	cursorBlinking: 'phase',
	cursorStyle: 'block-outline',
	bracketPairColorization: {
		enabled: true,
		independentColorPoolPerBracketType: true,
	},
	// rulers: [80, 120, 150, 200, 220, 250, 275],
	minimap: {
		enabled: false,
		autohide: true,
		scale: 2,
	},
	scrollbar: {
		verticalScrollbarSize: 7.5,
		horizontalScrollbarSize: 7.5,
	},
};
