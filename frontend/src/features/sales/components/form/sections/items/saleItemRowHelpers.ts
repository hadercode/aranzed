import type { Product } from '@/features/catalog/products/types';

export function calculateSaleItemLine({
  quantity,
  unitPrice,
  discountRate,
  isTaxable,
  taxRate,
  watchedRate,
}: {
  quantity: number;
  unitPrice: number;
  discountRate: number;
  isTaxable: boolean;
  taxRate: number;
  watchedRate: number;
}) {
  const gross = quantity * unitPrice;
  const discountAmount = (gross * discountRate) / 100;
  const net = gross - discountAmount;
  const taxAmount = isTaxable ? (net * taxRate) / 100 : 0;
  const lineTotalUSD = net + taxAmount;
  const lineTotalLocal = lineTotalUSD * (watchedRate > 0 ? watchedRate : 1.0);

  return { lineTotalUSD, lineTotalLocal };
}

export function buildSaleItemProductOptions(
  productsList: Product[],
  watchedRate: number
) {
  return [
    {
      value: '',
      label:
        productsList.length === 0
          ? '-- Sin productos disponibles --'
          : '-- Seleccionar producto del catálogo --',
    },
    ...productsList.map((p) => {
      const priceUSD = Number(p.lastSalePrice || 0);
      const priceBs = (priceUSD * watchedRate).toFixed(2);
      return {
        value: p.id,
        label: `${p.name} — $${priceUSD.toFixed(2)} USD (Bs. ${priceBs})`,
      };
    }),
  ];
}

