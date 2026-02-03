import { db, Inspection } from './db';

/**
 * Sync Engine - Offline-First Strategy
 * 
 * Monitors network status and syncs pending inspections to the backend.
 * This is the bridge between Dexie.js (local) and NestJS API (remote).
 */

// Use environment variable for API URL (Railway compatible)
const API_URL = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:3000';

/**
 * Sync a single inspection to the backend
 */
async function syncInspection(inspection: Inspection): Promise<boolean> {
    try {
        // Prepare payload - exclude 'status' to let backend decide (always 'synced' in DB)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, ...inspectionWithoutStatus } = inspection;

        const payload = {
            ...inspectionWithoutStatus,
            // Ensure createdAt is preserved from original
            createdAt: inspection.createdAt,
            // syncedAt is set by backend when saving
        };

        const response = await fetch(`${API_URL}/inspections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to sync inspection:', inspection.id, errorText);
            return false;
        }

        // Mark as synced in local database
        await db.inspections.update(inspection.id, {
            status: 'synced',
            syncedAt: new Date().toISOString(),
        });

        console.log('✅ Synced inspection:', inspection.id);
        return true;
    } catch (error) {
        console.error('Sync error:', error);
        return false;
    }
}

/**
 * Sync all pending inspections
 */
export async function syncPendingInspections(): Promise<number> {
    const pending = await db.inspections
        .where('status')
        .equals('pending')
        .toArray();

    if (pending.length === 0) {
        console.log('No pending inspections to sync');
        return 0;
    }

    console.log(`Syncing ${pending.length} pending inspections...`);

    let syncedCount = 0;
    for (const inspection of pending) {
        const success = await syncInspection(inspection);
        if (success) syncedCount++;
    }

    return syncedCount;
}

/**
 * Start automatic sync on network reconnection
 */
export function startSyncEngine() {
    // Sync when online
    window.addEventListener('online', () => {
        console.log('🌐 Network detected, syncing...');
        syncPendingInspections();
    });

    // Initial sync if already online
    if (navigator.onLine) {
        syncPendingInspections();
    }

    // Periodic sync every 30 seconds if online
    setInterval(() => {
        if (navigator.onLine) {
            syncPendingInspections();
        }
    }, 30000);
}
