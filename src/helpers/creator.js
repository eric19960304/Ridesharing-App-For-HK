const createUser = (user) => {
    const defaultValues = {
        'email': '',
        'username': '',
        'pic': '',
        'homeAddress': '',
        'workAddress': ''
    }
    return Object.assign(defaultValues, user);
}

export default {
    createUser
};