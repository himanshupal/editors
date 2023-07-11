import { memo, useCallback, useEffect, useRef } from 'react'
import { useEditorContext } from '@/context/EditorContext'
import { getLanguageForFileName } from '@/utils'
import { useSidebarStore } from '@/store'
import storage from '@/store/dexie'
import cuid from 'cuid'

import { ReactComponent as ChevronRight } from '@/assets/icons/chevron-right.svg'
import { ReactComponent as FileIcon } from '@/assets/icons/file.svg'

import style from './styles.module.scss'
import { isFile } from '@/utils/detectType'

export interface INewFileInputProps {
	paddingLeft: number
}

export type FormOrInputFocusEventHandler = React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement>

const NewFileInput = memo(({ paddingLeft = 0 }: INewFileInputProps) => {
	const { selectedItem, newFile, setNewFile } = useSidebarStore()
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
					...(isFile ? { type: language, content: '' } : { isExpanded: true }),
				})
				if (isFile) createModel(language, newFileRef.current.value, newFileId)
				setNewFile(undefined)
			},
		[storage, selectedItem]
	)

	return newFile === undefined ? null : (
		<form
			ref={formRef}
			style={{
				padding: '0.15rem 0',
				paddingLeft: `calc(${
					selectedItem
						? (!isFile(selectedItem) || !selectedItem.parentId) && newFile === undefined
							? `${paddingLeft}px + 0.25rem`
							: `${paddingLeft}px`
						: `0.25rem`
				})`,
			}}
			onSubmit={createFile(newFile)}
		>
			<span className="row" style={{ gap: newFile === undefined ? 0 : newFile ? 4 : 2, alignItems: 'center' }}>
				{newFile === undefined ? null : newFile ? <FileIcon width={12} height={12} /> : <ChevronRight width={14} height={14} />}
				<input
					type="search"
					inputMode="text"
					ref={newFileRef}
					className={style.newFolderInput}
					onBlur={(e) => {
						if (!e.target.value) setNewFile(undefined)
						else formRef.current?.requestSubmit()
					}}
					// onChange={({ target }) => {
					// 	!target.value && setNewFile(undefined)
					// }}
				/>
			</span>
		</form>
	)
})

export default NewFileInput
