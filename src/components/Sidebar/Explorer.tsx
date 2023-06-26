import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import type { FileOrFolder, FileOrFolderWithPriority, Folder } from '@/types/Database'
import { getChildrenIds, getLanguageForFileName, join } from '@/utils'
import { useEditorContext } from '@/context/EditorContext'
import { useEditorStore, useSidebarStore } from '@/store'
import { useLiveQuery } from 'dexie-react-hooks'
import { isFile } from '@/utils/detectType'
import { createPortal } from 'react-dom'
import Modal from '@/components/Modal'
import storage from '@/store/dexie'
import cuid from 'cuid'

import { ReactComponent as ChevronRight } from '@/assets/icons/chevron-right.svg'
import { ReactComponent as ChevronDown } from '@/assets/icons/chevron-down.svg'
import { ReactComponent as CollapseAll } from '@/assets/icons/collapse-all.svg'
import { ReactComponent as NewFolder } from '@/assets/icons/new-folder.svg'
import { ReactComponent as DeleteIcon } from '@/assets/icons/delete.svg'
import { ReactComponent as NewFile } from '@/assets/icons/new-file.svg'
import { ReactComponent as FileIcon } from '@/assets/icons/file.svg'

import style from './styles.module.scss'

type FormOrInputFocusEventHandler = React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement>
type LiveQueryReturnType = [Map<string, FileOrFolderWithPriority>, FileOrFolder[], FileOrFolderWithPriority[]]

interface ITreeProps {
	deleteFileOrFolder(id: string): React.MouseEventHandler<SVGSVGElement>
	setNewFile: React.Dispatch<React.SetStateAction<boolean | undefined>>
	content: FileOrFolderWithPriority
	newFile?: boolean
	level?: number
}

const NewFileInput = memo(({ newFile, setNewFile, paddingLeft }: Pick<ITreeProps, 'newFile' | 'setNewFile'> & { paddingLeft: number }) => {
	const { selectedItem } = useSidebarStore()
	const { createModel } = useEditorContext()

	const formRef = useRef<HTMLFormElement | null>(null)
	const newFileRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (newFile === undefined) return
		setTimeout(() => newFileRef.current?.focus())
	}, [newFile])

	const createFile = useCallback(
		(isFile: boolean): FormOrInputFocusEventHandler =>
			(e) => {
				e.preventDefault()
				if (!newFileRef.current) return
				const language = getLanguageForFileName(newFileRef.current.value)
				const newFileId = cuid()
				storage.files.add({
					isFile,
					id: newFileId,
					name: newFileRef.current.value,
					parentId: selectedItem?.isFile ? selectedItem.parentId : selectedItem?.id, // Allowing only folders to be parent
					...(isFile ? { type: language } : { isExpanded: true }),
				})
				if (isFile) createModel(language, newFileRef.current.value, newFileId)
				setNewFile(undefined)
			},
		[storage, selectedItem]
	)

	return newFile === undefined ? null : (
		<form ref={formRef} style={{ paddingLeft }} onSubmit={createFile(newFile)}>
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
	)
})

