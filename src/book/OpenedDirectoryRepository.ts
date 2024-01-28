import { openDB } from 'idb';
import { QueryResult } from '../entity/QueryResult';

const databaseName = 'wilde-db';
const objectStoreName = 'last-opened-directory';

const init = async () => {
    return await openDB(databaseName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { keyPath: 'name' });
            }
        }
    });
}

const byId = async (name: string): Promise<OpenedDirectory | undefined> => {
    const db = await init();
    return await db.get(objectStoreName, name);
}

export const OpenedDirectoryRepository = {
    upsert: async (openedDirectory: OpenedDirectory): Promise<QueryResult<IDBValidKey>> => {
        try {
            if (!openedDirectory.name || !openedDirectory.name.length || !openedDirectory.handle) {
                return { error: "Invalid request" };
            }

            const db = await init();
            const exists = Boolean(await byId(openedDirectory.name));
            const tx = db.transaction(objectStoreName, 'readwrite');
            const obj: OpenedDirectory = {
                ...openedDirectory,
                inserted: openedDirectory.inserted ?? new Date().getTime()
            };

            if (exists) {
                return {
                    payload: await tx.store.put(obj)
                };
            }

            return { payload: await tx.store.add(obj) };
        }
        catch (e) {
            console.log(e);
            return { error: "error while upserting item" }
        }
    },
    search: async (searchRequest: { count?: number }): Promise<QueryResult<OpenedDirectory[]>> => {
        try {
            const db = await init();

            return {
                payload: await db.getAll(objectStoreName, null, searchRequest.count)
            };
        }
        catch (e) {
            console.log(e);
            return { error: "error while retrieving items" }
        }
    }
}

export interface OpenedDirectory {
    name: string;
    handle: FileSystemDirectoryHandle;
    inserted?: number;
}