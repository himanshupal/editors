import type { FileOrFolder } from '@/types/Database';

export type ActiveTabs = 'explorer' | 'utils';

export interface ISidebarStore {
	selectedItem?: FileOrFolder;
	setSelectedItem(selectedItem?: FileOrFolder): void;

	/** true represents a file, false represents a folder */
	newFile?: boolean;
	setNewFile(newFile?: boolean): void;
}
