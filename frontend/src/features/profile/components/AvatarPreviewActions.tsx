import { Trash2, Save } from "lucide-react";
import { Button } from "@/shared/components/ui";

export interface AvatarPreviewActionsProps {
  avatarPreview: string | null;
  selectedAvatarFile: File | null;
  userInitial: string;
  isMutating: boolean;
  onOpenConfirmRemove: () => void;
  onCancelSelection: () => void;
  onSaveAvatar: () => void;
}

export function AvatarPreviewActions({
  avatarPreview,
  selectedAvatarFile,
  userInitial,
  isMutating,
  onOpenConfirmRemove,
  onCancelSelection,
  onSaveAvatar,
}: AvatarPreviewActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[var(--color-border)] shrink-0 bg-[var(--color-surface-card)] flex items-center justify-center">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-[var(--color-sage-600)]">
              {userInitial}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {selectedAvatarFile
              ? selectedAvatarFile.name
              : avatarPreview
              ? "Foto actual configurada"
              : "Sin foto asignada (se muestran iniciales)"}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {selectedAvatarFile
              ? `${(selectedAvatarFile.size / (1024 * 1024)).toFixed(2)} MB • Listo para guardar`
              : "Se muestra en la barra de navegación y comentarios."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {avatarPreview && !selectedAvatarFile && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onOpenConfirmRemove}
            disabled={isMutating}
            leftIcon={<Trash2 size={14} />}
          >
            Eliminar foto
          </Button>
        )}

        {selectedAvatarFile && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCancelSelection}
              disabled={isMutating}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onSaveAvatar}
              loading={isMutating}
              leftIcon={<Save size={14} />}
            >
              Guardar Foto
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default AvatarPreviewActions;
