// electron-log v5 ships only CJS. With main-process CJS output (see
// electron-vite config + package.json), we can require it directly.
import log from 'electron-log/main';

log.initialize();
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

export const logger = log.scope('snapora');
export default logger;
