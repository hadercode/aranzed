import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.resolve(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Standard SVG Icon
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F17"/>
      <stop offset="100%" stop-color="#131926"/>
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22B2B8"/>
      <stop offset="45%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#F43F5E"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#F43F5E" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  <rect x="96" y="96" width="320" height="320" rx="80" fill="url(#brandGrad)" filter="url(#shadow)"/>
  <text x="256" y="325" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="220" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">A</text>
  <circle cx="340" cy="165" r="16" fill="#FBBF24"/>
</svg>`;

// 2. Maskable SVG Icon (adaptive icon with 80% safe zone)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="maskableBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F17"/>
      <stop offset="100%" stop-color="#182234"/>
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22B2B8"/>
      <stop offset="45%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#F43F5E"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#maskableBg)"/>
  <rect x="136" y="136" width="240" height="240" rx="60" fill="url(#brandGrad)"/>
  <text x="256" y="308" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="165" font-weight="900" fill="#FFFFFF" text-anchor="middle">A</text>
  <circle cx="320" cy="188" r="14" fill="#FBBF24"/>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), maskableSvg);

  const standardBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // Generate 512x512 PNG
  await sharp(standardBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));

  // Generate 192x192 PNG
  await sharp(standardBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));

  // Generate Maskable 512x512 PNG
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));

  // Generate Apple Touch Icon 180x180 PNG
  await sharp(standardBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  // Generate Favicon 64x64 PNG
  await sharp(standardBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(iconsDir, 'favicon-64x64.png'));

  console.log('PWA icons successfully generated in frontend/public/icons/');
}

generate().catch(console.error);
