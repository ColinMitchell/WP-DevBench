import {RJSFSchema} from "@rjsf/utils";

declare global {
    interface DevBenchInterface {
        apiDocsUrl: string;
        apiUrl: string;
        baseApiUrl: string;
        currentBlogId: number;
        userName: string;
        userRole: string;
    }

	interface Window {
		wpDevBench: DevBenchInterface;
	}
}

interface NavItem {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	icon?: any;
	label?: string;
	description?: string;
	roles: string[];
}

interface FuncInterface {
	class: string;
	funcName: string;
	params: null | RJSFSchema;
	name: string;
	description?: string;
}

export {FuncInterface, NavItem};