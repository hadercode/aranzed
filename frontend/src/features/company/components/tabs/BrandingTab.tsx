import { useCompanyContext } from '../../context';
import { CompanyLogoUploader } from '../branding/CompanyLogoUploader';

export function BrandingTab() {
  const {
    formData,
    previewLogo,
    selectedFile,
    isUploadingLogo,
    handleChange,
    handleFileSelect,
    handleUploadLogoOnly,
  } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <CompanyLogoUploader
        previewLogo={previewLogo}
        selectedFile={selectedFile}
        isUploadingLogo={isUploadingLogo}
        onFileSelect={handleFileSelect}
        onUploadNow={handleUploadLogoOnly}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Ruta o URL del Logo
          </label>
          <input
            type="text"
            name="logoUrl"
            value={formData.logoUrl || ''}
            onChange={handleChange}
            placeholder="/uploads/company/logo.png"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-xs font-mono"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Se autocompleta automáticamente al subir un archivo
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            URL del Favicon (Opcional)
          </label>
          <input
            type="text"
            name="faviconUrl"
            value={formData.faviconUrl || ''}
            onChange={handleChange}
            placeholder="/favicon.ico"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
}

export default BrandingTab;
