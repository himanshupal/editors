import type { FileOrFolderWithPriority, Folder } from '@/types/Database'
import { Fragment, memo, useMemo } from 'react'
import { isFile } from '@/utils/detectType'
import { useSidebarStore } from '@/store'

import Tree, { type ITreeProps } from './Tree'
import NewFileInput from './NewFileInput'
import File from './File'

export interface IFolderProps extends ITreeProps {
	content: Folder<FileOrFolderWithPriority> & { isFirst: boolean }
}

const Folder = memo(({ content: f, renderInput: r, forceRenderInput: fr, deleteFileOrFolder, level, rootId }: IFolderProps) => {
	const isRoot = f.id === f.name && f.id === rootId
	const { selectedItem, newFile } = useSidebarStore()

	const renderInput = useMemo(() => {
		if (!selectedItem || (isFile(selectedItem) && !selectedItem.parentId)) return isRoot
		if (!isFile(selectedItem)) return selectedItem.id === f.id
		return selectedItem.parentId === f.id
	}, [f, selectedItem])

	const forceRenderInput = useMemo<boolean>(() => {
		if (newFile === undefined || !f.children || !renderInput) return false
		return !f.children.some(({ isFile }) => newFile === isFile)
	}, [newFile, f, renderInput])

	return (
		<Fragment>
			<File content={f} level={level} renderInput={r} isRoot={isRoot} forceRenderInput={fr} deleteFileOrFolder={deleteFileOrFolder} />
			{f.isExpanded &&
				(!f.children
					? renderInput && <NewFileInput paddingLeft={(level + 1) * 12} />
					: f.children.map((f) => (
							<Tree
								key={f.id}
								content={f}
								renderInput={renderInput}
								forceRenderInput={forceRenderInput}
								deleteFileOrFolder={deleteFileOrFolder}
								level={level + Number(!isRoot)}
							/>
					  )))}
		</Fragment>
	)
})

export default Folder
