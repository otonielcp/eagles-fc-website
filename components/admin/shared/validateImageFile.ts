import { toast } from "sonner";

// Server actions accept at most 5mb per request (next.config.ts), and the
// multipart encoding adds overhead, so the file itself has to stay below that.
export const MAX_IMAGE_UPLOAD_MB = 4.5;
const MAX_IMAGE_UPLOAD_BYTES = MAX_IMAGE_UPLOAD_MB * 1024 * 1024;

/**
 * Client-side check for admin image uploads. Shows a toast and returns false
 * when the file is not an image or is too large to send to a server action.
 */
export function validateImageFile(file: File): boolean {
  if (!file.type.startsWith("image/")) {
    toast.error("Please choose an image file (JPG, PNG, GIF or WebP).");
    return false;
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    toast.error(
      `This image is ${sizeMb}MB. Please choose an image of ${MAX_IMAGE_UPLOAD_MB}MB or less.`
    );
    return false;
  }

  return true;
}
