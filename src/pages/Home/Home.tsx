import { SupportedLanguagesKey, supportedLanguages } from '@/constants'
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg'
import LanguageSelection from '@/components/Modal/LanguageSelection'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { useActivityBarStore, useEditorStore } from '@/store'
import { useEditorContext } from '@/context/EditorContext'
import { shallow } from 'zustand/shallow'
import { useState } from 'react'
import Split from 'react-split'
import { join } from '@/utils'

import ActivityBar from '@/components/ActivityBar'
import Sidebar from '@/components/Sidebar'

const Home = () => {
	const { activeTab, setActiveTab } = useActivityBarStore()
	const [langModalOpen, setLangModalOpen] = useState<boolean>(false)
	const [currentModel, tabs] = useEditorStore((state) => [state.currentModel, state.queue], shallow)
	const { mountElementRef, closeModel, createModel, setCurrentModel } = useEditorContext()

	return (
		<div className="fullpage row">
			<ActivityBar />

			<Split
				gutterSize={3}
				sizes={[15, 85]}
				className="split"
				snapOffset={[100, 0]}
				minSize={[0, window.innerWidth / 2]}
				collapsed={+!activeTab ? 0 : undefined}
				onDragEnd={([sidebarWidth]) => {
					if (sidebarWidth < 10 && activeTab) {
						setActiveTab(undefined)
					} else if (sidebarWidth > 5 && !activeTab) {
						setActiveTab('explorer')
					}
				}}
			>
				<Sidebar />
				<div className="fullpage" onDoubleClick={() => (tabs.length ? null : setLangModalOpen(true))}>
					{tabs.length ? (
						<div className="tabs pointer" onDoubleClick={() => setLangModalOpen(true)}>
							{tabs.map((tab) => (
								<div
									key={tab.id}
									className={join('tab', tab.model.id === currentModel?.id && 'active')}
									onClick={() => (tab.model.id === currentModel?.id ? null : setCurrentModel(tab))}
								>
									{tab.name || tab.model.id}
									<span className="tab__close" >
										<CloseIcon onClick={(e) => (e.stopPropagation(), closeModel(tab))} />
									</span>
								</div>
							))}
						</div>
					) : (
						<div className="editor no-events" style={{ textAlign: 'center' }}>
							Double Click anywhere for a new tab
						</div>
					)}

					<div className={join(!!editor.getModels().length && 'editor')} ref={mountElementRef} />

					<LanguageSelection
						title="Select Language"
						onClose={(s) => (setLangModalOpen(false), s && createModel(s as SupportedLanguagesKey))}
						languages={supportedLanguages}
						open={langModalOpen}
					/>
				</div>
			</Split>
		</div>
	)
}

export default Home
