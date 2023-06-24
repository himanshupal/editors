import React, { Fragment, memo, useCallback, useRef, useState } from 'react'
import type { FileOrFolder, Folder } from '@/types/Database'
import { useEditorContext } from '@/context/EditorContext'
import { useEditorStore, useSidebarStore } from '@/store'
import { getLanguageForFileName, join } from '@/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { isFile } from '@/utils/detectType'
import { createPortal } from 'react-dom'
import Modal from '@/components/Modal'
import storage from '@/store/dexie'
import cuid from 'cuid'

import { ReactComponent as ChevronRight } from '@/assets/icons/chevron-right.svg'
import { ReactComponent as ChevronDown } from '@/assets/icons/chevron-down.svg'
import { ReactComponent as NewFolder } from '@/assets/icons/new-folder.svg'
import { ReactComponent as DeleteIcon } from '@/assets/icons/delete.svg'
import { ReactComponent as NewFile } from '@/assets/icons/new-file.svg'
import { ReactComponent as FileIcon } from '@/assets/icons/file.svg'

import style from './styles.module.scss'

type FormOrInputFocusEventHandler = React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement>

interface ITreeProps {
	deleteFileOrFolder(id: string): React.MouseEventHandler<SVGSVGElement>
	content: FileOrFolder
	level?: number
}

const Tree = memo(({ content, level = 0, deleteFileOrFolder }: ITreeProps) => {
	const { selectedItem, setSelectedItem } = useSidebarStore()
	const { createModel } = useEditorContext()

	const toggleExpandStatus = (id: string, status: boolean) => {
		storage.files.update(id, { isExpanded: status })
	}

	const File = memo(({ content: f }: Pick<ITreeProps, 'content'>) => (
		<div
			style={level ? { paddingLeft: level * 12 } : undefined}
			className={join('pointer', style.file, selectedItem?.id === f.id && style.fileSelected)}
			onClick={(e) => (
				e.stopPropagation(),
				setSelectedItem(f),
				isFile(f) ? createModel(getLanguageForFileName(f.name), f.name, f.id) : toggleExpandStatus(f.id, !f.isExpanded)
			)}
		>
			<span className="row" style={{ gap: isFile(f) ? 4 : 2, alignItems: 'center' }}>
				{isFile(f) ? (
					<FileIcon width={12} height={12} />
				) : f.isExpanded ? (
					<ChevronDown width={14} height={14} />
				) : (
					<ChevronRight width={14} height={14} />
				)}
				{f.name}
			</span>
			<span className={style.fileDelete}>
				<DeleteIcon width={16} height={16} onClick={deleteFileOrFolder(f.id)} />
			</span>
		</div>
	))

	const Folder = memo(({ content: folder }: { content: Folder }) => (
		<Fragment>
			<File content={folder} />
			{folder.isExpanded && folder.children?.map((el) => <Tree key={el.id} content={el} deleteFileOrFolder={deleteFileOrFolder} level={level + 1} />)}
		</Fragment>
	))

	return isFile(content) ? <File content={content} /> : <Folder content={content} />
})

const SidebarExplorer = () => {
	const { queue } = useEditorStore()
	const { createModel, closeModel } = useEditorContext()
	const { selectedItem, setSelectedItem } = useSidebarStore()

	const newFileRef = useRef<HTMLInputElement | null>(null)
	const formRef = useRef<HTMLFormElement | null>(null)

	// true represents a file, false represents a folder
	const [newFile, setNewFile] = useState<boolean>()
	const [confirmDeletionFor, setConfirmDeletionFor] = useState<string>()

	const elements = useLiveQuery(async () => {
		const data = await storage.files.toArray()
		// Creating a map below to avoid the find operation each time
		const map = new Map(data.map((f) => [f.id, f]))
		for (const f of data) {
			if (!f.parentId) continue
			const found = map.get(f.parentId)
			if (!found || isFile(found)) continue
			found.children = [...(found.children || []), f]
		}
		return data.filter((d) => !d.parentId)
	})

	const createFile = useCallback(
		(isFile: boolean): FormOrInputFocusEventHandler =>
			(e) => {
				e.preventDefault()
				if (!newFileRef.current) return
				const language = getLanguageForFileName(newFileRef.current.value)
				const newFileId = cuid()
				storage.files.add({
					id: newFileId,
					name: newFileRef.current.value,
					isFile,
					type: language,
					parentId: selectedItem?.isFile ? undefined : selectedItem?.id, // Allowing only folders to be parent
				})
				if (isFile) createModel(language, newFileRef.current.value, newFileId)
				setNewFile(undefined)
			},
		[storage, selectedItem]
	)

	const showInput = useCallback(
		(isFile: boolean) => () => {
			setNewFile(isFile)
			setTimeout(() => newFileRef.current?.focus(), 0)
		},
		[]
	)

	const deleteFileOrFolder = useCallback(
		(id: string): React.MouseEventHandler<SVGSVGElement> =>
			(e) => {
				e.stopPropagation()
				setConfirmDeletionFor(id)
			},
		[]
	)

	return (
		<Fragment>
			<div className={join('row', style.sidebarActions)}>
				<span title="New File" className="pointer centered" onClick={showInput(true)}>
					<NewFile height={16} width={16} />
				</span>
				<span title="New Folder" className="pointer centered" onClick={showInput(false)}>
					<NewFolder height={16} width={16} />
				</span>
			</div>
			<div className={style.sidebarContents} onClick={() => selectedItem && setSelectedItem(undefined)}>
				{/* Wrapping to make the clickAway work by making the aread covered by files list smaller */}
				<div>
					{elements?.map((el) => (
						<Tree key={el.id} content={el} deleteFileOrFolder={deleteFileOrFolder} />
					))}
				</div>
				{newFile !== undefined && (
					<form ref={formRef} onSubmit={createFile(newFile)}>
						<input
							type="search"
							inputMode="text"
							ref={newFileRef}
							className={style.newFolderInput}
							onBlur={(e) => {
								if (!e.target.value) setNewFile(undefined)
								else formRef.current?.requestSubmit()
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
								storage.files.delete(confirmDeletionFor!)
								const modelToClose = queue.find((q) => q.fileId === confirmDeletionFor)
								modelToClose && closeModel(modelToClose)
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
		</Fragment>
	)
}

export default SidebarExplorer
