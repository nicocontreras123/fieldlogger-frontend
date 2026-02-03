import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import CreateInspection from './components/CreateInspection';
import InspectionList from './components/InspectionList';
import RealtimeInspections from './components/RealtimeInspections';
import NetworkStatusBadge from './components/NetworkStatusBadge';
import HelpModal from './components/HelpModal';
import ReloadPrompt from './components/ReloadPrompt';
import { startSyncEngine } from './lib/sync-engine';

import './index.css';

/**
 * Local View Component
 * Shows the offline-first inspection creation and local list
 */
function LocalView() {
    return (
        <>
            <CreateInspection />
            <div className="mt-8">
                <InspectionList />
            </div>
        </>
    );
}

/**
 * Main App Component with Routing
 * 
 * Initializes the sync engine and renders the PWA interface.
 * Uses React Router for navigation between views.
 */
function App() {
    useEffect(() => {
        // Start the sync engine on mount
        startSyncEngine();
        console.log('🚀 FieldLogger 2026 initialized');
    }, []);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-cyber-dark">
                {/* Network Status Badge */}
                <NetworkStatusBadge />

                {/* Help Modal */}
                <HelpModal />

                {/* PWA Update Prompt */}
                <ReloadPrompt />


                <header className="bg-slate-900 border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        {/* Mobile: Stack vertically, Desktop: Side by side */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Logo and Title */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    FieldLogger <span className="text-blue-500">2026</span>
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">Registro de Inspecciones Offline-First</p>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="flex bg-slate-800 rounded-lg p-1 self-start lg:self-auto">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="mr-1">📱</span>
                                    <span className="hidden sm:inline">Local</span>
                                    <span className="sm:hidden">Local</span>
                                </NavLink>
                                <NavLink
                                    to="/live"
                                    className={({ isActive }) =>
                                        `px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${isActive
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="hidden sm:inline">En Vivo</span>
                                    <span className="sm:hidden">Vivo</span>
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="py-8 px-4 sm:px-6">
                    <Routes>
                        <Route path="/" element={<LocalView />} />
                        <Route path="/live" element={<RealtimeInspections />} />
                    </Routes>
                </main>

                <footer className="text-center py-6 text-gray-500 text-sm px-4">
                    <p>
                        Construido con NestJS 11 (Hexagonal) + React 19 + Vite 6 + Dexie.js + SSE
                    </p>
                    <p className="mt-1 text-xs">
                        <NavLink to="/live" className={({ isActive }) => isActive ? 'text-green-400' : 'text-gray-500'}>
                            {({ isActive }) => isActive
                                ? '🔴 Conectado en tiempo real vía Server-Sent Events'
                                : '💾 Modo offline-first con sincronización periódica'}
                        </NavLink>
                    </p>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
