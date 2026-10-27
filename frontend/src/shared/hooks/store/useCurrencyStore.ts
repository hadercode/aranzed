import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CurrencyConfig {
  functionalCurrency: string;
  functionalSymbol: string;
  localCurrency: string;
  localSymbol: string;
}

export interface CurrencyState extends CurrencyConfig {
  setCurrencies: (config: Partial<CurrencyConfig>) => void;
  setFunctionalCurrency: (code: string, symbol: string) => void;
  setLocalCurrency: (code: string, symbol: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      functionalCurrency: 'USD',
      functionalSymbol: '$',
      localCurrency: 'VES',
      localSymbol: 'Bs.',
      setCurrencies: (config) =>
        set((state) => ({
          ...state,
          ...config,
        })),
      setFunctionalCurrency: (code, symbol) =>
        set({ functionalCurrency: code, functionalSymbol: symbol }),
      setLocalCurrency: (code, symbol) =>
        set({ localCurrency: code, localSymbol: symbol }),
    }),
    {
      name: 'currency-storage',
    }
  )
);
