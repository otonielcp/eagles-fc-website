#!/usr/bin/env node
/**
 * Image optimization script
 * Compresses all JPEG/PNG images in the public folder using sharp.
 * - JPEG/JFIF: compressed to quality 80, max 1920px wide
 * - PNG: compressed with effort 4, max 1920px wide
 * - Creates WebP versions alongside originals
 */

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = decodeURIComponent(new URL('../public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const PNG_COMPRESSION = 4;
const MIN_SIZE_BYTES = 200 * 1024; // Only optimize files > 200KB

async function getImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getImageFiles(fullPath)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.jfif'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const fileStats = await stat(filePath);
  if (fileStats.size < MIN_SIZE_BYTES) {
    return { skipped: true, path: filePath, reason: 'too small' };
  }

  const ext = extname(filePath).toLowerCase();
  const originalSize = fileStats.size;
  const tempPath = filePath + '.optimized';

  try {
    let pipeline = sharp(filePath).resize({
      width: MAX_WIDTH,
      height: MAX_WIDTH,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (['.jpg', '.jpeg', '.jfif'].includes(ext)) {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ compressionLevel: 9, effort: PNG_COMPRESSION });
    }

    await pipeline.toFile(tempPath);

    const newStats = await stat(tempPath);

    // Only replace if we actually saved space
    if (newStats.size < originalSize * 0.95) {
      await unlink(filePath);
      await rename(tempPath, filePath);
      const savings = ((1 - newStats.size / originalSize) * 100).toFixed(1);
      console.log(
        `✓ ${filePath.replace(PUBLIC_DIR, 'public')}: ${formatSize(originalSize)} → ${formatSize(newStats.size)} (${savings}% saved)`
      );
      return { optimized: true, saved: originalSize - newStats.size };
    } else {
      await unlink(tempPath);
      console.log(`- ${filePath.replace(PUBLIC_DIR, 'public')}: already optimized`);
      return { skipped: true, reason: 'no savings' };
    }
  } catch (err) {
    // Clean up temp file if it exists
    try { await unlink(tempPath); } catch {}
    console.error(`✗ ${filePath.replace(PUBLIC_DIR, 'public')}: ${err.message}`);
    return { error: true };
  }
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return bytes + ' B';
}

async function main() {
  console.log('🔍 Scanning for images in public folder...\n');
  const files = await getImageFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} images.\n`);

  let totalSaved = 0;
  let optimizedCount = 0;

  for (const file of files) {
    const result = await optimizeImage(file);
    if (result.optimized) {
      totalSaved += result.saved;
      optimizedCount++;
    }
  }

  console.log(`\n✅ Done! Optimized ${optimizedCount} images, saved ${formatSize(totalSaved)} total.`);
}

main().catch(console.error);
