import { useActionState } from 'react';
import { db } from '../lib/db';
import { syncPendingInspections } from '../lib/sync-engine';

/**
 * CreateInspection Component - React 19 with Actions
 * 
 * Demonstrates modern 2026 patterns:
 * - useActionState for form state management (no external libraries)
 * - Form actions for native form handling
 * - Optimistic UI with Dexie.js
 * - Premium glassmorphism design
 */

interface FormState {
    status: 'idle' | 'pending' | 'success' | 'error';
    message?: string;
}

async function createInspectionAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        // Extract form data
        const location = formData.get('location') as string;
        const technician = formData.get('technician') as string;
        const findings = formData.get('findings') as string;

        // Validation
        if (!location || location.length < 3) {
            return { status: 'error', message: 'La ubicación debe tener al menos 3 caracteres' };
        }
        if (!technician || technician.length < 2) {
            return { status: 'error', message: 'El nombre del técnico debe tener al menos 2 caracteres' };
        }
        if (!findings || findings.length < 10) {
            return { status: 'error', message: 'Los hallazgos deben tener al menos 10 caracteres' };
        }

        // Create inspection object
        const inspection = {
            id: crypto.randomUUID(),
            location,
            technician,
            findings,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
        };

        // Optimistic UI: Save to Dexie immediately
        await db.inspections.add(inspection);

        console.log('✅ Inspection saved locally:', inspection.id);

        // Try to sync immediately if online, otherwise the background job will handle it
        if (navigator.onLine) {
            syncPendingInspections().catch(console.error);
        }

        // The sync engine will handle backend sync automatically
        return {
            status: 'success',
            message: `¡Inspección guardada! ${navigator.onLine ? 'Sincronizando...' : 'Se sincronizará cuando esté en línea'}`,
        };
    } catch (error) {
        console.error('Error creating inspection:', error);
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Error al crear la inspección',
        };
    }
}

export default function CreateInspection() {
    // React 19: useActionState replaces useState + manual form handling
    const [state, formAction, isPending] = useActionState(createInspectionAction, {
        status: 'idle',
    });

    return (
        <div className="max-w-3xl mx-auto px-6">
            {/* Premium Card with Glassmorphism */}
            <div className="relative">
                {/* Gradient Background Blur */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-25 animate-pulse" />

                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="relative px-8 pt-8 pb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Nueva Inspección
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Registra tus hallazgos de campo</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                                <div className={`w-2 h-2 rounded-full ${navigator.onLine ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                <span className="text-xs font-medium text-slate-300">
                                    {navigator.onLine ? 'Conectado' : 'Modo Sin Conexión'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form action={formAction} className="px-8 pb-8 space-y-6">
                        {/* Location Field */}
                        <div className="group">
                            <label htmlFor="location" className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                <span className="text-blue-400">📍</span>
                                Ubicación
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    disabled={isPending}
                                    className="w-full px-4 py-3.5 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 disabled:opacity-50 transition-all duration-200 group-hover:border-slate-600/50"
                                    placeholder="ej., Edificio A - Piso 3, Sala 301"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-focus-within:from-blue-600/5 group-focus-within:to-purple-600/5 pointer-events-none transition-all duration-300" />
                            </div>
                        </div>

                        {/* Technician Field */}
                        <div className="group">
                            <label htmlFor="technician" className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                <span className="text-purple-400">👤</span>
                                Técnico
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="technician"
                                    name="technician"
                                    required
                                    disabled={isPending}
                                    className="w-full px-4 py-3.5 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/70 disabled:opacity-50 transition-all duration-200 group-hover:border-slate-600/50"
                                    placeholder="Tu nombre completo"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-focus-within:from-purple-600/5 group-focus-within:to-pink-600/5 pointer-events-none transition-all duration-300" />
                            </div>
                        </div>

                        {/* Findings Field */}
                        <div className="group">
                            <label htmlFor="findings" className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                <span className="text-pink-400">📝</span>
                                Hallazgos
                            </label>
                            <div className="relative">
                                <textarea
                                    id="findings"
                                    name="findings"
                                    required
                                    disabled={isPending}
                                    rows={5}
                                    className="w-full px-4 py-3.5 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-800/70 disabled:opacity-50 transition-all duration-200 resize-none group-hover:border-slate-600/50"
                                    placeholder="Describe los hallazgos de tu inspección en detalle..."
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-600/0 to-blue-600/0 group-focus-within:from-pink-600/5 group-focus-within:to-blue-600/5 pointer-events-none transition-all duration-300" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-6 py-4 transition-all duration-300 group-hover:from-blue-500 group-hover:to-purple-500">
                                <span className="relative z-10 font-bold text-white text-lg flex items-center justify-center gap-2">
                                    {isPending ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <span>💾</span>
                                            Guardar Inspección
                                        </>
                                    )}
                                </span>
                            </div>
                        </button>

                        {/* Status Messages */}
                        {state.message && (
                            <div
                                className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 animate-in slide-in-from-top ${state.status === 'success'
                                    ? 'bg-green-900/20 border-green-500/50 text-green-200'
                                    : state.status === 'error'
                                        ? 'bg-red-900/20 border-red-500/50 text-red-200'
                                        : 'bg-blue-900/20 border-blue-500/50 text-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {state.status === 'success' ? '✅' : state.status === 'error' ? '❌' : 'ℹ️'}
                                    </span>
                                    <span className="font-medium">{state.message}</span>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

