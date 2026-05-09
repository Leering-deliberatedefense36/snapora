import { session } from 'electron';

/**
 * Apply Content-Security-Policy as a response header rather than a `<meta>` tag.
 * This lets us relax it for dev (Vite HMR uses ws://) and tighten it for prod.
 *
 * The renderer is sandboxed and contextIsolation is on, so CSP is defense in
 * depth: it limits what *bundled* scripts/styles can do if they're ever
 * compromised, but contextIsolation already prevents the renderer from
 * touching Node directly.
 */
export function installContentSecurityPolicy(): void {
  const isDev = !!process.env.ELECTRON_RENDERER_URL;

  const directives = [
    "default-src 'self'",
    `script-src 'self'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'", // Tailwind + React inline-style
    "img-src 'self' data: blob: file:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? ' ws://localhost:* http://localhost:* https://localhost:*' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ];

  const csp = directives.join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
      },
    });
  });
}
