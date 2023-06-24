import type { ISidebarStore } from '@/types/Zustand';
import { create } from 'zustand';

const useSidebarStore = create<ISidebarStore>((set) => ({
	setSelectedItem: (selectedItem) => set({ selectedItem }),
}));

export default useSidebarStore;
