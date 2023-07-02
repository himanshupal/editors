import type { ISidebarStore } from '@/types/Zustand';
import { create } from 'zustand';

const useSidebarStore = create<ISidebarStore>((set) => ({
	setSelectedItem: (selectedItem) => set({ selectedItem }),
	setNewFile: (newFile) => set({ newFile }),
}));

export default useSidebarStore;
