import { useEffect } from 'react';
import CreateInspection from './components/CreateInspection';
import InspectionList from './components/InspectionList';
import NetworkStatusBadge from './components/NetworkStatusBadge';
import HelpModal from './components/HelpModal';
import { startSyncEngine } from './lib/sync-engine';
import './index.css';

/**
 * Main App Component
 * 
 * Initializes the sync engine and renders the PWA interface.
 */
function App() {
    useEffect(() => {
        // Start the sync engine on mount
        startSyncEngine();
        console.log('🚀 FieldLogger 2026 initialized');
    }, []);

    return (
        <div className="min-h-screen bg-cyber-dark">
            {/* Network Status Badge */}
            <NetworkStatusBadge />

            {/* Help Modal */}
            <HelpModal />

            <header className="bg-slate-900 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <h1 className="text-3xl font-bold text-white">
                        FieldLogger <span className="text-blue-500">2026</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Registro de Inspecciones Offline-First</p>
                </div>
            </header>

            <main className="py-8">
                <CreateInspection />
                <div className="mt-8">
                    <InspectionList />
                </div>
            </main>

            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>
                    Construido con NestJS 11 (Hexagonal) + React 19 + Vite 6 + Dexie.js
                </p>
            </footer>
        </div>
    );
}

export default App;


