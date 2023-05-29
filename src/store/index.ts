import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

interface ActivityBarStore {
	activeTab: string | null;
	setActiveTab(tab: string | null): void;
}

export const useActivityBarStore = create<ActivityBarStore>()(
	devtools(
		persist(
			(set) => ({
				activeTab: null,
				setActiveTab(tab: string | null) {
					set({ activeTab: tab });
				},
			}),
			{
				name: 'activityBarStore',
			}
		)
	)
);
