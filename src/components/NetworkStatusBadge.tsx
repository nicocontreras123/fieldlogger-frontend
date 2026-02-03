import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

/**
 * NetworkStatusBadge Component
 * 
 * Displays real-time network status and pending sync count.
 * Shows different states: Online, Offline, Syncing
 */
export default function NetworkStatusBadge() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    // Real-time count of pending inspections
    const pendingCount = useLiveQuery(async () => {
        const pending = await db.inspections
            .where('status')
            .equals('pending')
            .count();
        return pending;
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setIsSyncing(true);
            // Reset syncing state after a delay
            setTimeout(() => setIsSyncing(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setIsSyncing(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Determine badge state
    const getBadgeState = () => {
        if (isSyncing) {
            return {
                label: 'Sincronizando...',
                color: 'bg-yellow-500',
                icon: '🔄',
                pulse: true,
            };
        }

        if (!isOnline) {
            return {
                label: 'Sin Conexión',
                color: 'bg-red-500',
                icon: '📡',
                pulse: false,
            };
        }

        if (pendingCount && pendingCount > 0) {
            return {
                label: `${pendingCount} Pendiente${pendingCount > 1 ? 's' : ''}`,
                color: 'bg-orange-500',
                icon: '⏳',
                pulse: true,
            };
        }

        return {
            label: 'En Línea',
            color: 'bg-green-500',
            icon: '✓',
            pulse: false,
        };
    };

    const state = getBadgeState();

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`${state.color} text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300`}
            >
                <span className={`text-lg ${state.pulse ? 'animate-pulse' : ''}`}>
                    {state.icon}
                </span>
                <span className="font-semibold text-sm">{state.label}</span>
                {pendingCount !== undefined && pendingCount > 0 && (
                    <span className="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {pendingCount}
                    </span>
                )}
            </div>

            {/* Connection details tooltip */}
            <div className="mt-2 bg-slate-800 text-white text-xs px-3 py-2 rounded shadow-lg">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span>{isOnline ? 'Conectado' : 'Desconectado'}</span>
                </div>
                {pendingCount !== undefined && pendingCount > 0 && (
                    <div className="mt-1 text-orange-300">
                        {pendingCount} inspección{pendingCount > 1 ? 'es' : ''} esperando sincronizar
                    </div>
                )}
            </div>
        </div>
    );
}