const Tree = memo(({ content, level = 0, deleteFileOrFolder, newFile, setNewFile }: ITreeProps) => {
	const { selectedItem, setSelectedItem } = useSidebarStore()
	const { createModel, expandFolders } = useEditorContext()

	const File = memo(({ content: f }: Pick<ITreeProps, 'content'>) => (
		<Fragment>
			{selectedItem?.parentId === f.parentId && /* (!isFile(f) && !f.children?.length) || */ f.isFirst && f.isFile === newFile && (
				<NewFileInput paddingLeft={level * 12} newFile={newFile} setNewFile={setNewFile} />
			)}
			<div
				style={level ? { paddingLeft: level * 12 } : undefined}
				className={join('pointer', style.file, selectedItem?.id === f.id && style.fileSelected)}
				onClick={(e) => (
					e.stopPropagation(),
					setSelectedItem(f),
					isFile(f) ? createModel(getLanguageForFileName(f.name), f.name, f.id) : expandFolders([f.id], !f.isExpanded)
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
		</Fragment>
	))

	const Folder = memo(({ content: folder }: { content: Folder<FileOrFolderWithPriority> & { isFirst: boolean } }) => (
		<Fragment>
			<File content={folder} />
			{folder.isExpanded &&
				folder.children?.map((f) => (
					<Tree key={f.id} content={f} newFile={newFile} setNewFile={setNewFile} deleteFileOrFolder={deleteFileOrFolder} level={level + 1} />
				))}
		</Fragment>
	))

	return isFile(content) ? <File content={content} /> : <Folder content={content} />
})

const SidebarExplorer = () => {
	const { queue } = useEditorStore()
	const { closeModel, expandFolders } = useEditorContext()
	const { selectedItem, setSelectedItem } = useSidebarStore()

	// true represents a file, false represents a folder
	const [newFile, setNewFile] = useState<boolean>()
	const [confirmDeletionFor, setConfirmDeletionFor] = useState<string>()

	const [filesMap, rawFilesList, filesList] = useLiveQuery<LiveQueryReturnType, LiveQueryReturnType>(
		async () => {
			let rawData = await storage.files.toArray()
			const data = rawData.reduce<FileOrFolderWithPriority[]>(
				(p, c) => [...p, { ...c, isFirst: !p.some(({ isFile, parentId }) => c.parentId === parentId && c.isFile === isFile) }],
				[]
			)
			// Creating a map below to avoid the find operation each time
			const map = new Map(data.map((f) => [f.id, f]))
			for (const f of data) {
				if (!f.parentId) continue
				const found = map.get(f.parentId)
				if (!found || isFile(found)) continue
				found.children = [...(found.children || []), f]
			}
			return [map, rawData, data.filter((d) => !d.parentId)]
		},
		[],
		[new Map(), [], []]
	)

	const showInput = useCallback(
		(isFile: boolean) => () => {
			setNewFile(isFile)
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

	const collapseAll = useCallback(() => {
		const expandedFolders = rawFilesList.filter((f) => !isFile(f) && f.isExpanded) as Folder[]
		expandFolders(
			expandedFolders.map(({ id }) => id),
			false
		)
	}, [rawFilesList])

	const deleteFileOrFolderWithChildren = useCallback(() => {
		if (!confirmDeletionFor) return
		const fileWithChildrens = filesMap.get(confirmDeletionFor)
		if (!fileWithChildrens) return
		const idsToDelete = getChildrenIds(fileWithChildrens)

		const modelsToClose = queue.filter((q) => q.fileId && idsToDelete.includes(q.fileId))
		idsToDelete.forEach((id) => storage.files.delete(id))
		modelsToClose.forEach(closeModel)
		setConfirmDeletionFor(undefined)
	}, [storage, confirmDeletionFor, queue, filesMap])

	return (
		<Fragment>
			<div className={join('row', style.sidebarActions)}>
				<span title="New File" className="pointer centered" onClick={showInput(true)}>
					<NewFile height={16} width={16} />
				</span>
				<span title="New Folder" className="pointer centered" onClick={showInput(false)}>
					<NewFolder height={16} width={16} />
				</span>
				<span title="Collapse Folders in Explorer" className="pointer centered" onClick={collapseAll}>
					<CollapseAll height={16} width={16} />
				</span>
			</div>
			<div className={style.sidebarContents} onClick={() => selectedItem && setSelectedItem(undefined)}>
				{/* Wrapping to make the clickAway work by making the aread covered by files list smaller */}
				<div>
					{filesList.map((f) => (
						<Tree key={f.id} content={f} newFile={newFile} setNewFile={setNewFile} deleteFileOrFolder={deleteFileOrFolder} />
					))}
				</div>
			</div>
			{createPortal(
				<Modal title="Are you sure?" open={!!confirmDeletionFor} onClose={() => setConfirmDeletionFor(undefined)}>
					<Fragment>
						<button onClick={deleteFileOrFolderWithChildren}>Delete</button>
						<button onClick={() => setConfirmDeletionFor(undefined)}>Cancel</button>
					</Fragment>
				</Modal>,
				document.getElementById('root')!
			)}
		</Fragment>
	)
}

export default SidebarExplorer
