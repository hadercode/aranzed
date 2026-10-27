import React, { useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';

interface CompanyLogoUploaderProps {
  previewLogo: string | null;
  selectedFile: File | null;
  isUploadingLogo: boolean;
  onFileSelect: (file: File) => void;
  onUploadNow: () => void;
}

export function CompanyLogoUploader({
  previewLogo,
  selectedFile,
  isUploadingLogo,
  onFileSelect,
  onUploadNow,
}: CompanyLogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-sage-500)] transition-colors bg-[var(--color-surface-bg)] flex flex-col items-center justify-center text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      <div className="w-32 h-32 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden mb-4 shadow-sm relative group">
        {previewLogo ? (
          <img src={previewLogo} alt="Logo" className="w-full h-full object-contain p-2" />
        ) : (
          <ImageIcon className="w-12 h-12 text-[var(--color-text-muted)]" />
        )}
      </div>

      <div className="space-y-2 max-w-sm">
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Subir Logotipo de la Empresa
        </h4>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Formatos soportados: PNG, JPG, WEBP, SVG. Tamaño máximo: 5MB.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] text-sm font-medium text-[var(--color-text-primary)] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Upload size={16} />
          Seleccionar Archivo
        </button>

        {selectedFile && (
          <button
            type="button"
            onClick={onUploadNow}
            disabled={isUploadingLogo}
            className="px-4 py-2 rounded-xl bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isUploadingLogo ? 'Subiendo...' : 'Subir Ahora'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CompanyLogoUploader;
