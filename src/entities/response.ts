export * as StatusCodes from 'http-status-codes';
export interface ResponseInterface {
    error: boolean;
    message: string;
    more_info: string;
    data: any;
}

/** create a new Response object */
export default (
    data: any,
    error = false,
    status_message = 'OK',
    more_info = '',
) =>
    JSON.stringify({
        data,
        error,
        status_message,
        more_info,
    });
