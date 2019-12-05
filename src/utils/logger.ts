import * as winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.colorize()),
  transports: [
    new WinstonDailyRotateFile({
      auditFile: './log/audit.json',
      filename: './log/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '3d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
