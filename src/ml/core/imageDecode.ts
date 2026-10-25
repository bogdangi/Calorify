// Safari can decode HEIC (iPhone camera/gallery photos) inside an <img>
// element but NOT via createImageBitmap — the WebKit API throws for HEIC
// even though the same blob renders in a preview. Try the fast bitmap path
// first, fall back to <img> decode so iOS photos don't kill every head.
export interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
}

export async function decodeImage(image: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(image);
      return { source: bitmap, width: bitmap.width, height: bitmap.height };
    } catch {
      // fall through to <img> decode
    }
  }

  const url = URL.createObjectURL(image);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}
