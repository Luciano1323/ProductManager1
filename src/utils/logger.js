const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const path = require('path');

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  })
);

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const devLogger = createLogger({
  levels,
  level: 'debug',
  format: consoleFormat,
  transports: [
    new transports.Console(),
  ],
});

const prodLogger = createLogger({
  levels,
  level: 'info',
  format: fileFormat,
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
    new transports.File({
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error',
    }),
  ],
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

module.exports = logger;
