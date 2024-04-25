import Axios from "./caller.service";
import router from "@/router";
import store from '../store';

let login = (login) => {
    return Axios.post('/login', login)
}

let logout = () => {
    localStorage.clear("token")
    localStorage.clear("userId")
    localStorage.clear("username")
    localStorage.clear("isSimulation")    
    Axios.defaults.baseURL = "http://localhost:8080/api/production";
    router.push('/');
}

let saveToken = (token, userId, userName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId)
    localStorage.setItem('userName', userName)
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
