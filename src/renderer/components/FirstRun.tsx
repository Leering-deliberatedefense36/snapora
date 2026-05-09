/**
 * First-run permission wizard placeholder.
 *
 * TODO(v0.1):
 *   1. Welcome screen
 *   2. Per-permission cards: Screen Recording, Microphone, Camera
 *   3. Click "Open Settings" → window.snapora.permissions.openSystemSettings(perm)
 *   4. Poll window.snapora.permissions.list() every ~1s to update status
 *   5. After Screen Recording grant, prompt to Quit & Relaunch
 */
export function FirstRun() {
  return (
    <div className="flex h-full items-center justify-center p-12">
      <div className="text-center text-white/50">
        <h1 className="text-2xl font-medium text-white">Welcome to Snapora</h1>
        <p className="mt-3 max-w-md text-sm">First-run permission wizard — coming in v0.1.</p>
      </div>
    </div>
  );
}
