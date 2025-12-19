export {};

declare global {
	interface Window {
		acf?: {
			addAction: (action: string, callback: () => void) => void;
		};
	}
}