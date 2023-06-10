import { FILES__DATABASE_KEY, FILES__DATABASE_VERSION } from '@/constants';
import type { FileOrFolder } from '@/types/Database';
import type { Table } from 'dexie';
import Dexie from 'dexie';

class FilesDB extends Dexie {
	files!: Table<FileOrFolder, string>;

	constructor() {
		super(FILES__DATABASE_KEY);

		this.version(FILES__DATABASE_VERSION).stores({
			files: 'id, name, type, isFile',
		});
	}
}

export default new FilesDB();
