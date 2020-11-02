interface IAPIResponse {
    timestamp: number;
    code: number;
    message: string;
    payload: any;
}

class APIResponse implements IAPIResponse {
    constructor(
        readonly payload: any,
        readonly code: number,
        readonly message: string,
        readonly timestamp: number
    ) {}

    get json(): string {
        return JSON.stringify({
            timestamp: this.timestamp,
            code: this.code,
            message: this.message,
            payload: this.payload
        });
    }
}

const create_response = (payload: any, code = 200, message = 'OK') => {
    const timestamp = Date.now();
    return new APIResponse(payload, code, message, timestamp);
};

export default create_response;
