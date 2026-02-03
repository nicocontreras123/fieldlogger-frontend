import Dexie, { Table } from 'dexie';

/**
 * Inspection Interface
 * Matches the backend domain entity structure
 */
export interface Inspection {
    id: string;
    location: string;
    technician: string;
    findings: string;
    status: 'pending' | 'synced';
    createdAt: string;
    syncedAt?: string;
}

/**
 * Dexie Database for Offline Storage
 * 
 * IndexedDB wrapper providing a clean API for offline-first storage.
 * React 19 components will read/write to this database optimistically.
 */
class FieldLoggerDB extends Dexie {
    inspections!: Table<Inspection, string>;

    constructor() {
        super('FieldLoggerDB');

        // Schema version 1
        this.version(1).stores({
            inspections: 'id, status, createdAt',
        });
    }
}

// Export singleton instance
export const db = new FieldLoggerDB();
