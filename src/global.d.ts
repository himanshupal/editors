import { Environment, editor } from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
	interface Window {
		MonacoEnvironment: Environment;
		editor: typeof editor;
		editorInstance: editor.IStandaloneCodeEditor;
	}
}
