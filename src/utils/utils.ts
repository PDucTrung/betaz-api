import dotenv from "dotenv";
dotenv.config();

import winston from "winston";
export const logger = winston.createLogger({
    level: "silly",
    format: winston.format.combine(
        winston.format.timestamp(), // adds a timestamp property
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: "logs/backend_error.log", level: "error"}),
        new winston.transports.File({filename: "logs/backend_info.log", level: "info"}),
        new winston.transports.File({filename: "logs/backend_warn.log", level: "warn"}),
        new winston.transports.File({filename: "logs/backend.log"}),
    ],
});

export function convertToUTCTime(date: Date) {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

export function delay(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}