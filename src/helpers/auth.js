import config from "../../config";
import StorageManager from "./storageManager";
import creator from "./creator";
import networkClient from "./networkClient";

const storageManager = StorageManager.getInstance();

const loginSignupCommon = async(user, url, successMessage) => {
    let result = {
        isSuccess: false,
        message: 'something go wrong, please try again later!'
    };

    const body = user;
    const response = await networkClient.POST(url, body);
    if(response.jwt){

        const tempUser = creator.createUser({
            email: user.email
        });

        storageManager.set('user', user);
        storageManager.set('jwt', response.jwt);

        result = {
            isSuccess: true,
            message: successMessage
        };
    }else if(response.message){
        result = {
            isSuccess: false,
            message: response.message
        };
    }

    return result;
}

const login = async(email, password) => {
    const url = config.serverURL + '/user/login';
    const successMessage = "Login successful!";
    const user ={
       email: email.toLowerCase(),
       password,
    };
    
    try{
        return await loginSignupCommon(user, url, successMessage);
    }catch(e){
        console.log(e);
    }
    
}

const signup = async(email, password, username) => {
    const url = config.serverURL + '/user/signup';
    const successMessage = "Signup successful!";
    const user ={
        email: email.toLowerCase(),
        username,
        password,
     };
    try{
        return await loginSignupCommon(user, url, successMessage);
    }catch(e){
        console.log(e);
    }
}

export default {
    login,
    signup
};