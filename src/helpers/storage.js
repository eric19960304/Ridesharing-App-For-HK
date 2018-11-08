import { AsyncStorage } from "react-native"

const storeToPersistent = async (key, value) => {
    return await AsyncStorage.setItem(key, value);
}

const getFromPersistent = async (key) => {
    return await AsyncStorage.getItem(key) || null;
}

const removeFromPersistent = async (key) => {
    return await AsyncStorage.removeItem(key);
}

export default class StorageManager {
    /* Singleton storage  */
    static instance = null;

    /* data */
    _user = null;

    /**
     * @returns {StorageManager}
     */
    static getInstance() {
        if (StorageManager.instance == null) {
            StorageManager.instance = new StorageManager();
        }

        return this.instance;
    }

    isUserExist(){
        return _user !== null;
    }

    getUser() {
        return this._user;
    }

    setUser(user) {
        this._user = JSON.stringify(user);
        storeToPersistent('user', this._user)
        .then(()=>{})
        .catch(e=>{
            console.log(e);
        });
    }

    removeUser(){
        this._user = null;
        removeFromPersistent('user')
        .then(()=>{})
        .catch(e=>{
            console.log(e);
        });
    }

    async loadDataFromPersistance(){
        try{
            const user = await getFromPersistent('user');
            this._user = JSON.parse(user);
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }
}