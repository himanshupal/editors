import type { supportedLanguages } from '@/constants'
import Modal, { IModalProps } from './Modal'
import style from './styles.module.scss'
import { join } from '@/utils'

interface ILanguageSelectionProps extends Omit<IModalProps, 'children' | 'onClose'> {
	onClose: (selection?: string | null) => void
	languages: typeof supportedLanguages
}

const LanguageSelection = (props: ILanguageSelectionProps) => {
	return (
		<Modal {...props}>
			<div className={style.modal__lang}>
				{props.languages.map(({ key, title }) => (
					<div key={title} className={join('pointer', style.modal__lang__item)} onClick={() => props.onClose(key)}>
						{title}
					</div>
				))}
			</div>
		</Modal>
	)
}

export default LanguageSelection
