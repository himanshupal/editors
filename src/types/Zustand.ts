import type { FileOrFolder } from '@/types/Database';

export type ActiveTabs = 'explorer' | 'utils';

export interface ISidebarStore {
	selectedItem?: FileOrFolder;
	setSelectedItem(selectedItem?: FileOrFolder): void;
}
