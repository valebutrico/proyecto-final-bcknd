import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

class Logger {
  constructor() {
    this.logFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });

    this.logger = createLogger({
      format: combine(
        label({ label: "right meow!" }),
        timestamp(),
        this.logFormat
      ),
      transports: [
        new transports.Console({
          level: "debug",
        }),
        new transports.File({ filename: "errors.log", level: "error" }),
      ],
    });

    if (process.env.NODE_ENV === "production") {
      this.logger.transports.find(
        (t) => t instanceof transports.Console
      ).level = "info";
    }
  }

  debug(message) {
    this.logger.debug(message);
  }

  http(message) {
    this.logger.http(message);
  }

  info(message) {
    this.logger.info(message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  error(message) {
    this.logger.error(message);
  }

  fatal(message) {
    this.logger.error(message);
  }
}

const logger = new Logger();
export default logger;
