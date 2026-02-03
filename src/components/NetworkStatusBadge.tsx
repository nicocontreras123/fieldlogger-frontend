import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

/**
 * NetworkStatusBadge Component
 * 
 * Displays real-time network status and pending sync count.
 * Shows different states: Online, Offline, Syncing
 * Enhanced with eye-catching animations and positioning.
 */
export default function NetworkStatusBadge() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

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
                label: 'Sincronizando',
                shortLabel: 'Sync',
                color: 'from-yellow-500 to-orange-500',
                shadowColor: 'shadow-yellow-500/50',
                icon: '🔄',
                pulse: true,
                glow: true,
            };
        }

        if (!isOnline) {
            return {
                label: 'Sin Conexión',
                shortLabel: 'Offline',
                color: 'from-red-500 to-red-700',
                shadowColor: 'shadow-red-500/50',
                icon: '📡',
                pulse: false,
                glow: true,
            };
        }

        if (pendingCount && pendingCount > 0) {
            return {
                label: `${pendingCount} Pendiente${pendingCount > 1 ? 's' : ''}`,
                shortLabel: `${pendingCount} Pend.`,
                color: 'from-orange-500 to-red-500',
                shadowColor: 'shadow-orange-500/50',
                icon: '⏳',
                pulse: true,
                glow: true,
            };
        }

        return {
            label: 'En Línea',
            shortLabel: 'Online',
            color: 'from-green-500 to-emerald-600',
            shadowColor: 'shadow-green-500/50',
            icon: '✓',
            pulse: false,
            glow: false,
        };
    };

    const state = getBadgeState();

    return (
        <div
            className="fixed top-16 right-2 sm:top-4 sm:right-4 z-50 flex flex-col items-end"
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
        >
            {/* Main Badge */}
            <div
                className={`
                    bg-gradient-to-r ${state.color} 
                    text-white 
                    px-3 sm:px-4 py-2 sm:py-3 
                    rounded-full 
                    ${state.shadowColor} shadow-lg 
                    flex items-center gap-2 
                    transition-all duration-300 
                    cursor-pointer
                    border-2 border-white/20
                    backdrop-blur-sm
                    ${state.glow ? 'animate-pulse' : ''}
                    hover:scale-105 hover:shadow-xl
                    min-w-fit
                `}
            >
                {/* Icon with animation */}
                <span className={`text-lg sm:text-xl ${state.pulse ? 'animate-spin' : ''}`}>
                    {state.icon}
                </span>

                {/* Label - hidden on very small screens */}
                <span className="font-bold text-sm sm:text-base hidden xs:inline">
                    <span className="hidden sm:inline">{state.label}</span>
                    <span className="sm:hidden">{state.shortLabel}</span>
                </span>

                {/* Pending count badge */}
                {pendingCount !== undefined && pendingCount > 0 && (
                    <span className="bg-white text-orange-600 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold animate-bounce">
                        {pendingCount}
                    </span>
                )}

                {/* Live indicator dot */}
                <span className={`w-2 h-2 rounded-full bg-white ${isOnline ? 'animate-pulse' : ''}`} />
            </div>

            {/* Connection details tooltip - shows on hover */}
            <div
                className={`
                    mt-2 bg-slate-800/95 backdrop-blur-sm 
                    text-white text-xs sm:text-sm 
                    px-4 py-3 rounded-xl 
                    shadow-2xl border border-slate-600
                    transition-all duration-300
                    ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                    max-w-[200px] sm:max-w-[250px]
                `}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'} shadow-lg`} />
                    <span className="font-semibold">{isOnline ? 'Conectado a internet' : 'Modo offline'}</span>
                </div>

                {pendingCount !== undefined && pendingCount > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                        <p className="text-orange-300 font-medium">
                            {pendingCount} inspección{pendingCount > 1 ? 'es' : ''} por sincronizar
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Se sincronizarán automáticamente al reconectar
                        </p>
                    </div>
                )}

                {isOnline && (!pendingCount || pendingCount === 0) && (
                    <p className="text-green-300 text-xs mt-1">
                        ✅ Todas las inspecciones están sincronizadas
                    </p>
                )}
            </div>
        </div>
    );
}
