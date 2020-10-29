export * as StatusCodes from 'http-status-codes';

/** create a new Response object */
class Response {
    constructor(
        readonly payload: any,
        readonly error: boolean,
        readonly message: string,
    ) {}

    public to_json() {
        return JSON.stringify({
            payload: this.payload,
            error: this.error,
            message: this.message,
        });
    }
}

const create_response = (payload: any, error = false, message = '') =>
    new Response(payload, error, message);

export default create_response;
