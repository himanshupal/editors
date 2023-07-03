import { memo, useCallback, useEffect, useRef } from 'react'
import { useEditorContext } from '@/context/EditorContext'
import { getLanguageForFileName } from '@/utils'
import { useSidebarStore } from '@/store'
import storage from '@/store/dexie'
import cuid from 'cuid'

import style from './styles.module.scss'

export interface INewFileInputProps {
	paddingLeft: number
}

export type FormOrInputFocusEventHandler = React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement>

const NewFileInput = memo(({ paddingLeft }: INewFileInputProps) => {
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

export default NewFileInput
