import pino from 'pino';
import fs from 'fs';
import path from 'path';

const BASE_LOG_DIR = path.join('logs');

export const logger = (category: string) => {
  const logDir = path.join(BASE_LOG_DIR, category);
  const logFile = path.join(logDir, 'log.txt');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return pino({
    level: 'info',
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: { colorize: true },
        },
        {
          target: 'pino/file',
          options: { destination: logFile },
        },
      ],
    },
  });
};
