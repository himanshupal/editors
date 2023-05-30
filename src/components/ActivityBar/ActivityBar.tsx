import SettingsIcon from '@/assets/icons/Settings'
import { useActivityBarStore } from '@/store'
import FilesIcon from '@/assets/icons/Files'
import style from './styles.module.scss'
import { join } from '@/utils'
import React from 'react'

interface ActivityBarItemProps {
	action(): void
	title: string
	icon: React.ReactElement
	id: string
}

const ActivityBar = () => {
	const { activeTab, setActiveTab } = useActivityBarStore()

	const activityBarItems: ActivityBarItemProps[] = [
		{
			id: 'explorer',
			title: 'Explorer',
			icon: <FilesIcon color="white" />,
			action() {
				setActiveTab(activeTab === 'explorer' ? null : 'explorer')
			},
		},
		{
			id: 'utils',
			title: 'Utilities',
			icon: <SettingsIcon color="white" />,
			action() {
				setActiveTab(activeTab === 'utils' ? null : 'utils')
			},
		},
	]

	const ActivityBarItem = ({ id, title, icon, action }: ActivityBarItemProps) => {
		return (
			<div className={join('pointer', style.activityBarItem, id === activeTab && style.activityBarItemActive)} title={title} onClick={action}>
				{icon}
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