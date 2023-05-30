import { useLiveQuery } from 'dexie-react-hooks'
import NewFolder from '@/assets/icons/NewFolder'
import { useActivityBarStore } from '@/store'
import NewFile from '@/assets/icons/NewFile'
import { filesDB } from '@/store/dexie'
import { useState } from 'react'
import { join } from '@/utils'
import cuid from 'cuid'

import style from './styles.module.scss'

const Sidebar = () => {
	const { activeTab } = useActivityBarStore()
	const [fileName, setFileName] = useState<string>('')
	const [newFile, setNewFile] = useState<[file: boolean, folder: boolean]>([false, false])

	const elements = useLiveQuery(() => filesDB.files.toArray(), [])

	const createFile =
		(isFile: boolean): React.FormEventHandler<HTMLFormElement> & React.FocusEventHandler<HTMLInputElement> =>
		(e) => {
			e.preventDefault()
			filesDB.files.add({ id: cuid(), name: fileName, isFile, type: 'sol' })
			setNewFile([false, false])
			setFileName('')
		}

	return !activeTab ? null : (
		<div className={style.sidebar}>
			<div className={join('row', style.sidebarActions)}>
				<span title="New File" className="pointer centered" onClick={() => setNewFile([true, false])}>
					<NewFile height={16} width={16} />
				</span>
				<span title="New Folder" className="pointer centered" onClick={() => setNewFile([false, true])}>
					<NewFolder height={16} width={16} />
				</span>
			</div>
			<div className={style.sidebarContents}>
				{elements?.map((x) => (
					<div className={join('pointer', style.file)} key={x.id}>
						{x.name}
					</div>
				))}
				{!!newFile.filter(Boolean).length && (
					<form onSubmit={createFile(newFile[0])}>
						<input
							type="search"
							inputMode="text"
							value={fileName}
							onBlur={(e) => {
								if (e.target.value) return createFile(newFile[0])(e)
								setNewFile([false, false])
								setFileName('')
							}}
							onChange={({ target }) => {
								setFileName(target.value)
								!target.value && setNewFile([false, false])
							}}
						/>
					</form>
				)}
			</div>
		</div>
	)
}

export default Sidebar
