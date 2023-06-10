import { join } from '@/utils'

import style from './styles.module.scss'

interface WrapperProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
	children(props: React.SVGProps<SVGSVGElement>): React.ReactNode
	wrapperClassName?: string
	onClick?(): void
}

export type IconWrapperProps = Omit<WrapperProps, 'children'>

const IconWrapper = ({ children, onClick, width, height, wrapperClassName, ...props }: WrapperProps) => (
	<span onClick={onClick} className={join(style.iconWrapper, wrapperClassName)} style={{ width, height }}>
		{children({ width, height, ...props })}
	</span>
)

export default IconWrapper
