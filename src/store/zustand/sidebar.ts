import type { FileOrFolder } from '@/types/Database';
import { create } from 'zustand';

interface SidebarStore {
	selectedItem?: FileOrFolder;
	setSelectedItem(id?: FileOrFolder): void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
	setSelectedItem: (selectedItem) => set({ selectedItem }),
}));

export default useSidebarStore;
