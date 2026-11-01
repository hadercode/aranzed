import { useState } from 'react';

export function useQuickPaymentReceipt(uploadReceipt: (file: File) => Promise<{ url: string }>) {
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setReceiptError(null);
      const res = await uploadReceipt(file);
      setReceiptUrl(res.url);
      setReceiptFileName(file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el comprobante';
      setReceiptError(msg);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptUrl('');
    setReceiptFileName('');
    setReceiptError(null);
  };

  return {
    receiptUrl,
    receiptFileName,
    receiptError,
    handleFileUpload,
    handleRemoveReceipt,
  };
}

