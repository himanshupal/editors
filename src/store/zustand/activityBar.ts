import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

interface ActivityBarStore {
	activeTab?: string;
	setActiveTab(tab?: string): void;
}

const useActivityBarStore = create<ActivityBarStore>()(
	devtools(
		persist(
			(set) => ({
				setActiveTab: (tab?: string) => set({ activeTab: tab }),
			}),
			{
				name: 'activityBarStore',
			}
		)
	)
);

export default useActivityBarStore;
