import StorageManager from "./storageManager";

const storageManager = StorageManager.getInstance();

const jwt = storageManager.get('jwt');

const POST = async (url, body) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const POSTWithJWT = async (url, body) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'JWT': jwt
            },
            body: JSON.stringify(body),
        });
        return await response.json();
    }catch(e){
        console.log(e);
    }
}

export default {
    POST,
    POSTWithJWT
};