import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { defaultMonacoConfig } from '@/config/monaco'
import { useState, useEffect, useRef } from 'react'
import CloseIcon from '@/assets/icons/Close'
import { errorMessage } from '@/constants'
import { join } from '@/utils'

interface Tab {
	id: string
	title: string
}

const Editor = () => {
	const mountElement = useRef<HTMLDivElement | null>(null)
	const editorInstance = useRef<editor.IStandaloneCodeEditor | null>(null)

	const [tabs, setTabs] = useState<Array<Tab>>([])
	const [currentModel, setCurrentModel] = useState<editor.ITextModel | null>(null)
	const [previousModel, setPreviousModel] = useState<editor.ITextModel | null>(null)
	const [editorState, setEditorState] = useState<Record<string, editor.ICodeEditorViewState | null>>({})

	useEffect(() => {
		if (!mountElement.current) return
		editorInstance.current = editor.create(mountElement.current, defaultMonacoConfig)
		const onCreateListener = editor.onDidCreateModel((model) => {
			if (!editorInstance.current) return console.debug(errorMessage.noEditor)
			changeModelTo(model)
			setTabs((t) => [
				...t,
				{
					id: model.id,
					title: model.id,
				},
			])
		})
		function callback() {
			onCreateListener.dispose()
			editorInstance.current?.dispose()
		}
		return callback
	}, [mountElement.current])

	useEffect(() => {
		if (!editorInstance.current) return console.debug(errorMessage.noEditor)
		console.debug(`editorInstance updated`)
		window.editorInstance = editorInstance.current
	}, [editorInstance.current])

	useEffect(() => {
		if (!editorInstance.current) return console.debug(errorMessage.noEditor)
		editorInstance.current.setModel(currentModel)
		if (currentModel && currentModel.id in editorState) {
			editorInstance.current.restoreViewState(editorState[currentModel.id])
			editorInstance.current.focus()
		}
	}, [currentModel])

	const changeModelTo = (model: editor.ITextModel | null) => {
		if (currentModel) {
			setPreviousModel(currentModel)
			setEditorState((s) => {
				if (!editorInstance.current) {
					return console.debug(errorMessage.noEditor), s
				}
				return {
					...s,
					[currentModel.id]: editorInstance.current.saveViewState(),
				}
			})
		}
		setCurrentModel(model)
	}

	const newTab = () => {
		if (!editorInstance.current) return console.debug(errorMessage.noEditor)
		const newModel = editor.createModel('', defaultMonacoConfig.language)
		changeModelTo(newModel)
	}

	const setActiveTab = (id: string) => {
		const currentModel = editor.getModels().find((m) => m.id === id)
		if (!currentModel) return console.debug(errorMessage.noModel)
		changeModelTo(currentModel)
	}

	const closeTab = (id: string) => {
		const models = editor.getModels()
		const selectedModel = models.find((m) => m.id === id)
		if (!selectedModel) return console.debug(errorMessage.noModel)
		if (selectedModel.id in editorState) delete editorState[selectedModel.id]
		selectedModel.dispose()
		setTabs((t) => t.filter(({ id: mId }) => mId !== id))
		if (id !== currentModel?.id) return
		const [otherModel] = models.length - 1 ? models.slice(-1) : [null]
		changeModelTo(!previousModel || previousModel.isDisposed() ? otherModel : previousModel)
	}

	return (
		<div className="full-page" onDoubleClick={() => (tabs.length ? null : newTab())}>
			{tabs.length ? (
				<div className="tabs pointer" onDoubleClick={newTab}>
					{tabs.map(({ id, title }) => (
						<div key={id} className={join('tab', id === currentModel?.id && 'active')} onClick={() => setActiveTab(id)}>
							{title}
							<span className="tab__close" onClick={() => closeTab(id)}>
								<CloseIcon width={14} height={14} />
							</span>
						</div>
					))}
				</div>
			) : (
				<div className="editor" style={{ textAlign: 'center' }}>
					Double Click anywhere for a new tab
				</div>
			)}
			<div className={join(!!editor.getModels().length && 'editor')} ref={mountElement} />
		</div>
	)
}

export default Editor
