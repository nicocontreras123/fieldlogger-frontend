import { useActionState } from 'react';
import { db } from '../lib/db';

/**
 * CreateInspection Component - React 19 with Actions
 * 
 * Demonstrates modern 2026 patterns:
 * - useActionState for form state management (no external libraries)
 * - Form actions for native form handling
 * - Optimistic UI with Dexie.js
 * - No manual useMemo/useCallback (React Compiler handles it)
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
            return { status: 'error', message: 'Location must be at least 3 characters' };
        }
        if (!technician || technician.length < 2) {
            return { status: 'error', message: 'Technician name must be at least 2 characters' };
        }
        if (!findings || findings.length < 10) {
            return { status: 'error', message: 'Findings must be at least 10 characters' };
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

        // The sync engine will handle backend sync automatically
        return {
            status: 'success',
            message: `Inspection saved! ${navigator.onLine ? 'Syncing...' : 'Will sync when online'}`,
        };
    } catch (error) {
        console.error('Error creating inspection:', error);
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to create inspection',
        };
    }
}

export default function CreateInspection() {
    // React 19: useActionState replaces useState + manual form handling
    const [state, formAction, isPending] = useActionState(createInspectionAction, {
        status: 'idle',
    });

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">New Inspection</h2>
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-red-500'
                                }`}
                        />
                        <span className="text-sm text-gray-400">
                            {navigator.onLine ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                {/* React 19: Form with action prop */}
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            placeholder="e.g., Building A - Floor 3"
                        />
                    </div>

                    <div>
                        <label htmlFor="technician" className="block text-sm font-medium text-gray-300 mb-2">
                            Technician
                        </label>
                        <input
                            type="text"
                            id="technician"
                            name="technician"
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label htmlFor="findings" className="block text-sm font-medium text-gray-300 mb-2">
                            Findings
                        </label>
                        <textarea
                            id="findings"
                            name="findings"
                            required
                            disabled={isPending}
                            rows={4}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            placeholder="Describe your inspection findings..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Saving...' : 'Save Inspection'}
                    </button>

                    {/* Status Messages */}
                    {state.message && (
                        <div
                            className={`p-4 rounded-lg ${state.status === 'success'
                                    ? 'bg-green-900/50 text-green-200'
                                    : state.status === 'error'
                                        ? 'bg-red-900/50 text-red-200'
                                        : 'bg-blue-900/50 text-blue-200'
                                }`}
                        >
                            {state.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
