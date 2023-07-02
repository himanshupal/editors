import type { FileOrFolderWithPriority, Folder } from '@/types/Database'
import { isFile } from '@/utils/detectType'
import { useSidebarStore } from '@/store'
import { Fragment, useMemo } from 'react'

import Tree, { type ITreeProps } from './Tree'
import NewFileInput from './NewFileInput'
import File from './File'

export interface IFolderProps extends Omit<ITreeProps, 'forceRenderInput'> {
	content: Folder<FileOrFolderWithPriority> & { isFirst: boolean }
}

const Folder = ({ content: folder, renderInput: r, deleteFileOrFolder, level, rootId }: IFolderProps) => {
	const isRoot = folder.id === folder.name && folder.id === rootId
	const { selectedItem, newFile } = useSidebarStore()

	const renderInput = useMemo(() => {
		if (!selectedItem || (isFile(selectedItem) && !selectedItem.parentId)) return isRoot
		if (!isFile(selectedItem)) return selectedItem.id === folder.id
		return selectedItem.parentId === folder.id
	}, [folder, selectedItem])

	const forceRenderInput = useMemo<boolean>(() => {
		if (newFile === undefined || !folder.children || !renderInput) return false
		return !folder.children.some(({ isFile }) => newFile === isFile)
	}, [newFile, renderInput])

	return (
		<Fragment>
			<File level={level} renderInput={r} isRoot={isRoot} content={folder} deleteFileOrFolder={deleteFileOrFolder} />
			{folder.isExpanded &&
				(!folder.children
					? renderInput && <NewFileInput paddingLeft={(level + 1) * 12} />
					: folder.children.map((f) => (
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
}

export default Folder
