import React, { createContext, useContext, useEffect, useLayoutEffect, useRef } from 'react'
import type { IEditorContext, ModelInfo } from '@/types/context/EditorContext'
import { editor as monaco } from 'monaco-editor/esm/vs/editor/editor.api'
import { errorMessage, type SupportedLanguagesKey } from '@/constants'
import { useEditorStore, useSidebarStore } from '@/store'
import { defaultEditorConfig } from '@/config/editor'
import { getParentsIdsForFile } from '@/utils'
import type { Folder } from '@/types/Database'
import codeSample from '@/utils/codeSample'
import { isFile } from '@/utils/detectType'
import { shallow } from 'zustand/shallow'
import storage from '@/store/dexie'
import cuid from 'cuid'

const expandFolders = function (ids: string[], status = true) {
	for (const id of ids) {
		storage.files.update(id, { isExpanded: status })
	}
}

const initialState: IEditorContext = {
	mountElementRef: { current: null },
	setCurrentModel: () => null,
	createModel: () => null,
	closeModel: () => null,
	expandFolders,
}

const Context = createContext<IEditorContext>(initialState)

const EditorStateProvider = ({ children }: React.PropsWithChildren) => {
	const { setSelectedItem } = useSidebarStore()
	const {
		queue,
		setQueue,
		editor,
		setEditor,
		currentModel,
		activeFileId,
		setCurrentModel,
		viewState,
		setViewState,
		deleteViewState,
		setActiveFileId,
	} = useEditorStore((state) => state, shallow)

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

	const handler = (e: monaco.IModelContentChangedEvent) => {
		if (!activeFileId || !currentModel) return
		storage.files.update(activeFileId, { content: currentModel.getValue() })
	}

	useEffect(() => {
		if (!currentModel) return
		const disposableHandle = currentModel.onDidChangeContent(handler)
		return () => disposableHandle.dispose()
	}, [currentModel, activeFileId])

	const changeModelTo = async (model: monaco.ITextModel, fileId?: string) => {
		if (!editor) return console.error(errorMessage.noEditor)
		const oldModelInfo = queue.find((q) => q.model.id === currentModel?.id)
		if (oldModelInfo) setViewState(oldModelInfo.id, editor.saveViewState())
		editor.setModel(model)
		const newModelInfo = queue.find((q) => q.model.id === model.id)
		if (newModelInfo) editor.restoreViewState(viewState[newModelInfo.id])
		setCurrentModel(model)
		editor.focus()

		if (!newModelInfo?.fileId && !fileId) return
		const allFilesFromStorage = await storage.files.toArray()
		const fileFromStorage = allFilesFromStorage.find(({ id }) => id === fileId || id === newModelInfo?.fileId)
		if (!fileFromStorage || !isFile(fileFromStorage)) return
		setSelectedItem(fileFromStorage)
		expandFolders(getParentsIdsForFile(fileFromStorage, allFilesFromStorage.filter((f) => !isFile(f)) as Folder[]))
	}

	const createModel = async (language?: SupportedLanguagesKey, name?: string, fileId?: string) => {
		const openTab = queue.find((q) => q.fileId === fileId)
		if (openTab) return changeModelTo(openTab.model)
		let initialContent = (language && codeSample[language]) || ''
		if (fileId) {
			setActiveFileId(fileId)
			const file = await storage.files.get(fileId)
			if (file && isFile(file)) initialContent = file.content
		}
		const newModel = monaco.createModel(initialContent, language)
		void changeModelTo(newModel, fileId)
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
		else setSelectedItem(undefined)
	}

	return (
		<Context.Provider
			value={{
				closeModel,
				createModel,
				expandFolders,
				mountElementRef,
				setCurrentModel({ model, fileId }) {
					setActiveFileId(fileId)
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
