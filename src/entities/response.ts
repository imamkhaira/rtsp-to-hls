export interface ResponseInterface {
    error: boolean;
    message: string;
    more_info: string;
    data: any;
}

/** create a new Response object */
export default class Response implements ResponseInterface {
    constructor(
        public data: any,
        public error = false,
        public message = 'OK',
        public more_info = '',
    ) {}

    public get json() {
        return JSON.stringify(this);
    }
}
