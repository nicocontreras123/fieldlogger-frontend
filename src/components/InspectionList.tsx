import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

/**
 * InspectionList Component
 * 
 * Displays all inspections from Dexie with real-time updates.
 * Uses dexie-react-hooks for reactive queries.
 */
export default function InspectionList() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Real-time query from Dexie
    const inspections = useLiveQuery(() =>
        db.inspections.orderBy('createdAt').reverse().toArray()
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!inspections) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        );
    }

    if (inspections.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No inspections yet</p>
                <p className="text-sm mt-2">Create your first inspection above</p>
            </div>
        );
    }

    const pendingCount = inspections.filter((i) => i.status === 'pending').length;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Inspections</h2>
                {pendingCount > 0 && (
                    <span className="px-3 py-1 bg-yellow-900/50 text-yellow-200 rounded-full text-sm">
                        {pendingCount} pending sync
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {inspections.map((inspection) => (
                    <div
                        key={inspection.id}
                        className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{inspection.location}</h3>
                                <p className="text-sm text-gray-400">by {inspection.technician}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${inspection.status === 'synced'
                                        ? 'bg-green-900/50 text-green-200'
                                        : 'bg-yellow-900/50 text-yellow-200'
                                    }`}
                            >
                                {inspection.status}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-3">{inspection.findings}</p>
                        <div className="text-xs text-gray-500">
                            Created: {new Date(inspection.createdAt).toLocaleString()}
                            {inspection.syncedAt && (
                                <> • Synced: {new Date(inspection.syncedAt).toLocaleString()}</>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
