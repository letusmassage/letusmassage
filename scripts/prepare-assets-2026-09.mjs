// Engångskörning: förbereder bilderna från Lettas Google Drive-mapp (sept 2026).
//   node scripts/prepare-assets-2026-09.mjs
// Körs INTE i bygget – precis som optimize-images.mjs skulle en omkörning bara
// komprimera om redan komprimerade filer.
import sharp from 'sharp'
import { mkdirSync, existsSync } from 'node:fs'

const SRC = '/Users/paul/Downloads/drive-download-20260906T160400Z-1-001'

if (!existsSync(SRC)) {
  console.error(`[assets] Källmappen saknas: ${SRC}`)
  process.exit(1)
}

mkdirSync('public/partners', { recursive: true })

const logo = (file) =>
  sharp(`${SRC}/${file}`).trim().resize({ width: 640, withoutEnlargement: true })

await logo('Benifex_Logo_OnLight_RGB.png').png({ compressionLevel: 9 }).toFile('public/partners/benifex.png')
await logo('Epassi logo.png').png({ compressionLevel: 9 }).toFile('public/partners/epassi.png')

await sharp(`${SRC}/Fysiskt presentkort.jpg`)
  .rotate()
  .resize({ width: 1400, withoutEnlargement: true })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile('public/presentkort-fysiskt.jpg')

await sharp(`${SRC}/Kroppsterapeuterna_Centrerad_devis.jpg`)
  .png({ compressionLevel: 9 })
  .toFile('public/kroppsterapeuterna-devis.png')

console.log('[assets] ✓ Klart')
