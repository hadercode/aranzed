import React from "react";
import { Upload, Camera } from "lucide-react";

export interface AvatarDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarDropzone({
  fileInputRef,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange,
}: AvatarDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
        isDragOver
          ? "border-[var(--color-sage-500)] bg-[var(--color-sage-50)]/50 dark:bg-[var(--color-sage-50)]/10 scale-[1.01]"
          : "border-[var(--color-border)] hover:border-[var(--color-sage-500)]/70 hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      <div className="mx-auto w-16 h-16 rounded-full bg-[var(--color-sage-50)] text-[var(--color-sage-600)] flex items-center justify-center mb-4 shadow-inner">
        <Upload className="w-8 h-8" />
      </div>

      <h4 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
        Arrastra tu imagen aquí o haz clic para seleccionar
      </h4>
      <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
        Formatos admitidos: JPG, PNG, WEBP o GIF (Tamaño máximo: 5 MB).
      </p>

      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-card)] text-[var(--color-sage-600)] border border-[var(--color-border)] shadow-sm hover:bg-[var(--color-sage-50)] transition-colors">
          <Camera className="w-3.5 h-3.5" />
          Explorar archivos
        </span>
      </div>
    </div>
  );
}

export default AvatarDropzone;
