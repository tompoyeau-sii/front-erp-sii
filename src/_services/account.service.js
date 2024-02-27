import Axios from "./caller.service";
import router from "@/router";
import store from '../store';

let login = (login) => {
    return Axios.post('/login', login)
}

let logout = () => {
    localStorage.clear("token")
    router.push('/');
}

let saveToken = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('connected', true);
    setAuthHeader(token);
}

let getToken = () => {
    return localStorage.getItem('token');
}

let setAuthHeader = (token) => {
    Axios.defaults.headers.common['Authorization'] = `${token}`; // Utiliser Bearer pour indiquer que c'est un token JWT
}

let isLogged = () => {
    return localStorage.getItem('token') ? true : false
}

export const accountService = {
    login,
    logout,
    saveToken,
    isLogged,
    getToken
}
