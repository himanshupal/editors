import type { editor } from 'monaco-editor';
import { create } from 'zustand';

interface EditorState {
	editor?: editor.IStandaloneCodeEditor;
	setEditor(editor?: editor.IStandaloneCodeEditor): void;
}

const useEditorStore = create<EditorState>((set) => ({
	setEditor: (editor) => set({ editor }),
}));

export default useEditorStore;
