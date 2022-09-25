import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

window.editor = editor;

export const defaultEditorConfig: editor.IStandaloneEditorConstructionOptions = {
	fontFamily: 'Cascadia Code, Jetbrains Mono',
	fontSize: 12,
	mouseWheelZoom: true,
	smoothScrolling: true,
	automaticLayout: true,
	fontLigatures: true,
	theme: 'aura-dark',
	fastScrollSensitivity: 7,
	occurrencesHighlight: false,
	renderLineHighlight: 'all',
	cursorSmoothCaretAnimation: true,
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
