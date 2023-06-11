import { useEditorContext } from '@/context/EditorContext'
import { getLanguageForFileName, join } from '@/utils'
import { Fragment, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import NewFolder from '@/assets/icons/NewFolder'
import DeleteIcon from '@/assets/icons/Delete'
import { useActivityBarStore } from '@/store'
import NewFile from '@/assets/icons/NewFile'
import { createPortal } from 'react-dom'
import Modal from '@/components/Modal'
import storage from '@/store/dexie'
import cuid from 'cuid'

import style from './styles.module.scss'

type FormOrInputFocusEventHandler = React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement>

const Sidebar = () => {
	const { createModel } = useEditorContext()
	const { activeTab } = useActivityBarStore()
	const formRef = useRef<HTMLFormElement | null>(null)
	const newFileRef = useRef<HTMLInputElement | null>(null)
	const elements = useLiveQuery(() => storage.files.toArray(), [])

	// true represents a file, false represents a folder
	const [newFile, setNewFile] = useState<boolean>()
	const [confirmDeletionFor, setConfirmDeletionFor] = useState<string>()

	const createFile =
		(isFile: boolean): FormOrInputFocusEventHandler =>
		(e) => {
			e.preventDefault()
			if (!newFileRef.current) return
			const language = getLanguageForFileName(newFileRef.current.value)
			const newFileId = cuid()
			storage.files.add({ id: newFileId, name: newFileRef.current.value, isFile, type: language })
			if (isFile) createModel(language, newFileRef.current.value, newFileId)
			setNewFile(undefined)
		}

	const showInput = (isFile: boolean) => () => {
		setNewFile(isFile)
		setTimeout(() => newFileRef.current?.focus(), 0)
	}

	const deleteFileOrFolder = (id: string) => () => {
		setConfirmDeletionFor(id)
	}

	if (!activeTab) return <div /> // To prevent split from collapsing

	return (
		<div className={style.sidebar}>
			<div className={join('row', style.sidebarActions)}>
				<span title="New File" className="pointer centered" onClick={showInput(true)}>
					<NewFile height={16} width={16} />
				</span>
				<span title="New Folder" className="pointer centered" onClick={showInput(false)}>
					<NewFolder height={16} width={16} />
				</span>
			</div>
			<div className={style.sidebarContents}>
				{elements?.map(({ id, name, isFile }) => (
					<div
						key={id}
						className={join('pointer', style.file)}
						onClick={() => (!isFile ? null : createModel(getLanguageForFileName(name), name, id))}
					>
						{isFile ? '+' : '>'} {name}
						<span className={style.fileDelete}>
							<DeleteIcon width={16} height={16} onClick={deleteFileOrFolder(id)} />
						</span>
					</div>
				))}
				{newFile !== undefined && (
					<form ref={formRef} onSubmit={createFile(newFile)}>
						<input
							type="search"
							inputMode="text"
							ref={newFileRef}
							onBlur={(e) => {
								if (!e.target.value) setNewFile(undefined)
								else formRef.current?.requestSubmit() /* return createFile(newFile)(e) */
							}}
							onChange={({ target }) => {
								!target.value && setNewFile(undefined)
							}}
						/>
					</form>
				)}
			</div>
			{createPortal(
				<Modal title="Are you sure?" open={!!confirmDeletionFor} onClose={() => setConfirmDeletionFor(undefined)}>
					<Fragment>
						<button
							onClick={() => {
								setConfirmDeletionFor(undefined)
								storage.files.delete(confirmDeletionFor!)
							}}
						>
							Delete
						</button>
						<button onClick={() => setConfirmDeletionFor(undefined)}>Cancel</button>
					</Fragment>
				</Modal>,
				document.getElementById('root')!
			)}
		</div>
	)
}

export default Sidebar
