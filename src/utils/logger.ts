import pino, { BaseLogger } from "pino";
import fs from "fs";
import path from "path";

const BASE_LOG_DIR = path.join("logs");

export type LoggerType = (entity: string) => BaseLogger;

export const logger = (entity: string): BaseLogger => {
  const logDir = path.join(BASE_LOG_DIR, entity);
  const logFile = path.join(logDir, "log.txt");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return pino({
    level: "info",
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
          },
        },
        {
          target: "pino/file",
          options: { destination: logFile },
        },
      ],
    },
  });
};
