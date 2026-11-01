import { RotateCcw } from "lucide-react";

interface WhatsAppMessageEditorProps {
  activeMessage: string;
  onChangeMessage: (msg: string) => void;
  onResetMessage: () => void;
}

export function WhatsAppMessageEditor({
  activeMessage,
  onChangeMessage,
  onResetMessage,
}: WhatsAppMessageEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--color-text-primary)]">
          Mensaje cordial a enviar (editable):
        </label>
        <button
          type="button"
          onClick={onResetMessage}
          className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] hover:text-emerald-600 transition-colors cursor-pointer"
          title="Restablecer mensaje predeterminado"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer texto</span>
        </button>
      </div>
      <textarea
        rows={8}
        value={activeMessage}
        onChange={(e) => onChangeMessage(e.target.value)}
        className="w-full p-3.5 text-xs rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed font-sans resize-y"
      />
    </div>
  );
}

