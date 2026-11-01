import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppBanner() {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
      <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
        <WhatsAppIcon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-semibold text-sm text-emerald-950 dark:text-emerald-200">
          Recordatorio cordial de cobranza
        </p>
        <p className="mt-0.5 opacity-90">
          Genera y envía un mensaje personalizado al cliente con el saldo pendiente, fecha de vencimiento y cálculo automático de días de antigüedad.
        </p>
      </div>
    </div>
  );
}

