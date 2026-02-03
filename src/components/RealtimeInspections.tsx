import { useEffect, useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

// Use environment variable for API URL (Railway compatible)
const API_URL = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:3000';

/**
 * Inspection interface for real-time view
 */
interface Inspection {
    id: string;
    location: string;
    technician: string;
    findings: string;
    status: 'pending' | 'synced';
    createdAt: string;
    syncedAt?: string;
}

/**
 * SSE message data structure
 */
interface SSEMessage {
    type: 'initial' | 'update';
    count: number;
    inspections: Inspection[];
    timestamp: string;
}

/**
 * RealtimeInspections Component
 * 
 * Displays inspections in real-time using Server-Sent Events (SSE).
 * Updates automatically when new inspections are created from any client.
 * Also shows local pending inspections immediately for true real-time experience.
 */
export default function RealtimeInspections() {
    const [remoteInspections, setRemoteInspections] = useState<Inspection[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [newInspectionIds, setNewInspectionIds] = useState<Set<string>>(new Set());
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const prevInspectionsRef = useRef<Inspection[]>([]);

    // Get local pending inspections from Dexie for immediate display
    const localInspections = useLiveQuery(() =>
        db.inspections.where('status').equals('pending').toArray()
    );

    // Merge remote and local inspections, giving priority to local ones
    const inspections: Inspection[] = (() => {
        const local = localInspections || [];
        const remote = remoteInspections || [];

        // Create a map of remote inspections by ID
        const remoteMap = new Map(remote.map(i => [i.id, i]));

        // Add local inspections (they take precedence or are additional)
        local.forEach(localInspection => {
            remoteMap.set(localInspection.id, localInspection);
        });

        // Convert back to array and sort by createdAt descending
        return Array.from(remoteMap.values()).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    })();

    // Track new inspections for animation
    useEffect(() => {
        const prevIds = new Set(prevInspectionsRef.current.map(i => i.id));
        const currentIds = new Set(inspections.map(i => i.id));

        // Find truly new inspections (not in previous list)
        const addedIds = inspections
            .filter(i => !prevIds.has(i.id))
            .map(i => i.id);

        if (addedIds.length > 0) {
            setNewInspectionIds(prev => {
                const newSet = new Set(prev);
                addedIds.forEach(id => newSet.add(id));
                return newSet;
            });

            // Remove highlight after animation completes
            setTimeout(() => {
                setNewInspectionIds(prev => {
                    const newSet = new Set(prev);
                    addedIds.forEach(id => newSet.delete(id));
                    return newSet;
                });
            }, 2000);
        }

        prevInspectionsRef.current = inspections;

        // Mark initial loading as complete once we have data
        if (inspections.length > 0 || connectionStatus === 'connected') {
            setIsInitialLoading(false);
        }
    }, [inspections, connectionStatus]);

    useEffect(() => {
        const connectSSE = () => {
            setConnectionStatus('connecting');

            try {
                const eventSource = new EventSource(`${API_URL}/inspections/events/stream`);
                eventSourceRef.current = eventSource;

                eventSource.onopen = () => {
                    console.log('🔌 SSE connected');
                    setIsConnected(true);
                    setConnectionStatus('connected');
                };

                eventSource.onmessage = (event) => {
                    // Handle heartbeat
                    if (event.data === ':heartbeat') {
                        return;
                    }

                    try {
                        const data: SSEMessage = JSON.parse(event.data);
                        console.log('📨 SSE message received:', data.type);

                        setRemoteInspections(data.inspections);
                        setLastUpdate(new Date());
                    } catch (error) {
                        console.error('Error parsing SSE message:', error);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error('SSE error:', error);
                    setIsConnected(false);
                    setConnectionStatus('disconnected');
                    eventSource.close();

                    // Reconnect after 3 seconds
                    reconnectTimeoutRef.current = window.setTimeout(() => {
                        console.log('🔄 Attempting to reconnect...');
                        connectSSE();
                    }, 3000);
                };
            } catch (error) {
                console.error('Error creating EventSource:', error);
                setConnectionStatus('disconnected');
            }
        };

        // Initial connection
        connectSSE();

        // Cleanup on unmount
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-500';
            case 'connecting':
                return 'bg-yellow-500 animate-pulse';
            case 'disconnected':
                return 'bg-red-500';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'En vivo';
            case 'connecting':
                return 'Conectando...';
            case 'disconnected':
                return 'Desconectado';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header with connection status */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Inspecciones en Tiempo Real
                        <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor()}`}></span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {getStatusText()} • {inspections.length} inspecciones
                    </p>
                </div>
                <div className="text-right">
                    {lastUpdate && (
                        <p className="text-xs text-gray-500">
                            Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
                        </p>
                    )}
                </div>
            </div>

            {/* Connection warning */}
            {connectionStatus === 'disconnected' && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                    <p className="text-red-200 text-sm">
                        ⚠️ Desconectado del servidor. Intentando reconectar...
                    </p>
                </div>
            )}

            {/* Skeleton Loading */}
            {isInitialLoading && inspections.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 animate-pulse">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                                </div>
                                <div className="h-6 bg-slate-700 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-slate-700 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-slate-700 rounded w-4/6"></div>
                            <div className="mt-4 flex justify-between">
                                <div className="h-3 bg-slate-700 rounded w-24"></div>
                                <div className="h-3 bg-slate-700 rounded w-12"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : inspections.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-400 text-lg">No hay inspecciones aún</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Las inspecciones aparecerán aquí automáticamente cuando se creen
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {inspections.map((inspection) => {
                        const isNew = newInspectionIds.has(inspection.id);
                        return (
                            <div
                                key={inspection.id}
                                className={`
                                    bg-slate-800 rounded-lg p-5 border transition-all duration-500
                                    ${isNew
                                        ? 'border-green-500 shadow-lg shadow-green-500/20 scale-[1.02] animate-slideIn'
                                        : 'border-slate-700 hover:border-slate-600'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {inspection.location}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            por {inspection.technician}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${inspection.status === 'synced'
                                            ? 'bg-green-900/50 text-green-200'
                                            : 'bg-yellow-900/50 text-yellow-200'
                                            }`}
                                    >
                                        {inspection.status === 'synced' ? 'Sincronizado' : 'Pendiente'}
                                    </span>
                                </div>

                                <p className="text-gray-300 mb-3 line-clamp-3">
                                    {inspection.findings}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        Creado: {new Date(inspection.createdAt).toLocaleString('es-ES')}
                                    </span>
                                    {inspection.syncedAt && (
                                        <span className="text-green-400">
                                            ✓ Sync
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Stats footer */}
            {inspections.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-white">{inspections.length}</p>
                            <p className="text-xs text-gray-400">Total</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-400">
                                {inspections.filter((i) => i.status === 'synced').length}
                            </p>
                            <p className="text-xs text-gray-400">Sincronizadas</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-400">
                                {inspections.filter((i) => i.status === 'pending').length}
                            </p>
                            <p className="text-xs text-gray-400">Pendientes</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
