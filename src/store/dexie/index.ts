import { INDEXED__DATABASE_KEY, INDEXED__DATABASE_VERSION } from '@/constants';
import type { FileOrFolder } from '@/types/Database';
import type { Table } from 'dexie';
import Dexie from 'dexie';

const storage = new (class IndexedDB extends Dexie {
	files!: Table<FileOrFolder, string>;

	constructor() {
		super(INDEXED__DATABASE_KEY);

		this.version(INDEXED__DATABASE_VERSION).stores({
			files: 'id, type',
		});
	}
})();

export default storage;
