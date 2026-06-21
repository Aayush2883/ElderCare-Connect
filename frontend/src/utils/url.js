/**
 * Utility to format asset upload URLs.
 * Prefixes relative paths (like /uploads/...) with the production backend URL when deployed,
 * while allowing relative paths to trigger Vite dev proxy during local development.
 */
export const getUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // VITE_API_URL can be set to the backend production domain (e.g., https://eldercare-backend.onrender.com)
  const backendUrl = import.meta.env.VITE_API_URL || '';
  return `${backendUrl}${path}`;
};
