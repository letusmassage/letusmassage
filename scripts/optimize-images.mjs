// One-time image optimizer. Right-sizes oversized source images, recompresses
// them in place, and writes .webp siblings. NOT wired into the build (re-running
// would recompress already-compressed files). Run manually: node scripts/optimize-images.mjs
import sharp from 'sharp'
import { readFileSync, writeFileSync, statSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const p = (rel) => resolve(root, 'public', rel)
const kb = (bytes) => (bytes / 1024).toFixed(0) + ' KB'

// format: 'jpeg' overwrites in place; webp:<quality|false> writes a .webp sibling.
const jobs = [
  { file: 'hero.jpg', width: 2880, format: 'jpeg', quality: 78, webp: false },
  { file: 'letta.jpg', width: 1000, format: 'jpeg', quality: 82, webp: 80 },
  { file: 'logo-blue.png', height: 420, format: 'png', webp: 90 },
  { file: 'logo.png', width: 700, format: 'png', webp: 90 },
  { file: 'services/relax.jpg', width: 900, format: 'jpeg', quality: 80, webp: 78 },
  { file: 'services/klassisk.jpg', width: 900, format: 'jpeg', quality: 80, webp: 78 },
  { file: 'services/massageterapi.jpg', width: 900, format: 'jpeg', quality: 80, webp: 78 },
  { file: 'services/prenatal.jpg', width: 900, format: 'jpeg', quality: 80, webp: 78 },
  { file: 'dividers/6x2a2260.jpg', width: 1920, format: 'jpeg', quality: 78, webp: 76 },
  { file: 'dividers/6x2a2269.jpg', width: 1920, format: 'jpeg', quality: 78, webp: 76 },
  { file: 'dividers/6x2a2183.jpg', width: 1920, format: 'jpeg', quality: 78, webp: 76 },
]

let before = 0, after = 0
for (const job of jobs) {
  const src = p(job.file)
  if (!existsSync(src)) { console.log(`SKIP (missing) ${job.file}`); continue }
  const origBytes = statSync(src).size
  before += origBytes
  const resize = { withoutEnlargement: true, fit: 'inside' }
  if (job.width) resize.width = job.width
  if (job.height) resize.height = job.height

  const base = sharp(readFileSync(src)).rotate().resize(resize)
  const main = job.format === 'png'
    ? await base.clone().png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
    : await base.clone().jpeg({ quality: job.quality, mozjpeg: true }).toBuffer()
  writeFileSync(src, main)
  after += main.length

  let webpNote = ''
  if (job.webp) {
    const webpBuf = await base.clone().webp({ quality: job.webp, alphaQuality: 100 }).toBuffer()
    const webpPath = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    writeFileSync(webpPath, webpBuf)
    after += webpBuf.length
    webpNote = ` + webp ${kb(webpBuf.length)}`
  }
  console.log(`${job.file.padEnd(26)} ${kb(origBytes)} -> ${kb(main.length)}${webpNote}`)
}

// Remove orphaned asset (not referenced anywhere in src/)
const orphan = p('ioulietta.jpg')
if (existsSync(orphan)) { rmSync(orphan); console.log('deleted orphan ioulietta.jpg (was 1.8 MB)') }

console.log(`\nTotal source images: ${kb(before)} -> ${kb(after)} (main formats + webp)`)
