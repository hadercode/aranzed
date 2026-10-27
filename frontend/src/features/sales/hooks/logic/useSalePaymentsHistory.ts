import { useState } from 'react';
import { useSalePaymentsBySaleQuery } from '../queries';

export function useSalePaymentsHistory(saleId: string | null | undefined) {
  const [viewerReceiptUrl, setViewerReceiptUrl] = useState<string | null>(null);

  const { payments, isLoading, isError, error, refetch } =
    useSalePaymentsBySaleQuery(saleId);

  return {
    payments,
    isLoading,
    isError,
    error: error instanceof Error ? error.message : null,
    refetch,
    viewerReceiptUrl,
    handleOpenReceipt: (url: string) => setViewerReceiptUrl(url),
    handleCloseReceipt: () => setViewerReceiptUrl(null),
  };
}
