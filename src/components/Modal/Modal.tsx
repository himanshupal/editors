import CloseIcon from '@/assets/icons/Close'
import style from './styles.module.scss'
import { join } from '@/utils'

export interface IModalProps {
	title: string
	open: boolean
	children: React.ReactElement
	onClose: (cb?: string | null) => void
}

const Modal = ({ title, open, onClose, children }: IModalProps) => {
	return !open ? null : (
		<div className={join('fullpage fixed', style.wrapper)} onClick={() => onClose(null)}>
			<div className={style.modal}>
				<div className={style.modal__title}>
					{title}
					<CloseIcon className="pointer" onClick={() => onClose(null)} />
				</div>
				<div className={style.modal__body}>{children}</div>
			</div>
		</div>
	)
}

export default Modal
