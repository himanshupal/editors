import { persist } from 'zustand/middleware';
import { create } from 'zustand';

interface ActivityBarStore {
	activeTab?: string;
	setActiveTab(activeTab?: string): void;
}

const useActivityBarStore = create<ActivityBarStore>()(
	persist(
		(set) => ({
			setActiveTab: (activeTab?: string) => set({ activeTab }),
		}),
		{
			name: 'activityBarStore',
		}
	)
);

export default useActivityBarStore;
