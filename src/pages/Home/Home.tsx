import LanguageSelection from '@/components/Modal/LanguageSelection'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { errorMessage, supportedLanguages } from '@/constants'
import { defaultEditorConfig } from '@/config/editor'
import { useState, useEffect, useRef } from 'react'
import CloseIcon from '@/assets/icons/Close'
import codeSample from '@/utils/codeSample'
import { join } from '@/utils'

interface Tab {
	id: string
	title: string
}

const Home = () => {
	const mountElement = useRef<HTMLDivElement | null>(null)
	const editorInstance = useRef<editor.IStandaloneCodeEditor | null>(null)

	const [currentModel, setCurrentModel] = useState<editor.ITextModel | null>(null)
	const [previousModel, setPreviousModel] = useState<editor.ITextModel | null>(null)
	const [tabs, setTabs] = useState<Array<Tab>>(editor.getModels().map(({ id }) => ({ id, title: id })))
	const [editorState, setEditorState] = useState<Record<string, editor.ICodeEditorViewState | null>>({})

	const [langModalOpen, setLangModalOpen] = useState<boolean>(false)

	useEffect(() => {
		if (!mountElement.current) return
		editorInstance.current = editor.create(mountElement.current, defaultEditorConfig)
		const defaultModels = editor.getModels()
		if (defaultModels.length) changeModelTo(defaultModels[0])
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

	const newTab = (language?: string | null) => {
		if (language === null) return
		if (!editorInstance.current) return console.debug(errorMessage.noEditor)
		const newModel = editor.createModel(language === 'sol' ? codeSample.ERC20 : '', language)
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
		<div className="fullpage" onDoubleClick={() => (tabs.length ? null : setLangModalOpen(true))}>
			{tabs.length ? (
				<div className="tabs pointer" onDoubleClick={() => setLangModalOpen(true)}>
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
				<div className="editor no-events" style={{ textAlign: 'center' }}>
					Double Click anywhere for a new tab
				</div>
			)}

			<div className={join(!!editor.getModels().length && 'editor')} ref={mountElement} />

			<LanguageSelection
				title="Select Language"
				onClose={(s) => (setLangModalOpen(false), newTab(s))}
				languages={supportedLanguages}
				open={langModalOpen}
			/>
		</div>
	)
}

export default Home
