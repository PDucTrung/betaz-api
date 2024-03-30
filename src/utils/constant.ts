import dotenv from "dotenv";
dotenv.config();
export const EACH_HOUR = '0 * * * *';                           // Every 1 hour
export const EACH_3_HOUR = '0 */3 * * *';                       // Every 3 hours
export const EACH_MINUTE = '* * * * *';                         // Every 1 minute
export const EACH_3_MINUTES = '*/3 * * * *';                    // Every 3 minute
export const EACH_5_MINUTES = '*/5 * * * *';                    // Every 5 minute
export const EACH_7_MINUTES = '*/7 * * * *';                    // Every 7 minute
export const EACH_11_MINUTES = '*/11 * * * *';                  // Every 11 minute
export const EACH_13_MINUTES = '*/13 * * * *';                  // Every 13 minute
export const EACH_15_MINUTES = '*/15 * * * *';                  // Every 15 minute
export const EACH_30_MINUTES = '*/30 * * * *';                  // Every 30 minutes
export const EACH_SECOND = '*/1 * * * * *';                     // Every 1 second
export const EACH_3_SECONDS = '*/3 * * * * *';                  // Every 3 seconds
export const EACH_5_SECONDS = '*/5 * * * * *';                  // Every 5 seconds
export const EACH_7_SECONDS = '*/7 * * * * *';                  // Every 7 seconds
export const EACH_11_SECONDS = '*/11 * * * * *';                // Every 11 seconds
export const EACH_13_SECONDS = '*/13 * * * * *';                // Every 13 seconds
export const EACH_10_SECONDS = '*/10 * * * * *';                // Every 10 seconds
export const EACH_15_SECONDS = '*/15 * * * * *';                // Every 15 seconds
export const EACH_30_SECONDS = '*/30 * * * * *';                // Every 30 seconds
export const STATUS = {
    FAILED: 'FAILED',
    OK: 'OK'
}
export const HEX_TRUST_CONFIG = {
    URL: process.env.HEX_TRUST_URL ?? "localhost",
    API_KEY: process.env.HEX_TRUST_URL ?? "undefined",
}

export const MESSAGE = {
    SUCCESS: "SUCCESS",
    NO_INPUT: "No Input",
    NO_ADDRESS: "No address",
    INVALID_ADDRESS: "Invalid Address",
    INVALID_INPUT: "Invalid Input",
    INVALID_AUTHENTICATION: "Invalid Authentication",
    NOT_EXIST_ADDRESS: "Not Exist Address",
    INPUT_ALREADY_EXIST: "Input already exist",
}

export const CRONJOB_TIME = {
    AZ_EVENTS_COLLECTOR: process.env.CRONJOB_TIME_AZ_EVENTS_COLLECTOR ?? EACH_3_HOUR,
};

export const CRONJOB_ENABLE = {
    AZ_EVENTS_COLLECTOR: (process.env.IS_ENABLE_JOB_AZ_EVENTS_COLLECTOR == "true"),
};

export const CONFIG_TYPE_NAME = {
    AZ_EVENTS_COLLECTOR: "CronJobAzEventsCollector",
};

export enum SOCKET_STATUS  {
    CONNECTED = "connected",
    READY = "ready",
    ERROR = "error",
}
export let global_vars = {
    socketStatus: "error",
    socketStatusLocal: "error",
    caller: process.env.DEFAULT_CALLER_ADDRESS ? process.env.DEFAULT_CALLER_ADDRESS : '',
    isScanning: false,
};