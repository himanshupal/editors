import { join } from '@/utils'
import style from './styles.module.scss'
import { useActivityBarStore } from '@/store'

interface ActivityBarItemProps {
	action(): void
	title: string
	icon: string
	id: string
}

const ActivityBar = () => {
	const { activeTab, setActiveTab } = useActivityBarStore()

	const activityBarItems: ActivityBarItemProps[] = [
		{
			id: 'explorer',
			title: 'Explorer',
			icon: 'https://img.icons8.com/material-outlined/24/ffffff/file.png',
			action() {
				setActiveTab(activeTab === 'explorer' ? null : 'explorer')
			},
		},
		{
			id: 'utils',
			title: 'Utilities',
			icon: 'https://img.icons8.com/material-outlined/24/ffffff/settings.png',
			action() {
				setActiveTab(activeTab === 'utils' ? null : 'utils')
			},
		},
	]

	const ActivityBarItem = ({ id, title, icon, action }: ActivityBarItemProps) => {
		return (
			<div className={join('pointer', style.activityBarItem, id === activeTab && style.activityBarItemActive)} title={title} onClick={action}>
				<img src={icon} />
			</div>
		)
	}

	return (
		<div className={style.activityBar}>
			{activityBarItems.map((item) => (
				<ActivityBarItem key={item.id} {...item} />
			))}
		</div>
	)
}

export default ActivityBar
