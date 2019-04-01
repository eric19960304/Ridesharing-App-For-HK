import StorageManager from "./storageManager";

const storageManager = StorageManager.getInstance();

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

const POST = (url, body, callbackFn) => {
    fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if(callbackFn && isFunction(callbackFn)){
                callbackFn(responseJson);
            }
        })
}

const POSTWithJWT = (url, body, callbackFn) => {
    const jwt = storageManager.get('jwt');
    fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'JWT': jwt
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if(callbackFn && isFunction(callbackFn)){
                callbackFn(responseJson);
            }
        })
}



export default {
    POST,
    POSTWithJWT
};