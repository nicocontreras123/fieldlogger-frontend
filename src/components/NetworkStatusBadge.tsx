import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Wifi, WifiOff, RotateCw, CloudUpload, CheckCircle2 } from 'lucide-react';

/**
 * NetworkStatusBadge Component
 * 
 * Displays real-time network status and pending sync count.
 * Shows different states: Online, Offline, Syncing
 * Enhanced with eye-catching animations and positioning.
 * Optimized for Mobile with compact FAB design.
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
                color: 'from-blue-500 to-indigo-600',
                shadowColor: 'shadow-blue-500/50',
                icon: <RotateCw className="w-5 h-5 animate-spin" />,
                pulse: true,
                glow: true,
            };
        }

        if (!isOnline) {
            return {
                label: 'Sin Conexión',
                shortLabel: 'Offline',
                color: 'from-slate-600 to-slate-800', // Darker gray/black for offline/airplane
                shadowColor: 'shadow-slate-500/50',
                icon: <WifiOff className="w-5 h-5" />,
                pulse: false,
                glow: false,
            };
        }

        if (pendingCount !== undefined && pendingCount > 0) {
            return {
                label: `${pendingCount} Pendiente${pendingCount > 1 ? 's' : ''}`,
                shortLabel: `${pendingCount}`,
                color: 'from-orange-500 to-amber-500',
                shadowColor: 'shadow-orange-500/50',
                icon: <CloudUpload className="w-5 h-5 animate-bounce" />,
                pulse: true,
                glow: true,
            };
        }

        return {
            label: 'En Línea',
            shortLabel: 'Online',
            color: 'from-emerald-500 to-green-600',
            shadowColor: 'shadow-green-500/50',
            icon: <Wifi className="w-5 h-5" />,
            pulse: false,
            glow: false,
        };
    };

    const state = getBadgeState();

    return (
        <div
            className="fixed top-4 right-4 z-50 flex flex-col items-end"
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
            onClick={() => setShowDetails(!showDetails)}
        >
            {/* Main Badge - Compact Button */}
            <div
                className={`
                    bg-gradient-to-br ${state.color} 
                    text-white 
                    p-3 sm:px-4 sm:py-2 
                    rounded-full 
                    ${state.shadowColor} shadow-lg 
                    flex items-center justify-center gap-2 
                    transition-all duration-300 
                    cursor-pointer
                    border border-white/20
                    backdrop-blur-md
                    ${state.glow ? 'ring-2 ring-white/30' : ''}
                    hover:scale-110 active:scale-95
                    min-w-[44px] min-h-[44px] sm:min-w-fit sm:min-h-fit
                `}
            >
                {/* Icon */}
                <span className="filter drop-shadow-sm flex items-center justify-center">
                    {state.icon}
                </span>

                {/* Label - Hidden on mobile unless syncing/pending */}
                <span className={`
                    font-bold text-sm hidden sm:inline
                    ${(isSyncing || (pendingCount || 0) > 0) ? 'inline-block' : ''}
                `}>
                    {state.label}
                </span>

                {/* Counter for mobile - Mini badge */}
                {pendingCount !== undefined && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-slate-900 sm:border-none ring-1 ring-white/20">
                        {pendingCount}
                    </span>
                )}
            </div>

            {/* Connection details tooltip */}
            <div
                className={`
                    mt-3 mr-1
                    bg-slate-900/90 backdrop-blur-xl 
                    text-white text-sm 
                    px-4 py-4 rounded-2xl
                    shadow-2xl border border-slate-700/50
                    transition-all duration-300 origin-top-right
                    ${showDetails ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                    w-64 z-50
                `}
            >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className={`p-2 rounded-full bg-white/5 ${!isOnline ? 'text-slate-400' : 'text-emerald-400'}`}>
                        {state.icon}
                    </div>
                    <div>
                        <p className="font-bold text-white text-base">{isOnline ? 'Conectado' : 'Desconectado'}</p>
                        <p className="text-xs text-gray-400">{isOnline ? 'Conexión estable' : 'Revisando red...'}</p>
                    </div>
                </div>

                {pendingCount !== undefined && pendingCount > 0 && (
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs text-orange-300 font-medium tracking-wide uppercase">
                            <span>Sincronización</span>
                            <span>{pendingCount} {pendingCount === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/10">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-2/3 animate-pulse"></div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Se guardaron tus datos localmente. Se subirán automáticamente al recuperar la conexión.
                        </p>
                    </div>
                )}

                {isOnline && (!pendingCount || pendingCount === 0) && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Todo sincronizado</span>
                    </div>
                )}
            </div>
        </div>
    );
}
