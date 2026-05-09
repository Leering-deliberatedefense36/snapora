/**
 * S3-compatible upload provider (AWS S3, Cloudflare R2, Backblaze B2, MinIO, etc.).
 *
 * v0.1 — stub. Implemented in milestone v0.6 using `@aws-sdk/client-s3`.
 */
import type { UploadProvider } from '@main/upload/index';

export const s3Provider: UploadProvider = {
  id: 's3',
  displayName: 'S3-compatible',
  async upload() {
    throw new Error('S3 upload not yet implemented. See ROADMAP.md → v0.6.');
  },
};
