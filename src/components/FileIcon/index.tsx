import { ReactComponent as FileIconSvg } from '@/assets/icons/file.svg'
import { getLanguageForFileName } from '@/utils'
import fileIcons from '@/constants/fileIcons'
import React, { memo } from 'react'

interface IFileIconProps {
	fileName: string
}

const FileIcon = memo(({ fileName }: IFileIconProps): React.ReactElement => {
	let icon = fileIcons.fileNames[fileName]
	if (icon) {
		return (
			<i className="file-icon" style={{ color: icon.fontColor }}>
				{icon.fontCharacter}
			</i>
		)
	}

	const containsExtension = /\.(.*)$/g.exec(fileName)
	if (containsExtension) {
		const [_match, extension] = containsExtension
		icon = fileIcons.fileExtensions[extension]
	}
	if (icon) {
		return (
			<i className="file-icon" style={{ color: icon.fontColor }}>
				{icon.fontCharacter}
			</i>
		)
	}

	const languageIdForFile = getLanguageForFileName(fileName)
	if (languageIdForFile) icon = fileIcons.languageIds[languageIdForFile]
	if (icon) {
		return (
			<i className="file-icon" style={{ color: icon.fontColor }}>
				{icon.fontCharacter}
			</i>
		)
	}

	return <FileIconSvg width={12} height={12} />
})

export default FileIcon
