import { useState, useMemo, useCallback } from 'react';
import { getAssetUrl } from '@/lib/api-client';

export function useCompanyLogo(
  logoUrl?: string,
  onUpload?: (file: File) => Promise<string>,
  onClearMessages?: () => void
) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const previewLogo = useMemo(() => {
    if (selectedFile) return URL.createObjectURL(selectedFile);
    if (logoUrl) return getAssetUrl(logoUrl);
    return null;
  }, [selectedFile, logoUrl]);

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      onClearMessages?.();
    },
    [onClearMessages]
  );

  const handleUploadLogoOnly = useCallback(async () => {
    if (!selectedFile || !onUpload) return;
    try {
      setIsUploadingLogo(true);
      await onUpload(selectedFile);
      setSelectedFile(null);
    } finally {
      setIsUploadingLogo(false);
    }
  }, [selectedFile, onUpload]);

  return {
    selectedFile,
    setSelectedFile,
    isUploadingLogo,
    setIsUploadingLogo,
    previewLogo,
    handleFileSelect,
    handleUploadLogoOnly,
  };
}

