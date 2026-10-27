/**
 * Script para generar claves RSA 2048 (PKCS#8 / SPKI) para autenticación asimétrica JWT (RS256).
 * Se ejecuta con: node backend/generate-env.js
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateKeys() {
  console.log('Generando par de claves RSA 2048-bit para JWT RS256...');
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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

  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  const rootEnvPath = path.join(__dirname, '..', '.env');

  // Convert keys to single-line format with escaped newlines for clean .env handling
  const escapedPrivate = privateKey.replace(/\r?\n/g, '\\n');
  const escapedPublic = publicKey.replace(/\r?\n/g, '\\n');

  // If backend/.env doesn't exist, copy from .env.example
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  }

  if (envContent) {
    if (envContent.includes('JWT_PRIVATE_KEY=')) {
      envContent = envContent.replace(
        /JWT_PRIVATE_KEY=.*/,
        `JWT_PRIVATE_KEY="${escapedPrivate}"`
      );
    } else {
      envContent += `\nJWT_PRIVATE_KEY="${escapedPrivate}"`;
    }

    if (envContent.includes('JWT_PUBLIC_KEY=')) {
      envContent = envContent.replace(
        /JWT_PUBLIC_KEY=.*/,
        `JWT_PUBLIC_KEY="${escapedPublic}"`
      );
    } else {
      envContent += `\nJWT_PUBLIC_KEY="${escapedPublic}"`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✓ Claves RSA configuradas con éxito en backend/.env');
  }

  // Also initialize or update root .env if exists or from root .env.example
  const rootEnvExamplePath = path.join(__dirname, '..', '.env.example');
  let rootEnvContent = '';
  if (fs.existsSync(rootEnvPath)) {
    rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');
  } else if (fs.existsSync(rootEnvExamplePath)) {
    rootEnvContent = fs.readFileSync(rootEnvExamplePath, 'utf8');
  }

  if (rootEnvContent) {
    if (rootEnvContent.includes('JWT_PRIVATE_KEY=')) {
      rootEnvContent = rootEnvContent.replace(
        /JWT_PRIVATE_KEY=.*/,
        `JWT_PRIVATE_KEY="${escapedPrivate}"`
      );
    } else {
      rootEnvContent += `\nJWT_PRIVATE_KEY="${escapedPrivate}"`;
    }

    if (rootEnvContent.includes('JWT_PUBLIC_KEY=')) {
      rootEnvContent = rootEnvContent.replace(
        /JWT_PUBLIC_KEY=.*/,
        `JWT_PUBLIC_KEY="${escapedPublic}"`
      );
    } else {
      rootEnvContent += `\nJWT_PUBLIC_KEY="${escapedPublic}"`;
    }

    fs.writeFileSync(rootEnvPath, rootEnvContent, 'utf8');
    console.log('✓ Claves RSA configuradas con éxito en .env raíz (Docker Compose)');
  }

  console.log('\n--- Claves generadas (puedes usarlas en .env raíz para Docker) ---');
  console.log(`JWT_PRIVATE_KEY="${escapedPrivate}"\n`);
  console.log(`JWT_PUBLIC_KEY="${escapedPublic}"\n`);
}

generateKeys();
