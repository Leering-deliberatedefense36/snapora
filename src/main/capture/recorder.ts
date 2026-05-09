import logger from '@main/logger';

/**
 * Recording is implemented via a bundled `ffmpeg` binary using the `avfoundation`
 * input on macOS. We'll resolve the binary at runtime from `resources/bin/ffmpeg`
 * (extracted via electron-builder `extraResources`).
 *
 * v0.1 — stub. Implemented in milestone v0.4.
 *
 * Sketch:
 *   ffmpeg -f avfoundation -framerate 60 -i "<screen-index>:<audio-index>" \
 *          -vcodec h264 -pix_fmt yuv420p -movflags +faststart out.mp4
 */
export async function startRecording(): Promise<never> {
  logger.warn('recorder: not implemented yet (target: v0.4)');
  throw new Error('Recording is not yet implemented. See ROADMAP.md → v0.4.');
}

export async function stopRecording(): Promise<never> {
  throw new Error('Recording is not yet implemented. See ROADMAP.md → v0.4.');
}
