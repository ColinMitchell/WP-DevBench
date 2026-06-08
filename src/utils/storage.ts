const getStoragePrefix = (): string => {
    return window.wpDevBench?.storagePrefix || "wp-devbench";
};

const getStorageKey = (key: string): string => {
    return `${getStoragePrefix()}:${key}`;
};

const storage = {
    getItem(key: string): string | null {
        return localStorage.getItem(getStorageKey(key));
    },

    setItem(key: string, value: string): void {
        localStorage.setItem(getStorageKey(key), value);
    },

    removeItem(key: string): void {
        localStorage.removeItem(getStorageKey(key));
    },
};

export { getStorageKey, storage };
