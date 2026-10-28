import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

const logger = new Logger('JwtKeyConfig');

let cachedFallbackKeys: { privateKey: string; publicKey: string } | null = null;

function getFallbackRsaKeyPair(): { privateKey: string; publicKey: string } {
  if (!cachedFallbackKeys) {
    logger.warn(
      '⚠️ JWT_PRIVATE_KEY o JWT_PUBLIC_KEY no fueron detectadas o tienen formato inválido en las variables de entorno. ' +
        'Generando automáticamente un par de claves RSA 2048-bit en memoria para garantizar que el login opere sin caídas. ' +
        'RECOMENDACIÓN PARA PRODUCCIÓN: Configura JWT_PRIVATE_KEY y JWT_PUBLIC_KEY en el panel de tu servidor o hosting.',
    );
    cachedFallbackKeys = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
  }
  return cachedFallbackKeys;
}

export function sanitizePemKey(
  rawKey: string | undefined | null,
): string | null {
  if (!rawKey) return null;
  let key = String(rawKey).trim();

  // Eliminar comillas envolventes simples o dobles que suelen agregarse en Docker/Render/env
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // Convertir secuencias literales de escape \r\n y \n en saltos de línea reales
  key = key
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .trim();

  // Validar que contenga los marcadores PEM mínimos de clave asimétrica
  if (!key.includes('BEGIN') || !key.includes('KEY')) {
    return null;
  }

  return key;
}

export function getJwtKeys(
  rawPrivate?: string | null,
  rawPublic?: string | null,
): {
  privateKey: string;
  publicKey: string;
} {
  const privateKey = sanitizePemKey(rawPrivate);
  const publicKey = sanitizePemKey(rawPublic);

  if (privateKey && publicKey) {
    return { privateKey, publicKey };
  }

  const fallback = getFallbackRsaKeyPair();
  return {
    privateKey: privateKey || fallback.privateKey,
    publicKey: publicKey || fallback.publicKey,
  };
}
