import type { ActiveTabs } from '@/types/Zustand';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';


interface ActivityBarStore {
	activeTab?: ActiveTabs;
	setActiveTab(activeTab?: ActiveTabs): void;
}

const useActivityBarStore = create<ActivityBarStore>()(
	persist(
		(set) => ({
			setActiveTab: (activeTab?: ActiveTabs) => set({ activeTab }),
		}),
		{
			name: 'activityBarStore',
		}
	)
);

export default useActivityBarStore;
