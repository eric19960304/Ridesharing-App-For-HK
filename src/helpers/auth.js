import config from "../../config";

const loginSignupCommon = async(email, password, url) => {
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
        return {
            isSuccess: true,
            jwt: responseJson.jwt
        }
    }

    return {
        isSuccess: false,
        message: responseJson.message || defaultMessage
    }
}

const login = async(email, password) => {
    const url = config.serverURL + '/user/login';
    try{
        return await loginSignupCommon(email, password, url);
    }catch(e){
        console.log(e);
    }
    
}

const signup = async(email, password) => {
    const url = config.serverURL + '/user/signup';
    try{
        return await loginSignupCommon(email, password, url);
    }catch(e){
        console.log(e);
    }
}

export default {
    login,
    signup
};