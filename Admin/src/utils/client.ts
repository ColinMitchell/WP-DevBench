import wretch from "wretch";
import {WretchResponse} from "wretch";
import abort from 'wretch/addons/abort';

type WretchError = Error & {
    status: number;
    response: WretchResponse;
    text?: string;
    json?: Object;
};

// Instantiate and configure wretch
const createApiClient = (baseUrl: string) =>
    wretch(baseUrl, {mode: "cors", cache: "no-store"})
        .addon(abort())
        .errorType("json")
        .resolve(r => r.json());

const apiClient = createApiClient(window.wpDevBench.apiUrl)
    .headers({'X-WP-Nonce': window.wpDevBench.nonce});

export {apiClient};
