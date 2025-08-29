import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'sfis.session';
const USER_KEY = `${KEY}.usuario`;

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
        token: data.token,
        keepConnected,
        expiresAt: Date.now() + daysToMs(ttlDays),
    };
    await SecureStore.setItemAsync(KEY, JSON.stringify(payload));
    if (data.usuario) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
        payload.usuario = data.usuario;
    } else {
        await AsyncStorage.removeItem(USER_KEY);
    }
    return payload;
}

export async function loadSession(): Promise<StoredSession | null> {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return null;
    try {
        const parsed: StoredSession = JSON.parse(raw);
        if (parsed.expiresAt > Date.now()) {
            const userRaw = await AsyncStorage.getItem(USER_KEY);
            if (userRaw) parsed.usuario = JSON.parse(userRaw);
            return parsed;
        }
    } catch {}
    await SecureStore.deleteItemAsync(KEY);
    await AsyncStorage.removeItem(USER_KEY);
    return null;
}

export async function clearSession() {
    await SecureStore.deleteItemAsync(KEY);
    await AsyncStorage.removeItem(USER_KEY);
}

export async function renewSession(ttlDays = 14) {
    const s = await loadSession();
    if (!s) return null;
    s.expiresAt = Date.now() + daysToMs(ttlDays);
    const toStore: StoredSession = {
        token: s.token,
        keepConnected: s.keepConnected,
        expiresAt: s.expiresAt,
    };
    await SecureStore.setItemAsync(KEY, JSON.stringify(toStore));
    return s;
}
