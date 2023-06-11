import type { SupportedLanguagesKey } from '@/constants';
import type { editor } from 'monaco-editor';

export interface ModelInfo {
	id: string;
	name?: string;
	fileId?: string;
	model: editor.ITextModel;
}

export interface IEditorContext {
	mountElementRef: React.MutableRefObject<HTMLDivElement | null>;

	createModel(language?: SupportedLanguagesKey, name?: string, fileId?: string): void;
	setCurrentModel(tab: ModelInfo): void;
	closeModel(tab: ModelInfo): void;
}
