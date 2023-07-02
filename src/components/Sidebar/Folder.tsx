import type { FileOrFolderWithPriority, Folder } from '@/types/Database'
import { isFile } from '@/utils/detectType'
import { useSidebarStore } from '@/store'
import { Fragment, useMemo } from 'react'

import Tree, { type ITreeProps } from './Tree'
import File from './File'

export interface IFolderProps extends ITreeProps {
	content: Folder<FileOrFolderWithPriority> & { isFirst: boolean }
}

const Folder = ({ content: folder, deleteFileOrFolder, level, rootId }: IFolderProps) => {
	const isRoot = folder.id === folder.name && folder.id === rootId
	const { selectedItem } = useSidebarStore()

	const renderInput = useMemo(() => {
		if (selectedItem) {
			if (isFile(selectedItem)) {
				return selectedItem.parentId ? selectedItem.parentId === folder.id : folder.id === rootId
			} else {
				return selectedItem.id === folder.id
			}
		}
	}, [folder, selectedItem])

	return (
		<Fragment>
			<File content={folder} renderInput={renderInput} deleteFileOrFolder={deleteFileOrFolder} level={level} isRoot={isRoot} />
			{folder.isExpanded &&
				folder.children?.map((f) => <Tree key={f.id} content={f} deleteFileOrFolder={deleteFileOrFolder} level={level + Number(!isRoot)} />)}
		</Fragment>
	)
}

export default Folder
