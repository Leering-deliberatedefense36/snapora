import type { SnaporaApi } from '@shared/ipc';

declare global {
  interface Window {
    snapora: SnaporaApi;
  }
}

export {};
