import { useLiveQuery } from 'dexie-react-hooks'
import NewFolder from '@/assets/icons/NewFolder'
import DeleteIcon from '@/assets/icons/Delete'
import { useActivityBarStore } from '@/store'
import NewFile from '@/assets/icons/NewFile'
import { Fragment, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { filesDB } from '@/store/dexie'
import Modal from '@/components/Modal'
import { join } from '@/utils'
import cuid from 'cuid'

import style from './styles.module.scss'

type FormOrInputFocusEventHandler = React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement>

const Sidebar = () => {
	const { activeTab } = useActivityBarStore()
	const newFileRef = useRef<HTMLInputElement | null>(null)
	const elements = useLiveQuery(() => filesDB.files.toArray(), [])

	// true represents a file, false represents a folder
	const [newFile, setNewFile] = useState<boolean>()
	const [confirmDeletionFor, setConfirmDeletionFor] = useState<string>()

	const createFile =
		(isFile: boolean): FormOrInputFocusEventHandler =>
		(e) => {
			e.preventDefault()
			if (!newFileRef.current) return
			filesDB.files.add({ id: cuid(), name: newFileRef.current.value, isFile })
			setNewFile(undefined)
		}

	const showInput = (isFile: boolean) => () => {
		setNewFile(isFile)
		setTimeout(() => newFileRef.current?.focus(), 0)
	}

	const deleteFileOrFolder = (id: string) => () => {
		setConfirmDeletionFor(id)
	}

	return !activeTab ? null : (
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
					<div className={join('pointer', style.file)} key={id}>
						{isFile ? '+' : '>'} {name}
						<span className={style.fileDelete}>
							<DeleteIcon width={16} height={16} onClick={deleteFileOrFolder(id)} />
						</span>
					</div>
				))}
				{newFile !== undefined && (
					<form onSubmit={createFile(newFile)}>
						<input
							type="search"
							inputMode="text"
							ref={newFileRef}
							onBlur={(e) => {
								if (!e.target.value) setNewFile(undefined)
								else return createFile(newFile)(e)
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
								filesDB.files.delete(confirmDeletionFor!)
								setConfirmDeletionFor(undefined)
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
