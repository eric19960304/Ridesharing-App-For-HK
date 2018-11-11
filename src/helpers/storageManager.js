import { AsyncStorage } from "react-native"

const storeToPersistent = async (key, value) => {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
}

const getFromPersistent = async (key) => {
    const obj = await AsyncStorage.getItem(key);
    if(obj){
        return JSON.parse(obj);
    }else{
        return null;
    }
}

const removeFromPersistent = async (key) => {
    return await AsyncStorage.removeItem(key);
}


const keyList = ['user', 'jwt'];
export default class StorageManager {
    /* Singleton storage  */
    static instance = null;

    /* private data */
    user = null;
    jwt = null;

    /**
     * @returns {StorageManager}
     */
    static getInstance() {
        if (StorageManager.instance == null) {
            StorageManager.instance = new StorageManager();
        }

        return this.instance;
    }

    store(key, obj){
        this[key] = obj;
        storeToPersistent(key, obj)
        .then(()=>{})
        .catch(e=>{
            console.log(e);
        });
    }

    async loadDataFromPersistance(key){
        try{
            const obj = await getFromPersistent(key);
            this[key] = obj;
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    async loadAllDataFromPersistance(){
        for(key in keyList){
            await this.loadDataFromPersistance(key);
        }
        return true;
    }

    isExist(key){
        return this[key] !== null;
    }

    get(key) {
        // clone a new object instead of return the reference!
        if(this[key]){
            return Object.assign({}, this[key]);
        }else{
            return this[key];
        }
    }

    set(key, obj) {
        this.store(key, obj);
    }

    update(key, obj) {
        /* update partial fields only */
        const currentObj = this.get(key);
        const newObj = Object.assign(currentObj, obj);
        this.store(key, newObj);
    }

    remove(key){
        this[key] = null;
        removeFromPersistent(key)
        .then(()=>{})
        .catch(e=>{
            console.log(e);
        });
    }

}