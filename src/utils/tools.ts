export function convertToUTCTime(date: Date) {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}