import { FILES__DATABASE_KEY, FILES__DATABASE_VERSION } from '@/constants';
import type { File } from '@/types/Database';
import type { Table } from 'dexie';
import Dexie from 'dexie';

class FilesDB extends Dexie {
	files!: Table<File, string>;

	constructor() {
		super(FILES__DATABASE_KEY);

		this.version(FILES__DATABASE_VERSION).stores({
			files: 'id, name, type, isFile',
		});
	}
}

export default new FilesDB();
