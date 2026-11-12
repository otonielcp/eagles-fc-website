// Saves admin-uploaded images in MongoDB and returns the public URL that
// serves them (app/api/images/[id]/route.ts). Callers must check the admin
// session first; this module has no 'use server' so it is not a public action.
import connectDB from '@/lib/dbConnect';
import StoredImage from '@/models/StoredImage';

// Matches the client-side limit in components/admin/shared/validateImageFile.ts.
const MAX_BYTES = 4.5 * 1024 * 1024;

const URL_PREFIX = '/api/images/';

// Raster formats only. SVG is refused because it can carry script.
const SIGNATURES: Record<string, (b: Buffer) => boolean> = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/gif': (b) => b.subarray(0, 4).toString('ascii') === 'GIF8',
  'image/webp': (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP',
};

export const STORED_IMAGE_TYPES = Object.keys(SIGNATURES);

export async function saveUploadedImage(
  file: unknown
): Promise<{ success: boolean; url?: string; message?: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: 'No image was received. Please choose the file again.' };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, message: 'Please choose an image of 4.5MB or less.' };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = STORED_IMAGE_TYPES.find((type) => SIGNATURES[type](bytes));
  if (!mimeType) {
    return { success: false, message: 'Please upload a JPG, PNG, GIF or WebP image.' };
  }

  await connectDB();
  const saved = await StoredImage.create({ data: bytes, mimeType, size: bytes.length });
  return { success: true, url: `${URL_PREFIX}${saved._id}` };
}

/** Deletes an image saved by saveUploadedImage. Other URLs (FutbolCore, old CDN) are left alone. */
export async function deleteStoredImage(url: string | undefined | null): Promise<void> {
  if (!url || !url.startsWith(URL_PREFIX)) return;
  const id = url.slice(URL_PREFIX.length);
  if (!/^[0-9a-f]{24}$/i.test(id)) return;
  try {
    await connectDB();
    await StoredImage.findByIdAndDelete(id);
  } catch (error) {
    console.error('[imageStore] could not delete image:', error);
  }
}
