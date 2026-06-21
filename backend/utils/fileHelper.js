/**
 * Formats the saved path for file uploads.
 * If uploaded to Cloudinary, file.path contains the full secure HTTP URL.
 * If uploaded to local disk storage, we construct the local relative endpoint.
 */
export const getUploadedFilePath = (file) => {
  if (!file) return '';
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  return `/uploads/${file.filename}`;
};
