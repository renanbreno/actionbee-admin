import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp" as const,
};

export async function compressImage(file: File): Promise<File> {
  // Skip if already small enough (< 500KB)
  if (file.size < 500 * 1024) {
    return file;
  }

  const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

  // Build a new filename with .webp extension
  const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
  return new File([compressed], `${nameWithoutExt}.webp`, {
    type: "image/webp",
  });
}

export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}
