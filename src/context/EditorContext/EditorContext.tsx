import React, { createContext, useContext, useLayoutEffect, useRef } from 'react'
import type { IEditorContext, ModelInfo } from '@/types/context/EditorContext'
import { editor as monaco } from 'monaco-editor/esm/vs/editor/editor.api'
import { errorMessage, type SupportedLanguagesKey } from '@/constants'
import { defaultEditorConfig } from '@/config/editor'
import codeSample from '@/utils/codeSample'
import { shallow } from 'zustand/shallow'
import { useEditorStore } from '@/store'
import cuid from 'cuid'

const initialState: IEditorContext = {
	mountElementRef: { current: null },
	setCurrentModel: () => null,
	createModel: () => null,
	closeModel: () => null,
}

const Context = createContext<IEditorContext>(initialState)

const EditorStateProvider = ({ children }: React.PropsWithChildren) => {
	const { queue, setQueue, editor, setEditor, currentModel, setCurrentModel, viewState, setViewState, deleteViewState } = useEditorStore(
		(state) => state,
		shallow
	)

	const initialized = useRef<boolean>(false)
	const mountElementRef = useRef<HTMLDivElement | null>(null)

	/** Initializing editor instance  */
	useLayoutEffect(() => {
		if (!mountElementRef.current) return
		if (initialized.current) return
		initialized.current = true
		setEditor(monaco.create(mountElementRef.current, defaultEditorConfig))
		return () => editor?.dispose()
	}, [])

	const changeModelTo = async (model: monaco.ITextModel) => {
		if (!editor) return console.error(errorMessage.noEditor)
		const oldModelInfo = queue.find((q) => q.model.id === currentModel?.id)
		if (oldModelInfo) setViewState(oldModelInfo.id, editor.saveViewState())
		editor.setModel(model)
		const newModelInfo = queue.find((q) => q.model.id === model.id)
		if (newModelInfo) editor.restoreViewState(viewState[newModelInfo.id])
		setCurrentModel(model)
		editor.focus()
	}

	const createModel = (language?: SupportedLanguagesKey, name?: string, fileId?: string) => {
		const openTab = queue.find((q) => q.fileId === fileId)
		if (openTab) return changeModelTo(openTab.model)
		const newModel = monaco.createModel((language && codeSample[language]) || '', language)
		void changeModelTo(newModel)
		setQueue([
			...queue,
			{
				model: newModel,
				id: cuid(),
				fileId,
				name,
			},
		])
	}

	const closeModel = async ({ id, model }: ModelInfo) => {
		const remainingQueue = queue.filter((q) => q.id !== id)
		setQueue(remainingQueue)
		deleteViewState(id)
		model.dispose()

		const [lastInQueue] = remainingQueue.slice(-1)
		if (lastInQueue) changeModelTo(lastInQueue.model)
	}

	return (
		<Context.Provider
			value={{
				closeModel,
				createModel,
				mountElementRef,
				setCurrentModel({ model }) {
					changeModelTo(model)
				},
			}}
		>
			{children}
		</Context.Provider>
	)
}

export const useEditorContext = () => useContext(Context)
export default EditorStateProvider
