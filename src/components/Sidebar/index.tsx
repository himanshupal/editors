import type { ActiveTabs } from '@/types/Zustand'
import { useActivityBarStore } from '@/store'
import React, { useMemo } from 'react'

import style from './styles.module.scss'
import Explorer from './Explorer'
import Utils from './Utils'

const sideBarComponents: Record<ActiveTabs, React.FC> = {
	explorer: Explorer,
	utils: Utils,
}

const Sidebar = () => {
	const { activeTab } = useActivityBarStore()

	const SidebarComponent = useMemo(() => {
		if (!activeTab) return null
		return sideBarComponents[activeTab]
	}, [activeTab])

	return (
		<div className={style.sidebarWrapper}>
			<div className={style.sidebar}>{SidebarComponent && <SidebarComponent />}</div>
		</div>
	)
}

export default Sidebar
