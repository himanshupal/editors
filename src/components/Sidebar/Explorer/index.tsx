import type { FileOrFolder, FileOrFolderWithPriority, Folder } from '@/types/Database'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { getChildrenIds, join, sortStoredFiles } from '@/utils'
import { useEditorContext } from '@/context/EditorContext'
import { useEditorStore, useSidebarStore } from '@/store'
import { useLiveQuery } from 'dexie-react-hooks'
import { isFile } from '@/utils/detectType'
import { createPortal } from 'react-dom'
import Modal from '@/components/Modal'
import storage from '@/store/dexie'
import cuid from 'cuid'

import { ReactComponent as CollapseAll } from '@/assets/icons/collapse-all.svg'
import { ReactComponent as NewFolder } from '@/assets/icons/new-folder.svg'
import { ReactComponent as NewFile } from '@/assets/icons/new-file.svg'

import style from '../styles.module.scss'
import Tree from './Tree'

type LiveQueryReturnType = [Map<string, FileOrFolderWithPriority>, FileOrFolder[], FileOrFolderWithPriority[]]

const root = cuid()
const SidebarExplorer = () => {
	const { queue } = useEditorStore()
	const { closeModel, expandFolders } = useEditorContext()
	const { selectedItem, setSelectedItem, setNewFile } = useSidebarStore()

	const [confirmDeletionFor, setConfirmDeletionFor] = useState<string>()

	const [filesMap, rawFilesList, filesList] = useLiveQuery<LiveQueryReturnType, LiveQueryReturnType>(
		async () => {
			let rawData = await storage.files.toArray()
			const data = sortStoredFiles(rawData).reduce<FileOrFolderWithPriority[]>((p, c) => {
				const isFirst = !p.some(({ isFile, parentId }) => c.parentId === parentId && c.isFile === isFile)
				return [...p, isFile(c) ? { ...c, isFirst } : { ...c, isFirst, children: undefined }]
			}, [])

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

	const rootFolder = useMemo<FileOrFolderWithPriority>(
		() => ({ id: root, name: root, isExpanded: true, isFile: false, isFirst: true, children: filesList }),
		[filesList]
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
				<span title="Collapse Folders in Explorer" className="pointer centered" onClick={collapseAll}>
					<CollapseAll height={16} width={16} />
				</span>
			</div>
			<div className={style.sidebarContents} onClick={() => selectedItem && setSelectedItem(undefined)}>
				{/* Wrapping to make the clickAway work by making the area covered by files list smaller */}
				<div>
					<Tree content={rootFolder} deleteFileOrFolder={deleteFileOrFolder} level={0} rootId={root} />
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
