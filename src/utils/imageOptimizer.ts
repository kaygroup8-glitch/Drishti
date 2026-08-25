/**
 * Fast client-side image optimizer for fast AI visual processing
 * Resizes large smartphone images (which can be 8MB-20MB) down to crisp ~200KB payloads
 * without losing any accessibility barrier details.
 */
export async function optimizeImageForAnalysis(
  fileOrDataUrl: File | string,
  maxDimension: number = 1280,
  quality: number = 0.85
): Promise<{ base64: string; mimeType: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate constrained dimensions
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Draw onto canvas for fast client-side compression
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback: return original if canvas fails
        if (typeof fileOrDataUrl === 'string') {
          resolve({ base64: fileOrDataUrl, mimeType: 'image/jpeg', width, height });
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve({ base64: reader.result as string, mimeType: fileOrDataUrl.type || 'image/jpeg', width, height });
          reader.onerror = reject;
          reader.readAsDataURL(fileOrDataUrl);
        }
        return;
      }

      // Render crisp image
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({
        base64: optimizedDataUrl,
        mimeType: 'image/jpeg',
        width,
        height,
      });
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image for optimization: ' + err));
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
