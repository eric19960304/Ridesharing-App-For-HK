import config from "../../config";
import StorageManager from "./storageManager";

const storageManager = StorageManager.getInstance();

const loginSignupCommon = async(email, password, url, successMessage) => {
    const defaultMessage = 'something go wrong, please try again later!';
    let responseJson = null;
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.toLowerCase(),
                password
            }),
        });
        responseJson = await response.json();
    }catch(e){
        console.log(e);
    }
    
    if(responseJson.jwt){

        const user = {
            email,
            jwt: responseJson.jwt
        }
          
        storageManager.setUser(user);

        return {
            isSuccess: true,
            message: successMessage
        }
    }

    return {
        isSuccess: false,
        message: responseJson.message || defaultMessage
    }
}

const login = async(email, password) => {
    const url = config.serverURL + '/user/login';
    const successMessage = "Login successful!";
    try{
        return await loginSignupCommon(email, password, url, successMessage);
    }catch(e){
        console.log(e);
    }
    
}

const signup = async(email, password) => {
    const url = config.serverURL + '/user/signup';
    const successMessage = "Signup successful!";
    try{
        return await loginSignupCommon(email, password, url, successMessage);
    }catch(e){
        console.log(e);
    }
}

export default {
    login,
    signup
};