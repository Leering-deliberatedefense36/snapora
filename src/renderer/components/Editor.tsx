import { useEffect, useState } from 'react';

/**
 * v0.1 — placeholder editor that shows the captured image.
 * v0.3 — replace with Konva-based annotation canvas (arrows, text, blur, etc.)
 */
export function Editor() {
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    const off = window.snapora.editor.onImageReady((p: string) => setImagePath(p));
    return off;
  }, []);

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-11 items-center justify-between border-b border-white/5 px-4 pl-20">
        <div className="text-sm font-medium tracking-wide text-white/70">Snapora — Editor</div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          {imagePath ? <span className="font-mono">{shortPath(imagePath)}</span> : null}
        </div>
      </header>
      <main className="grid flex-1 place-items-center overflow-auto p-8">
        {imagePath ? (
          <img
            src={`file://${imagePath}`}
            alt="captured"
            className="max-h-full max-w-full rounded-md shadow-2xl ring-1 ring-white/5"
          />
        ) : (
          <div className="text-center text-white/40">
            <p className="text-sm">No capture yet</p>
            <p className="mt-1 text-xs">Press your hotkey to take a screenshot.</p>
          </div>
        )}
      </main>
      <footer className="flex h-9 items-center justify-end gap-3 border-t border-white/5 px-4 text-xs text-white/40">
        <span>Annotation tools coming in v0.3 — see ROADMAP.md</span>
      </footer>
    </div>
  );
}

function shortPath(p: string): string {
  const parts = p.split('/');
  if (parts.length <= 4) return p;
  return `…/${parts.slice(-3).join('/')}`;
}
