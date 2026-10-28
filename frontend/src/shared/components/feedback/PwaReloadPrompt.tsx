import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Download } from 'lucide-react';

export function PwaReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Check for updates periodically every hour
        setInterval(() => {
          r.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('Error al registrar Service Worker PWA:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[var(--color-surface-card)]/95 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22B2B8] to-[#8B5CF6] text-white flex items-center justify-center shrink-0 shadow-xs">
            {needRefresh ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[var(--color-text-primary)] truncate">
              {needRefresh
                ? 'Nueva versión disponible'
                : 'Aplicación lista offline'}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {needRefresh
                ? 'Actualiza para obtener las últimas funciones.'
                : 'El contenido principal ahora funciona sin conexión.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#22B2B8] to-[#8B5CF6] hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              Actualizar
            </button>
          )}
          <button
            onClick={close}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PwaReloadPrompt;
