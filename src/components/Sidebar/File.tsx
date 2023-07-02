import { useEditorContext } from '@/context/EditorContext'
import { getLanguageForFileName, join } from '@/utils'
import { isFile } from '@/utils/detectType'
import { useSidebarStore } from '@/store'
import { Fragment, memo } from 'react'

import { ReactComponent as ChevronRight } from '@/assets/icons/chevron-right.svg'
import { ReactComponent as ChevronDown } from '@/assets/icons/chevron-down.svg'
import { ReactComponent as DeleteIcon } from '@/assets/icons/delete.svg'
import { ReactComponent as FileIcon } from '@/assets/icons/file.svg'

import NewFileInput from './NewFileInput'
import type { ITreeProps } from './Tree'

import style from './styles.module.scss'

export interface IFileProps extends Omit<ITreeProps, 'rootId'> {
	isRoot?: boolean
}

const File = memo(({ content: f, renderInput, level, deleteFileOrFolder, forceRenderInput, isRoot }: IFileProps) => {
	const { selectedItem, setSelectedItem, newFile } = useSidebarStore()
	const { createModel, expandFolders } = useEditorContext()

	return (
		<Fragment>
			{renderInput && f.isFirst && (forceRenderInput || newFile === f.isFile) && <NewFileInput paddingLeft={level * 12} />}
			{!isRoot && (
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
			)}
		</Fragment>
	)
})

export default File
