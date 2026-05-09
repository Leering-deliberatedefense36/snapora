/**
 * Upload provider abstraction.
 *
 * Each provider is a small implementation of `UploadProvider`. Built-ins
 * (S3, R2, B2, WebDAV, ShareX-format custom) plug in here. A future hosted
 * `snapora.cloud` would be just another provider.
 *
 * v0.1 — stub. Implemented in milestone v0.6.
 */

export interface UploadProgress {
  bytes: number;
  total: number;
}

export interface UploadInput {
  filePath: string;
  contentType: string;
  /** Optional preferred remote object key — provider may transform it. */
  preferredKey?: string;
}

export interface UploadResult {
  remoteUrl: string;
  shortUrl?: string;
  provider: string;
}

export interface UploadProvider {
  readonly id: string;
  readonly displayName: string;
  upload(input: UploadInput, onProgress?: (p: UploadProgress) => void): Promise<UploadResult>;
}

const providers = new Map<string, UploadProvider>();

export function registerProvider(p: UploadProvider): void {
  providers.set(p.id, p);
}

export function getProvider(id: string): UploadProvider | undefined {
  return providers.get(id);
}

export function listProviders(): UploadProvider[] {
  return Array.from(providers.values());
}
