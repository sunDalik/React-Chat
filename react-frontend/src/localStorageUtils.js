export const storage = {
    username: {key: "name", default: "Anonymous"}
};
const storageName = "React_chat";

export function initLocalStorage() {
    const stored = window.localStorage[storageName] ? JSON.parse(window.localStorage[storageName]) : {};
    for (const entry of Object.values(storage)) {
        if (stored[entry.key] === undefined) {
            stored[entry.key] = entry.default;
        }
    }
    window.localStorage[storageName] = JSON.stringify(stored);
}

export function readLocalStorageEntry(entry) {
    const stored = JSON.parse(window.localStorage[storageName]);
    return stored[entry.key];
}

export function writeLocalStorageEntry(entry, value) {
    const stored = JSON.parse(window.localStorage[storageName]);
    stored[entry.key] = value;
    window.localStorage[storageName] = JSON.stringify(stored);
}