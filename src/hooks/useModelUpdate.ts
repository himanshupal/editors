import { useCallback, useState, useSyncExternalStore } from 'react';
import { defaultEditorConfig } from '@/config/editor';
import { shallow } from 'zustand/shallow';
import { useEditorStore } from '@/store';
import { editor } from 'monaco-editor';

const useModelUpdate = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
	const [setEditor] = useEditorStore(({ setEditor }) => [setEditor], shallow);
	const [modelCreated, setCreatedModel] = useState<editor.ITextModel>();
	const [modelClosed, setClosedModel] = useState<editor.ITextModel>();

	const getSnapshot = useCallback(() => ({ modelCreated, modelClosed }), []);

	return useSyncExternalStore(() => {
		const handlerCreate = editor.onDidCreateModel(setCreatedModel);
		const handlerRemove = editor.onWillDisposeModel(setClosedModel);

		let instance: editor.IStandaloneCodeEditor | undefined;

		if (ref.current) {
			instance = editor.create(ref.current, defaultEditorConfig);
			setEditor(instance);
		}

		return () => {
			handlerCreate.dispose();
			handlerRemove.dispose();
			instance?.dispose();
		};
	}, getSnapshot);
};

export default useModelUpdate;
