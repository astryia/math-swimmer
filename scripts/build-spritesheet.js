// Pre-build script: crops black side bars from freestyle frames and stacks them
// vertically into a single sprite sheet PNG.
//
// Input:  assets/freestyle/*.png  (1280x720 landscape, pool in center)
// Output: src/assets/freestyle-sheet.png
//
// Frame count is detected automatically — drop new frames in assets/freestyle/
// and rebuild without changing any code.

import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const framesDir = path.join(root, 'assets', 'freestyle')
const outPath = path.join(root, 'src', 'assets', 'freestyle-sheet.png')

// Ensure output directory exists
const outDir = path.dirname(outPath)
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// The freestyle frames are 1280x720 landscape. The pool content is a portrait
// region in the center. Based on the reference images, the pool occupies roughly
// the middle 560px of width (centered). We crop to a 560x720 portrait region.
const FRAME_W = 1280
const FRAME_H = 720
const CROP_W = 560
const CROP_H = 720
const CROP_LEFT = Math.floor((FRAME_W - CROP_W) / 2)

// Scale down for performance: target 280x360 per frame (half size)
const TARGET_W = 280
const TARGET_H = 360

async function main() {
  // Detect frame count automatically from sorted PNG filenames
  const framePaths = fs.readdirSync(framesDir)
    .filter(f => f.endsWith('.png'))
    .sort()
    .map(f => path.join(framesDir, f))
  const frameCount = framePaths.length
  if (frameCount === 0) throw new Error(`No PNG files found in ${framesDir}`)

  console.log(`Processing ${frameCount} frames...`)

  const processedBuffers = await Promise.all(
    framePaths.map(async (fp, i) => {
      if (!fs.existsSync(fp)) {
        throw new Error(`Frame not found: ${fp}`)
      }
      const buf = await sharp(fp)
        .extract({ left: CROP_LEFT, top: 0, width: CROP_W, height: CROP_H })
        .resize(TARGET_W, TARGET_H)
        .toBuffer()
      process.stdout.write(`\r  Frame ${i + 1}/${frameCount}`)
      return buf
    })
  )

  console.log('\nAssembling sprite sheet...')

  // Stack all frames vertically
  const sheetH = TARGET_H * frameCount
  const compositeOps = processedBuffers.map((buf, i) => ({
    input: buf,
    top: i * TARGET_H,
    left: 0,
  }))

  await sharp({
    create: {
      width: TARGET_W,
      height: sheetH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(compositeOps)
    .png({ compressionLevel: 8 })
    .toFile(outPath)

  console.log(`Done! Sprite sheet written to: ${outPath}`)
  console.log(`  Size: ${TARGET_W}×${sheetH}px (${frameCount} frames of ${TARGET_W}×${TARGET_H}px)`)
}

main().catch(err => {
  console.error('Build failed:', err)
  process.exit(1)
})
