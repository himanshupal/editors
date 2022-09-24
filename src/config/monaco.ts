import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

window.editor = editor;

export const defaultMonacoConfig: editor.IStandaloneEditorConstructionOptions = {
	fontFamily: 'Cascadia Code, Jetbrains Mono',
	fontSize: 12,
	mouseWheelZoom: true,
	smoothScrolling: true,
	automaticLayout: true,
	fontLigatures: true,
	theme: 'vs-dark',
	language: 'typescript',
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
		verticalScrollbarSize: 7.5,
		horizontalScrollbarSize: 7.5,
	},
};
