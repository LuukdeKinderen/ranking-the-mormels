export function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function makeRoomCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function setInStorage(key, data) {
    // if (process.env.NODE_ENV === 'production') {
    //     localStorage.setItem(key, JSON.stringify(data))
    // } else {
        sessionStorage.setItem(key, JSON.stringify(data))
    // }
}

export function getFromStorage(key) {
    // if (process.env.NODE_ENV === 'production') {
    //     return JSON.parse(localStorage.getItem(key))
    // } else {
        return JSON.parse(sessionStorage.getItem(key))
    // }
}