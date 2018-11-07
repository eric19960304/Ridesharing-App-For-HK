import { AsyncStorage } from "react-native"

const store = async (key, value) => {
    return await AsyncStorage.setItem(key, value);
}

const get = async (key) => {
    return await AsyncStorage.getItem(key) || null;
}

const remove = async (key) => {
    await AsyncStorage.removeItem(key);
}

export default {
    store,
    get,
    remove
};