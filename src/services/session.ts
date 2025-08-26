import * as SecureStore from 'expo-secure-store';

const KEY = 'sfis.session';

export type StoredSession = {
    token: string;
    usuario?: any;
    keepConnected: boolean;
    expiresAt: number; // epoch ms
};

const daysToMs = (d: number) => d * 24 * 60 * 60 * 1000;

export async function saveSession(
    data: { token: string; usuario?: any },
    keepConnected: boolean,
    ttlDays = 14
) {
    const payload: StoredSession = {
        ...data,
        keepConnected,
        expiresAt: Date.now() + daysToMs(ttlDays),
    };
    await SecureStore.setItemAsync(KEY, JSON.stringify(payload));
    return payload;
}

export async function loadSession(): Promise<StoredSession | null> {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return null;
    try {
        const parsed: StoredSession = JSON.parse(raw);
        if (parsed.expiresAt > Date.now()) return parsed;
    } catch {}
    await SecureStore.deleteItemAsync(KEY);
    return null;
}

export async function clearSession() {
    await SecureStore.deleteItemAsync(KEY);
}

export async function renewSession(ttlDays = 14) {
    const s = await loadSession();
    if (!s) return null;
    s.expiresAt = Date.now() + daysToMs(ttlDays);
    await SecureStore.setItemAsync(KEY, JSON.stringify(s));
    return s;
}