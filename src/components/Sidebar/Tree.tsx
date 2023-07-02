import type { FileOrFolderWithPriority } from '@/types/Database'
import { isFile } from '@/utils/detectType'
import { memo } from 'react'

import Folder from './Folder'
import File from './File'

export interface ITreeProps {
	deleteFileOrFolder(id: string): React.MouseEventHandler<SVGSVGElement>
	content: FileOrFolderWithPriority
	forceRenderInput?: boolean
	renderInput?: boolean
	rootId?: string
	level: number
}

const Tree = memo((props: ITreeProps) => (isFile(props.content) ? <File {...props} /> : <Folder {...props} content={props.content} />))

export default Tree
