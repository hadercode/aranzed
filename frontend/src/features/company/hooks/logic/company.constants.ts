export type CompanyTab =
  | 'general'
  | 'contact'
  | 'currency'
  | 'branding'
  | 'email'
  | 'legal';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const COMMON_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (COP)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (MXN)' },
  { code: 'PEN', symbol: 'S/.', name: 'Sol Peruano (PEN)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (CLP)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (ARS)' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño (BRL)' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (GBP)' },
];

export const TIMEZONES: string[] = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Lima',
  'America/Santiago',
  'America/Caracas',
  'America/Buenos_Aires',
  'America/Montevideo',
  'America/La_Paz',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/Madrid',
  'UTC',
];

