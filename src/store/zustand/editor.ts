import type { ModelInfo } from '@/types/context/EditorContext';
import type { editor } from 'monaco-editor';
import { create } from 'zustand';

interface EditorState {
	editor?: editor.IStandaloneCodeEditor;
	setEditor(editor?: editor.IStandaloneCodeEditor): void;

	currentModel?: editor.ITextModel;
	setCurrentModel(currentModel?: editor.ITextModel): void;

	queue: ModelInfo[];
	setQueue(queue: ModelInfo[]): void;

	deleteViewState(id: string): void;
	viewState: { [id: string]: editor.ICodeEditorViewState | null };
	setViewState(id: string, state: editor.ICodeEditorViewState | null): void;

	activeFileId?: string;
	setActiveFileId(activeFileId?: string): void;
}

const useEditorStore = create<EditorState>((set, get) => ({
	queue: [],
	viewState: {},
	setQueue: (queue) => set({ queue }),
	setEditor: (editor) => set({ editor }),
	setCurrentModel: (currentModel) => set({ currentModel }),
	setActiveFileId: (activeFileId) => set({ activeFileId }),
	setViewState: (id, viewState) => set({ viewState: { ...get().viewState, [id]: viewState } }),
	deleteViewState: (id) => {
		set({
			viewState: (() => {
				const { viewState } = get();
				delete viewState[id];
				return viewState;
			})(),
		});
	},
}));

export default useEditorStore;
