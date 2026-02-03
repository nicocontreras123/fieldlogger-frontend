import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Reload Prompt Component
 * 
 * Shows a toast notification when a new version of the PWA is available.
 * Allows the user to skip waiting and update immediately.
 */
export default function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('✅ Service Worker registered: ' + r);
        },
        onRegisterError(error) {
            console.log('❌ SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        <div className="fixed bottom-0 right-0 p-4 z-[100] flex flex-col gap-2">
            {(offlineReady || needRefresh) && (
                <div className="bg-slate-800 text-white p-4 rounded-lg shadow-2xl border border-slate-600 animate-slideIn flex flex-col gap-3 max-w-sm">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">
                            {offlineReady ? '🎉' : '🚀'}
                        </span>
                        <div>
                            <h3 className="font-bold">
                                {offlineReady ? '¡Listo para trabajar offline!' : 'Nueva versión disponible'}
                            </h3>
                            <p className="text-sm text-gray-300 mt-1">
                                {offlineReady
                                    ? 'La aplicación se guardó en caché y funcionará sin internet.'
                                    : 'Hay una nueva actualización con mejoras y correcciones.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                        {needRefresh && (
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-semibold transition-colors"
                                onClick={() => updateServiceWorker(true)}
                            >
                                Actualizar Ahora
                            </button>
                        )}
                        <button
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm transition-colors"
                            onClick={close}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
