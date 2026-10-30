import { BadRequestException } from '@nestjs/common';

/**
 * Límite máximo de filas permitidas por archivo Excel para prevenir DoS y agotamiento de memoria.
 */
export const MAX_EXCEL_IMPORT_ROWS = 5000;

/**
 * Carpetas autorizadas para almacenamiento en S3 (Whitelist).
 */
export const ALLOWED_STORAGE_FOLDERS = [
  'products',
  'company',
  'avatars',
  'documents',
  'general',
] as const;

export type AllowedStorageFolder = (typeof ALLOWED_STORAGE_FOLDERS)[number];

/**
 * Tipos de archivo permitidos para almacenamiento general en S3.
 */
export const ALLOWED_STORAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
] as const;

export const ALLOWED_STORAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.pdf',
] as const;

/**
 * Valida la firma binaria real (Magic Bytes) de un buffer para evitar MIME Type spoofing.
 */
export function validateMagicBytes(
  buffer: Buffer,
  category: 'excel' | 'storage',
): void {
  if (!buffer || buffer.length < 4) {
    throw new BadRequestException('El archivo subido está vacío o está corrupto.');
  }

  if (category === 'excel') {
    // XLSX es un archivo ZIP con firma 50 4B 03 04 o 50 4B 05 06 o 50 4B 07 08
    const isZip =
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07);

    // XLS antiguo es OLE2 (D0 CF 11 E0)
    const isOle2 =
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0;

    if (!isZip && !isOle2) {
      throw new BadRequestException(
        'El archivo subido no tiene una firma binaria válida de hoja de cálculo Excel (.xlsx/.xls).',
      );
    }
    return;
  }

  if (category === 'storage') {
    // JPEG: FF D8 FF
    const isJpeg =
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

    // PNG: 89 50 4E 47
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;

    // GIF: 47 49 46 38
    const isGif =
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38;

    // WEBP: 'RIFF' en [0..3] y 'WEBP' en [8..11]
    const isWebp =
      buffer.length >= 12 &&
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;

    // PDF: %PDF (25 50 44 46)
    const isPdf =
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46;

    if (!isJpeg && !isPng && !isGif && !isWebp && !isPdf) {
      throw new BadRequestException(
        'Firma binaria de archivo no permitida. Solo se admiten imágenes legítimas (JPEG, PNG, WEBP, GIF) y documentos PDF.',
      );
    }
  }
}

/**
 * Mitigación de Formula Injection (CSV / Spreadsheet Formula Injection - CWE-1236).
 * Si un valor de celda de texto comienza con =, +, -, @, tab o retorno de carro,
 * se antepone un apóstrofe (') para que cualquier hoja de cálculo lo trate como texto puro
 * y neutralice la ejecución automática de comandos o hipervínculos maliciosos.
 */
export function sanitizeFormulaInjection(value: string): string {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (trimmed.length === 0) return '';

  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousPrefixes.some((p) => trimmed.startsWith(p))) {
    // Si ya empieza con comilla simple no la duplicamos
    if (trimmed.startsWith("'")) {
      return trimmed;
    }
    return `'${trimmed}`;
  }

  return trimmed;
}

