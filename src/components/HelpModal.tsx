import { useState } from 'react';

/**
 * HelpModal Component
 * 
 * Displays information about how the offline-first prototype works
 */
export default function HelpModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 group"
                aria-label="Ayuda"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    ?
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-slate-700/50">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                ¿Cómo funciona este prototipo?
                            </h2>
                            <p className="text-slate-400 mt-2">
                                Arquitectura Offline-First con React 19 y NestJS 11
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Feature 1 */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">📱</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Offline-First</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            La aplicación funciona <strong>completamente sin conexión</strong>. Los datos se guardan
                                            localmente en IndexedDB usando <strong>Dexie.js</strong> y se sincronizan automáticamente
                                            cuando recuperas la conexión.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">🔄</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Sincronización Automática</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            El <strong>sync engine</strong> detecta cuando vuelves a estar en línea y sincroniza
                                            automáticamente todas las inspecciones pendientes con el backend. Puedes ver el estado
                                            en tiempo real en el badge superior derecho.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">⚡</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">React 19 + NestJS 11</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            Frontend con <strong>React 19</strong> usando <code className="bg-slate-700 px-2 py-0.5 rounded">useActionState</code>
                                            para manejo de formularios sin librerías externas. Backend con <strong>NestJS 11</strong>
                                            implementando <strong>Arquitectura Hexagonal</strong> (Ports & Adapters).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">🗄️</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">PostgreSQL + Drizzle ORM</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            Base de datos <strong>PostgreSQL</strong> con <strong>Drizzle ORM</strong> para
                                            type-safety completo. El backend es completamente intercambiable gracias a la
                                            arquitectura hexagonal.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* How to Test */}
                            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-5 border-2 border-blue-500/30">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <span>🧪</span>
                                    Cómo Probar el Modo Offline
                                </h3>
                                <ol className="space-y-2 text-slate-300 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-400">1.</span>
                                        <span>Abre las DevTools del navegador (F12)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-400">2.</span>
                                        <span>Ve a la pestaña <strong>Network</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-400">3.</span>
                                        <span>Marca la casilla <strong>"Offline"</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-400">4.</span>
                                        <span>Crea una inspección - verás que se guarda localmente</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-400">5.</span>
                                        <span>Desmarca "Offline" - la inspección se sincronizará automáticamente</span>
                                    </li>
                                </ol>
                            </div>

                            {/* Mobile Testing */}
                            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-5 border-2 border-purple-500/30">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <span>📱</span>
                                    Probar en Celular Real
                                </h3>
                                <div className="space-y-3 text-slate-300 text-sm">
                                    <p className="font-semibold text-purple-300">Opción 1: Usando tu red local</p>
                                    <ol className="space-y-2 ml-4">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">1.</span>
                                            <span>Ejecuta <code className="bg-slate-700 px-2 py-0.5 rounded">npm run dev -- --host</code> en el frontend</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">2.</span>
                                            <span>Obtén tu IP local (ej: 192.168.1.100)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">3.</span>
                                            <span>Desde tu celular (en la misma WiFi), abre: <code className="bg-slate-700 px-2 py-0.5 rounded">http://TU-IP:5173</code></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">4.</span>
                                            <span>Activa el <strong>Modo Avión</strong> en tu celular</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">5.</span>
                                            <span>Crea inspecciones - se guardarán localmente</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">6.</span>
                                            <span>Desactiva el Modo Avión - verás la sincronización automática</span>
                                        </li>
                                    </ol>

                                    <p className="font-semibold text-purple-300 mt-4">Opción 2: Desplegado en Railway</p>
                                    <ol className="space-y-2 ml-4">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">1.</span>
                                            <span>Despliega el frontend y backend en Railway</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">2.</span>
                                            <span>Abre la URL pública desde tu celular</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-purple-400">3.</span>
                                            <span>Usa el Modo Avión para probar offline</span>
                                        </li>
                                    </ol>

                                    <div className="mt-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                                        <p className="text-xs text-purple-200">
                                            <strong>💡 Tip:</strong> En iOS, también puedes usar Safari Developer Tools
                                            conectando tu iPhone a tu Mac para ver los logs de consola.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                                <h3 className="text-lg font-bold text-white mb-3">Stack Tecnológico</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-400">⚛️</span>
                                        <span className="text-slate-300">React 19</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-400">🚀</span>
                                        <span className="text-slate-300">NestJS 11</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-400">⚡</span>
                                        <span className="text-slate-300">Vite 6</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-400">🗄️</span>
                                        <span className="text-slate-300">PostgreSQL</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400">💾</span>
                                        <span className="text-slate-300">Dexie.js</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-cyan-400">🎨</span>
                                        <span className="text-slate-300">Tailwind CSS v4</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                            >
                                ¡Entendido! Vamos a probarlo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
