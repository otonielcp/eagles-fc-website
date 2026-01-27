import { SITE_IMAGES } from './site-images.generated';

/**
 * Returns Cloudinary URL for a site image path (e.g. "/mainlogo.png").
 * If the image was uploaded via `npm run upload-site-images`, returns the Cloudinary URL.
 * Otherwise falls back to the local path (works before upload or for missing entries).
 */
export function getSiteImage(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return SITE_IMAGES[normalized] ?? normalized;
}

export { SITE_IMAGES };
