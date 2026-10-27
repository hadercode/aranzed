import { Info } from 'lucide-react';
import { useCompanyContext } from '../../context';

export function EmailTab() {
  const { formData, handleChange } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-sm">Parámetros del Servidor de Correo</p>
          <p>
            Estos datos se almacenan de forma segura para la empresa y quedarán disponibles para ser vinculados con el servicio de mensajería/notificaciones que configures en el futuro.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Servidor SMTP (Host)
          </label>
          <input
            type="text"
            name="smtpHost"
            value={formData.smtpHost || ''}
            onChange={handleChange}
            placeholder="smtp.gmail.com ó mail.miempresa.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Puerto SMTP
          </label>
          <input
            type="number"
            name="smtpPort"
            value={formData.smtpPort || ''}
            onChange={handleChange}
            placeholder="587 ó 465"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Usuario SMTP / Email de autenticación
          </label>
          <input
            type="text"
            name="smtpUser"
            value={formData.smtpUser || ''}
            onChange={handleChange}
            placeholder="notificaciones@miempresa.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Contraseña / Token de Aplicación SMTP
          </label>
          <input
            type="password"
            name="smtpPassword"
            value={formData.smtpPassword || ''}
            onChange={handleChange}
            placeholder="••••••••••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Nombre del Remitente (From Name)
          </label>
          <input
            type="text"
            name="smtpFromName"
            value={formData.smtpFromName || ''}
            onChange={handleChange}
            placeholder="Ej. Mi Empresa - Notificaciones"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Email del Remitente (From Email)
          </label>
          <input
            type="email"
            name="smtpFromEmail"
            value={formData.smtpFromEmail || ''}
            onChange={handleChange}
            placeholder="no-reply@miempresa.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="smtpSecure"
            name="smtpSecure"
            checked={Boolean(formData.smtpSecure)}
            onChange={handleChange}
            className="w-4 h-4 text-[var(--color-sage-500)] rounded border-[var(--color-border)] focus:ring-[var(--color-sage-500)]"
          />
          <label htmlFor="smtpSecure" className="text-sm text-[var(--color-text-primary)] cursor-pointer">
            Usar conexión segura SSL / TLS (Recomendado para puerto 465)
          </label>
        </div>
      </div>
    </div>
  );
}

export default EmailTab;
