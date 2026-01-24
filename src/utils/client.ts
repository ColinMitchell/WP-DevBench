import wretch from "wretch";

import abort from "wretch/addons/abort";

// Instantiate and configure wretch
const createApiClient = (baseUrl: string) =>
	wretch(baseUrl, { mode: "cors", cache: "no-store" })
		.addon(abort())
		.errorType("json")
		.resolve((r) => r.json());

const apiClient = createApiClient(window.wpDevBench.apiUrl).headers({ "X-WP-Nonce": window.wpDevBench.nonce });

export { apiClient };
