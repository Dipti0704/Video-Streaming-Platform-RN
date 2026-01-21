import { NativeModules, Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const isMMKVAvailable = Platform.OS !== 'web' && !!NativeModules.MMKV;

const createStore = (id: string) => {
    if (!isMMKVAvailable) return null;
    return new MMKV({ id, encryptionKey: 'some-secret-key' });
};

const tokenStore = createStore('token-storage');
const appStore = createStore('my-app-storage');
const memoryStore = new Map<string, string>();

// Small helpers to keep the interface consistent between MMKV and fallback memory storage.
const setToken = (key: string, value: string) => {
    if (tokenStore) {
        tokenStore.set(key, value);
        return;
    }
    memoryStore.set(`token:${key}`, value);
};

const getToken = (key: string) => {
    if (tokenStore) return tokenStore.getString(key) ?? null;
    return memoryStore.get(`token:${key}`) ?? null;
};

const removeToken = (key: string) => {
    if (tokenStore) {
        tokenStore.delete(key);
        return;
    }
    memoryStore.delete(`token:${key}`);
};

const clearTokens = () => {
    if (tokenStore) tokenStore.clearAll();
    Array.from(memoryStore.keys())
        .filter(key => key.startsWith('token:'))
        .forEach(key => memoryStore.delete(key));
};

export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        if (appStore) appStore.set(key, value);
        else memoryStore.set(key, value);
    },
    getItem: (key: string) => {
        if (appStore) return appStore.getString(key) ?? null;
        return memoryStore.get(key) ?? null;
    },
    getString: (key: string) => {
        if (appStore) return appStore.getString(key) ?? null;
        return memoryStore.get(key) ?? null;
    },
    removeItem: (key: string) => {
        if (appStore) appStore.delete(key);
        else memoryStore.delete(key);
    },
};

export const tokenStorage = {
    setItem: setToken,
    set: setToken,
    getItem: getToken,
    getString: getToken,
    get: getToken,
    removeItem: removeToken,
    remove: removeToken,
    clearAll: clearTokens,
};
