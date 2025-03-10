import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  const formattedMessage =
    typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  return `${timestamp} [${level}]: ${formattedMessage}`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    customFormat
  ),
  transports: [new winston.transports.Console({})],
});
