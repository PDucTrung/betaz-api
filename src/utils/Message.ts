export type ResponseBody = {
    status: string,
    message: string,
    errorCode?: string,
    ret?: never,
    data?: object,
}